// User types
export interface User {
  id: string;
  telegram_username?: string;
  slokjes_given: number;
  slokjes_received: number;
  created_at: string;
  updated_at: string;
}

// Class types
export interface Class {
  id: string;
  name: string;
  description: string;
  role: 'tank' | 'dps' | 'healer';
  primary_stat: 'strength' | 'intellect' | 'spirit';
  base_hp: number;
  base_mana: number;
  hp_per_level: number;
  mana_per_level: number;
  icon_url?: string;
  created_at: string;
}

// Character types
export interface Character {
  id: string;
  user_id: string;
  name: string;
  class_id: string;
  level: number;
  xp: number;
  hp_current: number;
  hp_max: number;
  mana_current: number;
  mana_max: number;
  
  // Stats
  strength: number;
  intellect: number;
  spirit: number;
  stamina: number;
  
  // Combat stats
  attack_power: number;
  spell_power: number;
  armor: number;
  
  // Currency
  gold: number;
  
  // PvP
  honor_points: number;
  arena_rating: number;
  
  // Appearance
  avatar_color: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_login: string;
}

export interface CharacterWithClass extends Character {
  class: Class;
}

// Ability types
export interface Ability {
  id: string;
  class_id: string;
  name: string;
  description: string;
  type: 'damage' | 'heal' | 'buff' | 'debuff';
  damage_type?: 'physical' | 'magic' | 'holy';
  base_value: number;
  mana_cost: number;
  cooldown: number;
  level_required: number;
  icon_url?: string;
  created_at: string;
}

// Item types
export interface Item {
  id: string;
  name: string;
  description?: string;
  type: 'weapon' | 'armor' | 'consumable' | 'quest';
  slot?: 'head' | 'chest' | 'legs' | 'hands' | 'weapon' | 'trinket';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  level_required: number;
  
  // Stat bonuses
  strength_bonus: number;
  intellect_bonus: number;
  spirit_bonus: number;
  stamina_bonus: number;
  attack_power_bonus: number;
  spell_power_bonus: number;
  armor_bonus: number;
  
  // Item properties
  stackable: boolean;
  max_stack: number;
  vendor_price: number;
  
  icon_url?: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  character_id: string;
  item_id: string;
  quantity: number;
  slot_position?: number;
  is_equipped: boolean;
  created_at: string;
  item?: Item; // Populated via join
}

// Quest types
export interface QuestObjective {
  type: 'kill' | 'collect' | 'interact';
  target: string;
  count: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'story' | 'repeatable';
  level_required: number;
  objectives: QuestObjective[];
  xp_reward: number;
  gold_reward: number;
  item_rewards?: { item_id: string; quantity: number }[];
  auto_battle_enabled: boolean;
  estimated_duration?: number;
  created_at: string;
}

export interface CharacterQuest {
  id: string;
  character_id: string;
  quest_id: string;
  status: 'active' | 'completed' | 'abandoned';
  progress: { objective_id: number; current: number; required: number }[];
  started_at: string;
  completed_at?: string;
  quest?: Quest; // Populated via join
}

// Slokjes types
export interface Slokje {
  id: string;
  giver_id: string;
  receiver_id: string;
  reason?: string;
  created_at: string;
}

// Combat types
export interface CombatLog {
  id: string;
  combat_type: 'duel' | 'arena' | 'dungeon';
  participants: { character_id: string; team: number }[];
  winner_team?: number;
  duration: number;
  log_data?: any;
  created_at: string;
}

// Leaderboard types
export interface LeaderboardXPEntry {
  id: string;
  name: string;
  level: number;
  xp: number;
  class_id: string;
  class_name: string;
  telegram_username?: string;
  rank: number;
}

export interface LeaderboardSlokjesEntry {
  id: string;
  telegram_username: string;
  slokjes_received: number;
  slokjes_given: number;
  slokjes_balance: number;
  rank: number;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  telegram_username?: string;
}

export interface CreateCharacterRequest {
  name: string;
  class_id: string;
  avatar_color?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  character?: CharacterWithClass;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
