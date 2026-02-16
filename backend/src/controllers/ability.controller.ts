import { Request, Response } from 'express';
import { supabaseAdmin } from '../utils/supabase';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAbilitiesByClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { classId } = req.params;

  const { data: abilities, error } = await supabaseAdmin
    .from('abilities')
    .select('*')
    .eq('class_id', classId)
    .order('level_required');

  if (error) {
    throw new AppError('Failed to fetch abilities', 500);
  }

  res.json({
    success: true,
    data: abilities
  });
};

// Force grant abilities to current user's character
export const grantMyAbilities = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  // Get character
  const { data: character, error: charError } = await supabaseAdmin
    .from('characters')
    .select('id, class_id, name')
    .eq('user_id', userId)
    .single();

  if (charError || !character) {
    throw new AppError('Character not found', 404);
  }

  // Get all level 1 abilities for this class
  const { data: abilities, error: abError } = await supabaseAdmin
    .from('abilities')
    .select('id, name')
    .eq('class_id', character.class_id)
    .eq('level_required', 1);

  if (abError || !abilities) {
    throw new AppError('Failed to fetch abilities', 500);
  }

  console.log(`🎯 Granting ${abilities.length} abilities to ${character.name} (${character.class_id})`);

  // Delete existing abilities first to avoid duplicates
  await supabaseAdmin
    .from('character_abilities')
    .delete()
    .eq('character_id', character.id);

  // Grant abilities
  const abilityInserts = abilities.map(ability => ({
    character_id: character.id,
    ability_id: ability.id
  }));

  const { error: insertError } = await supabaseAdmin
    .from('character_abilities')
    .insert(abilityInserts);

  if (insertError) {
    console.error('❌ Error inserting abilities:', insertError);
    throw new AppError('Failed to grant abilities', 500);
  }

  console.log(`✅ Granted abilities:`, abilities.map(a => a.name));

  res.json({
    success: true,
    data: {
      granted: abilities.length,
      abilities: abilities.map(a => a.name)
    },
    message: `Granted ${abilities.length} abilities to ${character.name}`
  });
};
