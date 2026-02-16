import { Request, Response } from 'express';
import combatService from '../services/combat.service';

export const startPvECombat = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { enemyType } = req.body;

    // Get character
    const { supabase } = await import('../utils/supabase');
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (charError || !character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found',
      });
    }

    // Define enemy types based on character level
    const enemies: Record<string, any> = {
      goblin: {
        name: 'Goblin Scout',
        level: Math.max(1, character.level - 1),
        classId: 'warrior',
        hp: 60 + character.level * 10,
        mana: 30,
        attackPower: 10 + character.level * 2,
        spellPower: 5,
        armor: 5 + character.level,
      },
      bandit: {
        name: 'Drunken Bandit',
        level: character.level,
        classId: 'warrior',
        hp: 80 + character.level * 12,
        mana: 40,
        attackPower: 12 + character.level * 3,
        spellPower: 5,
        armor: 8 + character.level * 1.5,
      },
      wolf: {
        name: 'Dire Wolf',
        level: character.level,
        classId: 'warrior',
        hp: 70 + character.level * 10,
        mana: 20,
        attackPower: 15 + character.level * 2.5,
        spellPower: 0,
        armor: 4 + character.level,
      },
      mage: {
        name: 'Rogue Mage',
        level: character.level,
        classId: 'mage',
        hp: 50 + character.level * 8,
        mana: 150 + character.level * 10,
        attackPower: 5,
        spellPower: 20 + character.level * 4,
        armor: 3 + character.level * 0.5,
      },
      boss: {
        name: 'Tavern Boss',
        level: character.level + 2,
        classId: 'warrior',
        hp: 150 + character.level * 20,
        mana: 100,
        attackPower: 20 + character.level * 4,
        spellPower: 10 + character.level * 2,
        armor: 15 + character.level * 2,
      },
    };

    const enemyData = enemies[enemyType] || enemies.goblin;

    // Simulate combat
    const result = await combatService.simulatePvECombat(character.id, enemyData);

    res.json({
      success: true,
      data: result,
      message: result.winnerId === character.id ? 'Victory!' : 'Defeat!',
    });
  } catch (error: any) {
    console.error('Combat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Combat failed',
    });
  }
};

export const getCombatHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const { supabase } = await import('../utils/supabase');

    // Get character
    const { data: character } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found',
      });
    }

    // Get combat logs
    const { data: logs, error } = await supabase
      .from('combat_logs')
      .select('*')
      .contains('participants', [{ character_id: character.id }])
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    res.json({
      success: true,
      data: logs || [],
    });
  } catch (error: any) {
    console.error('Get combat history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get combat history',
    });
  }
};
