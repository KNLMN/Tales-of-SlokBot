-- Tales of SlokBot - Seed Data
-- Run this after running the schema migration

-- Insert Classes
INSERT INTO public.classes (id, name, description, role, primary_stat, base_hp, base_mana, hp_per_level, mana_per_level) VALUES
(
    'warrior',
    'Warrior - Tavern Brawler',
    'Masters of melee combat who stand at the front lines. They excel at taking damage and dealing powerful physical strikes. The life of the party who can take as many slokjes as they deal.',
    'tank',
    'strength',
    150,
    50,
    15,
    3
),
(
    'mage',
    'Mage - Arcane Brewmaster',
    'Wielders of devastating arcane magic. They manipulate the elements to deal massive burst damage from range. Masters of mixing magical cocktails with explosive results.',
    'dps',
    'intellect',
    80,
    200,
    8,
    18
),
(
    'priest',
    'Priest - Holy Bartender',
    'Divine healers who keep the party alive. They can mend wounds with holy magic while supporting allies with powerful buffs. The designated caretaker who ensures everyone makes it home safely.',
    'healer',
    'spirit',
    100,
    180,
    10,
    16
);

-- Insert Warrior Abilities
INSERT INTO public.abilities (class_id, name, description, type, damage_type, base_value, mana_cost, cooldown, level_required) VALUES
(
    'warrior',
    'Heroic Strike',
    'A powerful melee attack that strikes your enemy with great force.',
    'damage',
    'physical',
    50,
    10,
    0,
    1
),
(
    'warrior',
    'Shield Block',
    'Raise your shield to block incoming damage for 6 seconds.',
    'buff',
    NULL,
    30,
    15,
    12,
    1
),
(
    'warrior',
    'Battle Shout',
    'Increases the attack power of all party members by 10% for 2 minutes.',
    'buff',
    NULL,
    10,
    20,
    120,
    1
),
(
    'warrior',
    'Mortal Strike',
    'A vicious strike that deals heavy damage and reduces healing received by 50%.',
    'damage',
    'physical',
    120,
    30,
    6,
    10
),
(
    'warrior',
    'Whirlwind',
    'Spin in a circle, dealing damage to all nearby enemies.',
    'damage',
    'physical',
    80,
    25,
    8,
    15
);

-- Insert Mage Abilities
INSERT INTO public.abilities (class_id, name, description, type, damage_type, base_value, mana_cost, cooldown, level_required) VALUES
(
    'mage',
    'Frostbolt',
    'Launch a bolt of frost at the enemy, dealing damage and slowing their movement.',
    'damage',
    'magic',
    60,
    30,
    0,
    1
),
(
    'mage',
    'Fireball',
    'Hurl a fiery ball at your target, dealing massive fire damage.',
    'damage',
    'magic',
    100,
    50,
    3,
    1
),
(
    'mage',
    'Arcane Intellect',
    'Increases the intellect of all party members by 15% for 30 minutes.',
    'buff',
    NULL,
    15,
    40,
    0,
    1
),
(
    'mage',
    'Polymorph',
    'Transform an enemy into a sheep, incapacitating them for 8 seconds.',
    'debuff',
    'magic',
    0,
    60,
    30,
    12
),
(
    'mage',
    'Pyroblast',
    'Channel devastating fire magic into a massive pyroblastic explosion.',
    'damage',
    'magic',
    250,
    100,
    12,
    20
);

-- Insert Priest Abilities
INSERT INTO public.abilities (class_id, name, description, type, damage_type, base_value, mana_cost, cooldown, level_required) VALUES
(
    'priest',
    'Flash Heal',
    'Quickly heal an ally, restoring a moderate amount of health.',
    'heal',
    'holy',
    80,
    35,
    0,
    1
),
(
    'priest',
    'Power Word: Shield',
    'Wraps an ally in a protective shield that absorbs damage.',
    'buff',
    'holy',
    60,
    40,
    15,
    1
),
(
    'priest',
    'Smite',
    'Strike an enemy with holy light, dealing damage.',
    'damage',
    'holy',
    55,
    25,
    0,
    1
),
(
    'priest',
    'Renew',
    'Heals an ally over 15 seconds.',
    'heal',
    'holy',
    120,
    30,
    0,
    8
),
(
    'priest',
    'Greater Heal',
    'A powerful healing spell that restores a large amount of health.',
    'heal',
    'holy',
    180,
    70,
    0,
    15
);

