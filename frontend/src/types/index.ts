// Mirror backend types for frontend
export interface User {
  id: string;
  telegram_username?: string;
  slokjes_given: number;
  slokjes_received: number;
  created_at: string;
  updated_at: string;
}

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
}

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
  strength: number;
  intellect: number;
  spirit: number;
  stamina: number;
  attack_power: number;
  spell_power: number;
  armor: number;
  gold: number;
  honor_points: number;
  arena_rating: number;
  avatar_color: string;
  created_at: string;
  updated_at: string;
  last_login: string;
  class?: Class;
}

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
}

export interface AuthResponse {
  user: User;
  token: string;
  character?: Character;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
