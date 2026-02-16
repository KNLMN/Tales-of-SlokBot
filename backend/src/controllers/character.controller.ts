import { Response } from 'express';
import { supabaseAdmin } from '../utils/supabase';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { CreateCharacterRequest } from '../types';

export const createCharacter = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, class_id, avatar_color }: CreateCharacterRequest = req.body;
  const userId = req.user!.id;

  // Validate input
  if (!name || !class_id) {
    throw new AppError('Name and class are required', 400);
  }

  // Check if name is taken
  const { data: existingCharacter } = await supabaseAdmin
    .from('characters')
    .select('id')
    .eq('name', name)
    .single();

  if (existingCharacter) {
    throw new AppError('Character name already taken', 400);
  }

  // Check if user already has a character
  const { data: userCharacter } = await supabaseAdmin
    .from('characters')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (userCharacter) {
    throw new AppError('You already have a character', 400);
  }

  // Fetch class data
  const { data: classData, error: classError } = await supabaseAdmin
    .from('classes')
    .select('*')
    .eq('id', class_id)
    .single();

  if (classError || !classData) {
    throw new AppError('Invalid class', 400);
  }

  // Calculate starting stats based on class
  const hp_max = classData.base_hp;
  const mana_max = classData.base_mana;

  // Create character
  const { data: character, error } = await supabaseAdmin
    .from('characters')
    .insert({
      user_id: userId,
      name,
      class_id,
      level: 1,
      xp: 0,
      hp_current: hp_max,
      hp_max,
      mana_current: mana_max,
      mana_max,
      strength: classData.primary_stat === 'strength' ? 15 : 10,
      intellect: classData.primary_stat === 'intellect' ? 15 : 10,
      spirit: classData.primary_stat === 'spirit' ? 15 : 10,
      stamina: 10,
      attack_power: classData.primary_stat === 'strength' ? 20 : 0,
      spell_power: classData.primary_stat === 'intellect' ? 20 : 0,
      armor: 0,
      gold: 0,
      honor_points: 0,
      arena_rating: 1500,
      avatar_color: avatar_color || '#FF6B6B'
    })
    .select(`
      *,
      class:classes(*)
    `)
    .single();

  if (error) {
    throw new AppError('Failed to create character', 500);
  }

  // Grant starting abilities (level 1 abilities)
  const { data: startingAbilities } = await supabaseAdmin
    .from('abilities')
    .select('id')
    .eq('class_id', class_id)
    .eq('level_required', 1);

  if (startingAbilities && startingAbilities.length > 0) {
    const abilityInserts = startingAbilities.map(ability => ({
      character_id: character.id,
      ability_id: ability.id
    }));

    await supabaseAdmin
      .from('character_abilities')
      .insert(abilityInserts);
  }

  res.status(201).json({
    success: true,
    data: character,
    message: 'Character created successfully'
  });
};

export const getMyCharacter = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const { data: character, error } = await supabaseAdmin
    .from('characters')
    .select(`
      *,
      class:classes(*)
    `)
    .eq('user_id', userId)
    .single();

  if (error || !character) {
    throw new AppError('Character not found', 404);
  }

  res.json({
    success: true,
    data: character
  });
};

export const getCharacter = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const { data: character, error } = await supabaseAdmin
    .from('characters')
    .select(`
      *,
      class:classes(*)
    `)
    .eq('id', id)
    .single();

  if (error || !character) {
    throw new AppError('Character not found', 404);
  }

  res.json({
    success: true,
    data: character
  });
};

export const deleteCharacter = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const { error } = await supabaseAdmin
    .from('characters')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw new AppError('Failed to delete character', 500);
  }

  res.json({
    success: true,
    message: 'Character deleted successfully'
  });
};

export const getCharacterAbilities = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  // Get character
  const { data: character } = await supabaseAdmin
    .from('characters')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!character) {
    throw new AppError('Character not found', 404);
  }

  // Get unlocked abilities
  const { data: abilities, error } = await supabaseAdmin
    .from('character_abilities')
    .select(`
      *,
      ability:abilities(*)
    `)
    .eq('character_id', character.id);

  if (error) {
    throw new AppError('Failed to fetch abilities', 500);
  }

  res.json({
    success: true,
    data: abilities
  });
};
