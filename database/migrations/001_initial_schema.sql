-- Tales of SlokBot - Initial Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    telegram_username TEXT UNIQUE,
    slokjes_given INTEGER DEFAULT 0,
    slokjes_received INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table
CREATE TABLE public.classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    role TEXT NOT NULL, -- 'tank', 'dps', 'healer'
    primary_stat TEXT NOT NULL, -- 'strength', 'intellect', 'spirit'
    base_hp INTEGER NOT NULL,
    base_mana INTEGER NOT NULL,
    hp_per_level INTEGER NOT NULL,
    mana_per_level INTEGER NOT NULL,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Characters table
CREATE TABLE public.characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT UNIQUE NOT NULL,
    class_id TEXT NOT NULL REFERENCES public.classes(id),
    level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 60),
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    hp_current INTEGER NOT NULL,
    hp_max INTEGER NOT NULL,
    mana_current INTEGER NOT NULL,
    mana_max INTEGER NOT NULL,
    
    -- Stats
    strength INTEGER DEFAULT 10,
    intellect INTEGER DEFAULT 10,
    spirit INTEGER DEFAULT 10,
    stamina INTEGER DEFAULT 10,
    
    -- Combat stats
    attack_power INTEGER DEFAULT 0,
    spell_power INTEGER DEFAULT 0,
    armor INTEGER DEFAULT 0,
    
    -- Currencies
    gold INTEGER DEFAULT 0,
    
    -- PvP stats
    honor_points INTEGER DEFAULT 0,
    arena_rating INTEGER DEFAULT 1500,
    
    -- Appearance
    avatar_color TEXT DEFAULT '#FF6B6B',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT one_character_per_user UNIQUE(user_id)
);

-- Abilities table
CREATE TABLE public.abilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id TEXT NOT NULL REFERENCES public.classes(id),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- 'damage', 'heal', 'buff', 'debuff'
    damage_type TEXT, -- 'physical', 'magic', 'holy'
    base_value INTEGER NOT NULL,
    mana_cost INTEGER NOT NULL,
    cooldown INTEGER DEFAULT 0, -- seconds
    level_required INTEGER DEFAULT 1,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Character Abilities (unlocked abilities)
CREATE TABLE public.character_abilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    ability_id UUID NOT NULL REFERENCES public.abilities(id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(character_id, ability_id)
);

-- Items table
CREATE TABLE public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'weapon', 'armor', 'consumable', 'quest'
    slot TEXT, -- 'head', 'chest', 'legs', 'hands', 'weapon', 'trinket'
    rarity TEXT DEFAULT 'common', -- 'common', 'uncommon', 'rare', 'epic', 'legendary'
    level_required INTEGER DEFAULT 1,
    
    -- Stats bonuses
    strength_bonus INTEGER DEFAULT 0,
    intellect_bonus INTEGER DEFAULT 0,
    spirit_bonus INTEGER DEFAULT 0,
    stamina_bonus INTEGER DEFAULT 0,
    attack_power_bonus INTEGER DEFAULT 0,
    spell_power_bonus INTEGER DEFAULT 0,
    armor_bonus INTEGER DEFAULT 0,
    
    -- Item properties
    stackable BOOLEAN DEFAULT FALSE,
    max_stack INTEGER DEFAULT 1,
    vendor_price INTEGER DEFAULT 0,
    
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.items(id),
    quantity INTEGER DEFAULT 1,
    slot_position INTEGER, -- NULL if in bag, number if equipped
    is_equipped BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Slokjes table
CREATE TABLE public.slokjes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    giver_id UUID NOT NULL REFERENCES public.users(id),
    receiver_id UUID NOT NULL REFERENCES public.users(id),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent self-slokjes
    CHECK (giver_id != receiver_id)
);

