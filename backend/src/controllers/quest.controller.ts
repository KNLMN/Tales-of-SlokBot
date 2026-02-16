import { Response } from 'express';
import { supabaseAdmin } from '../utils/supabase';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAvailableQuests = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  // Get character
  const { data: character } = await supabaseAdmin
    .from('characters')
    .select('id, level')
    .eq('user_id', userId)
    .single();

  if (!character) {
    throw new AppError('Character not found', 404);
  }

  // Get quests available for this level
  const { data: quests, error } = await supabaseAdmin
    .from('quests')
    .select('*')
    .lte('level_required', character.level)
    .order('level_required', { ascending: true });

  if (error) {
    throw new AppError('Failed to fetch quests', 500);
  }

  res.json({
    success: true,
    data: quests
  });
};

export const getMyQuests = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const { data: character } = await supabaseAdmin
    .from('characters')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!character) {
    throw new AppError('Character not found', 404);
  }

  const { data: characterQuests, error } = await supabaseAdmin
    .from('character_quests')
    .select(`
      *,
      quest:quests(*)
    `)
    .eq('character_id', character.id)
    .in('status', ['active', 'completed'])
    .order('started_at', { ascending: false });

  if (error) {
    throw new AppError('Failed to fetch quests', 500);
  }

  res.json({
    success: true,
    data: characterQuests
  });
};

export const startQuest = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { id: questId } = req.params;

  // Get character
  const { data: character } = await supabaseAdmin
    .from('characters')
    .select('id, level')
    .eq('user_id', userId)
    .single();

  if (!character) {
    throw new AppError('Character not found', 404);
  }

  // Get quest
  const { data: quest } = await supabaseAdmin
    .from('quests')
    .select('*')
    .eq('id', questId)
    .single();

  if (!quest) {
    throw new AppError('Quest not found', 404);
  }

  // Check level requirement
  if (character.level < quest.level_required) {
    throw new AppError(`Level ${quest.level_required} required`, 400);
  }

  // Check if already active
  const { data: existing } = await supabaseAdmin
    .from('character_quests')
    .select('id')
    .eq('character_id', character.id)
    .eq('quest_id', questId)
    .eq('status', 'active')
    .single();

  if (existing) {
    throw new AppError('Quest already active', 400);
  }

  // Initialize progress based on objectives
  const progress = quest.objectives.map((obj: any, index: number) => ({
    objective_id: index,
    current: 0,
    required: obj.count
  }));

  // Start quest
  const { data: characterQuest, error } = await supabaseAdmin
    .from('character_quests')
    .insert({
      character_id: character.id,
      quest_id: questId,
      status: 'active',
      progress
    })
    .select(`
      *,
      quest:quests(*)
    `)
    .single();

  if (error) {
    throw new AppError('Failed to start quest', 500);
  }

  res.json({
    success: true,
    data: characterQuest,
    message: 'Quest started!'
  });
};

export const completeQuest = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { id: questId } = req.params;

  // Get character
  const { data: character } = await supabaseAdmin
    .from('characters')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!character) {
    throw new AppError('Character not found', 404);
  }

  // Get character quest
  const { data: characterQuest } = await supabaseAdmin
    .from('character_quests')
    .select(`
      *,
      quest:quests(*)
    `)
    .eq('character_id', character.id)
    .eq('quest_id', questId)
    .eq('status', 'active')
    .single();

  if (!characterQuest) {
    throw new AppError('Active quest not found', 404);
  }

  const quest = characterQuest.quest;

  // Auto-complete: Set all objectives to required amount
  const completedProgress = quest.objectives.map((obj: any, index: number) => ({
    objective_id: index,
    current: obj.count,
    required: obj.count
  }));

  // Mark quest as completed
  await supabaseAdmin
    .from('character_quests')
    .update({
      status: 'completed',
      progress: completedProgress,
      completed_at: new Date().toISOString()
    })
    .eq('id', characterQuest.id);

  // Calculate rewards
  const newXp = character.xp + quest.xp_reward;
  const newGold = character.gold + quest.gold_reward;
  const xpForNextLevel = 100 * Math.pow(1.5, character.level - 1);
  
  let newLevel = character.level;
  let remainingXp = newXp;
  let leveledUp = false;

  // Check for level up
  if (newXp >= xpForNextLevel) {
    newLevel = character.level + 1;
    remainingXp = newXp - xpForNextLevel;
    leveledUp = true;

    // Increase stats on level up
    const statIncrease = 2;
    const hpIncrease = character.class?.hp_per_level || 10;
    const manaIncrease = character.class?.mana_per_level || 10;

    await supabaseAdmin
      .from('characters')
      .update({
        level: newLevel,
        xp: remainingXp,
        gold: newGold,
        hp_max: character.hp_max + hpIncrease,
        hp_current: character.hp_max + hpIncrease, // Full heal on level up
        mana_max: character.mana_max + manaIncrease,
        mana_current: character.mana_max + manaIncrease,
        strength: character.strength + statIncrease,
        intellect: character.intellect + statIncrease,
        spirit: character.spirit + statIncrease,
        stamina: character.stamina + statIncrease
      })
      .eq('id', character.id);
  } else {
    // No level up, just add rewards
    await supabaseAdmin
      .from('characters')
      .update({
        xp: newXp,
        gold: newGold
      })
      .eq('id', character.id);
  }

  res.json({
    success: true,
    data: {
      quest: characterQuest,
      rewards: {
        xp: quest.xp_reward,
        gold: quest.gold_reward,
        leveledUp,
        newLevel: leveledUp ? newLevel : character.level
      }
    },
    message: leveledUp 
      ? `Quest complete! Level up! You are now level ${newLevel}!` 
      : 'Quest complete!'
  });
};