-- Insert some starter items (weapons)
INSERT INTO public.items (name, description, type, slot, rarity, level_required, strength_bonus, attack_power_bonus, vendor_price) VALUES
(
    'Rusty Sword',
    'A worn blade that has seen better days. Still sharp enough to get the job done.',
    'weapon',
    'weapon',
    'common',
    1,
    2,
    5,
    5
),
(
    'Wooden Staff',
    'A simple staff imbued with minor magical properties.',
    'weapon',
    'weapon',
    'common',
    1,
    0,
    0,
    5
);

-- Add spell_power_bonus to wooden staff
UPDATE public.items 
SET spell_power_bonus = 8 
WHERE name = 'Wooden Staff';

INSERT INTO public.items (name, description, type, slot, rarity, level_required, spirit_bonus, spell_power_bonus, vendor_price) VALUES
(
    'Apprentice Wand',
    'A basic wand for practicing healing magic.',
    'weapon',
    'weapon',
    'common',
    1,
    3,
    6,
    5
);

-- Insert starter armor pieces
INSERT INTO public.items (name, description, type, slot, rarity, level_required, stamina_bonus, armor_bonus, vendor_price) VALUES
(
    'Cloth Robe',
    'Simple cloth robes suitable for spellcasters.',
    'armor',
    'chest',
    'common',
    1,
    5,
    10,
    8
),
(
    'Leather Tunic',
    'A basic leather chestpiece offering modest protection.',
    'armor',
    'chest',
    'common',
    1,
    8,
    25,
    12
),
(
    'Chain Mail',
    'Heavy chain armor for warriors.',
    'armor',
    'chest',
    'common',
    1,
    10,
    40,
    15
);

-- Insert consumables
INSERT INTO public.items (name, description, type, slot, rarity, stackable, max_stack, vendor_price) VALUES
(
    'Minor Health Potion',
    'Restores 50 HP when consumed.',
    'consumable',
    NULL,
    'common',
    TRUE,
    20,
    2
),
(
    'Minor Mana Potion',
    'Restores 40 mana when consumed.',
    'consumable',
    NULL,
    'common',
    TRUE,
    20,
    2
),
(
    'Bread',
    'Restores 30 HP over 10 seconds. Must remain seated while eating.',
    'consumable',
    NULL,
    'common',
    TRUE,
    20,
    1
);

-- Insert a starter quest
INSERT INTO public.quests (
    name, 
    description, 
    type, 
    level_required, 
    objectives, 
    xp_reward, 
    gold_reward,
    auto_battle_enabled,
    estimated_duration
) VALUES
(
    'Welcome to the Tavern',
    'The bartender needs help clearing out some rowdy patrons from the cellar. Defeat 5 Drunk Brawlers.',
    'story',
    1,
    '[{"type": "kill", "target": "Drunk Brawler", "count": 5}]',
    100,
    10,
    TRUE,
    60
),
(
    'Fetch the Ale',
    'The tavern is running low on ale! Collect 10 Ale Barrels from the storage.',
    'daily',
    1,
    '[{"type": "collect", "target": "Ale Barrel", "count": 10}]',
    50,
    5,
    TRUE,
    45
);

-- Refresh leaderboards (they'll be empty initially)
SELECT refresh_leaderboards();

-- Grant public access to read-only tables
GRANT SELECT ON public.classes TO anon, authenticated;
GRANT SELECT ON public.abilities TO anon, authenticated;
GRANT SELECT ON public.items TO anon, authenticated;
GRANT SELECT ON public.quests TO anon, authenticated;
GRANT SELECT ON public.leaderboard_xp TO anon, authenticated;
GRANT SELECT ON public.leaderboard_slokjes TO anon, authenticated;