-- Quests table
CREATE TABLE public.quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- 'daily', 'story', 'repeatable'
    level_required INTEGER DEFAULT 1,
    
    -- Objectives (stored as JSONB for flexibility)
    objectives JSONB NOT NULL, -- [{"type": "kill", "target": "boar", "count": 10}]
    
    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    gold_reward INTEGER DEFAULT 0,
    item_rewards JSONB, -- [{"item_id": "uuid", "quantity": 1}]
    
    -- Auto-battle configuration
    auto_battle_enabled BOOLEAN DEFAULT TRUE,
    estimated_duration INTEGER, -- seconds
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Character Quests (quest progress)
CREATE TABLE public.character_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    quest_id UUID NOT NULL REFERENCES public.quests(id),
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'abandoned'
    progress JSONB DEFAULT '[]', -- [{"objective_id": 0, "current": 5, "required": 10}]
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(character_id, quest_id, status)
);

-- Combat Logs (for history/leaderboards)
CREATE TABLE public.combat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    combat_type TEXT NOT NULL, -- 'duel', 'arena', 'dungeon'
    participants JSONB NOT NULL, -- [{"character_id": "uuid", "team": 1}]
    winner_team INTEGER,
    duration INTEGER, -- seconds
    log_data JSONB, -- detailed combat log
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboards view (materialized for performance)
CREATE MATERIALIZED VIEW public.leaderboard_xp AS
SELECT 
    c.id,
    c.name,
    c.level,
    c.xp,
    c.class_id,
    cl.name as class_name,
    u.telegram_username,
    ROW_NUMBER() OVER (ORDER BY c.level DESC, c.xp DESC) as rank
FROM public.characters c
JOIN public.classes cl ON c.class_id = cl.id
JOIN public.users u ON c.user_id = u.id
ORDER BY c.level DESC, c.xp DESC;

CREATE MATERIALIZED VIEW public.leaderboard_slokjes AS
SELECT 
    u.id,
    u.telegram_username,
    u.slokjes_received,
    u.slokjes_given,
    (u.slokjes_received - u.slokjes_given) as slokjes_balance,
    ROW_NUMBER() OVER (ORDER BY u.slokjes_received DESC) as rank
FROM public.users u
WHERE u.telegram_username IS NOT NULL
ORDER BY u.slokjes_received DESC;

-- Indexes for performance
CREATE INDEX idx_characters_user_id ON public.characters(user_id);
CREATE INDEX idx_characters_level_xp ON public.characters(level DESC, xp DESC);
CREATE INDEX idx_inventory_character_id ON public.inventory(character_id);
CREATE INDEX idx_slokjes_receiver ON public.slokjes(receiver_id);
CREATE INDEX idx_slokjes_created_at ON public.slokjes(created_at DESC);
CREATE INDEX idx_character_quests_character ON public.character_quests(character_id);
CREATE INDEX idx_combat_logs_created_at ON public.combat_logs(created_at DESC);

-- Function to refresh leaderboards
CREATE OR REPLACE FUNCTION refresh_leaderboards()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW public.leaderboard_xp;
    REFRESH MATERIALIZED VIEW public.leaderboard_slokjes;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update character updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON public.characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_quests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Characters are readable by everyone, but only owner can modify
CREATE POLICY "Characters are viewable by everyone" ON public.characters
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own character" ON public.characters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own character" ON public.characters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own character" ON public.characters
    FOR DELETE USING (auth.uid() = user_id);

-- Inventory is private
CREATE POLICY "Users can view own inventory" ON public.inventory
    FOR SELECT USING (
        character_id IN (SELECT id FROM public.characters WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can modify own inventory" ON public.inventory
    FOR ALL USING (
        character_id IN (SELECT id FROM public.characters WHERE user_id = auth.uid())
    );

-- Public tables (no RLS needed - read-only via API)
-- classes, abilities, items, quests

COMMENT ON TABLE public.users IS 'Extended user data linked to Supabase auth';
COMMENT ON TABLE public.characters IS 'Player characters with stats and progression';
COMMENT ON TABLE public.classes IS 'Available character classes';
COMMENT ON TABLE public.abilities IS 'Class abilities and spells';
COMMENT ON TABLE public.items IS 'Game items (weapons, armor, consumables)';
COMMENT ON TABLE public.slokjes IS 'Slokjes penalty system from Telegram bot';
COMMENT ON TABLE public.quests IS 'Available quests and missions';
COMMENT ON TABLE public.combat_logs IS 'Historical combat data for leaderboards';
