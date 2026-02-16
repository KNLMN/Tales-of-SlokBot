import { supabase } from '../utils/supabase';

export interface CombatParticipant {
  characterId: string;
  name: string;
  classId: string;
  level: number;
  currentHp: number;
  maxHp: number;
  currentMana: number;
  maxMana: number;
  attackPower: number;
  spellPower: number;
  armor: number;
  strength: number;
  intellect: number;
  spirit: number;
  stamina: number;
}

export interface CombatAction {
  round: number;
  actorId: string;
  actorName: string;
  actionType: 'attack' | 'ability' | 'heal';
  abilityId?: string;
  abilityName?: string;
  targetId: string;
  targetName: string;
  damage?: number;
  healing?: number;
  manaCost?: number;
  isCritical?: boolean;
  message: string;
}

export interface CombatResult {
  winnerId: string;
  winnerName: string;
  loserId: string;
  loserName: string;
  rounds: number;
  actions: CombatAction[];
  xpGained: number;
  goldGained: number;
}

class CombatService {
  // Calculate damage based on attack type
  private calculateDamage(
    attacker: CombatParticipant,
    defender: CombatParticipant,
    ability?: any
  ): { damage: number; isCritical: boolean } {
    let baseDamage = 0;
    let isCritical = false;

    if (ability) {
      // Ability damage
      if (ability.damage_type === 'physical') {
        baseDamage = ability.base_value + attacker.attackPower * 0.5;
      } else if (ability.damage_type === 'magic' || ability.damage_type === 'holy') {
        baseDamage = ability.base_value + attacker.spellPower * 0.5;
      }
    } else {
      // Auto-attack (physical)
      baseDamage = attacker.attackPower * 0.8;
    }

    // Critical hit (15% chance)
    if (Math.random() < 0.15) {
      baseDamage *= 2;
      isCritical = true;
    }

    // Apply armor reduction (diminishing returns)
    const damageReduction = defender.armor / (defender.armor + 100);
    const finalDamage = Math.floor(baseDamage * (1 - damageReduction));

    return {
      damage: Math.max(1, finalDamage), // Minimum 1 damage
      isCritical,
    };
  }

  // Calculate healing
  private calculateHealing(healer: CombatParticipant, ability: any): number {
    const baseHealing = ability.base_value + healer.spellPower * 0.7;
    return Math.floor(baseHealing);
  }

  // Simple AI for PvE enemies
  private chooseAIAction(enemy: CombatParticipant, abilities: any[]): any | null {
    // Filter available abilities (enough mana, no cooldown for now)
    const availableAbilities = abilities.filter((a) => a.mana_cost <= enemy.currentMana);

    // 70% chance to use ability if available, otherwise auto-attack
    if (availableAbilities.length > 0 && Math.random() < 0.7) {
      return availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
    }

    return null; // Auto-attack
  }

  // Execute a single combat round
  private async executeRound(
    round: number,
    attacker: CombatParticipant,
    defender: CombatParticipant,
    ability: any | null
  ): Promise<CombatAction> {
    const action: CombatAction = {
      round,
      actorId: attacker.characterId,
      actorName: attacker.name,
      actionType: 'attack',
      targetId: defender.characterId,
      targetName: defender.name,
      message: '',
    };

    if (ability) {
      action.abilityId = ability.id;
      action.abilityName = ability.name;
      action.manaCost = ability.mana_cost;
      attacker.currentMana -= ability.mana_cost;

      if (ability.type === 'damage') {
        action.actionType = 'attack';
        const { damage, isCritical } = this.calculateDamage(attacker, defender, ability);
        action.damage = damage;
        action.isCritical = isCritical;
        defender.currentHp -= damage;

        const critText = isCritical ? ' **CRITICAL HIT!**' : '';
        action.message = `${attacker.name} uses ${ability.name} on ${defender.name} for ${damage} damage!${critText}`;
      } else if (ability.type === 'heal') {
        action.actionType = 'heal';
        const healing = this.calculateHealing(attacker, ability);
        action.healing = healing;
        attacker.currentHp = Math.min(attacker.currentHp + healing, attacker.maxHp);

        action.message = `${attacker.name} uses ${ability.name} and heals for ${healing} HP!`;
      }
    } else {
      // Auto-attack
      const { damage, isCritical } = this.calculateDamage(attacker, defender);
      action.damage = damage;
      action.isCritical = isCritical;
      defender.currentHp -= damage;

      const critText = isCritical ? ' **CRITICAL HIT!**' : '';
      action.message = `${attacker.name} attacks ${defender.name} for ${damage} damage!${critText}`;
    }

    return action;
  }

  // Main combat simulation (turn-based PvE)
  async simulatePvECombat(
    playerCharacterId: string,
    enemyData: {
      name: string;
      level: number;
      classId: string;
      hp: number;
      mana: number;
      attackPower: number;
      spellPower: number;
      armor: number;
    }
  ): Promise<CombatResult> {
    // Fetch player character
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('*, classes(*)')
      .eq('id', playerCharacterId)
      .single();

    if (charError || !character) {
      throw new Error('Character not found');
    }

    // Fetch player abilities
    const { data: playerAbilities } = await supabase
      .from('character_abilities')
      .select('*, abilities(*)')
      .eq('character_id', playerCharacterId);

    const abilities = playerAbilities?.map((ca) => ca.abilities) || [];

    // Initialize combatants
    const player: CombatParticipant = {
      characterId: character.id,
      name: character.name,
      classId: character.class_id,
      level: character.level,
      currentHp: character.hp_current,
      maxHp: character.hp_max,
      currentMana: character.mana_current,
      maxMana: character.mana_max,
      attackPower: character.attack_power,
      spellPower: character.spell_power,
      armor: character.armor,
      strength: character.strength,
      intellect: character.intellect,
      spirit: character.spirit,
      stamina: character.stamina,
    };

    const enemy: CombatParticipant = {
      characterId: 'enemy_' + Date.now(),
      name: enemyData.name,
      classId: enemyData.classId,
      level: enemyData.level,
      currentHp: enemyData.hp,
      maxHp: enemyData.hp,
      currentMana: enemyData.mana,
      maxMana: enemyData.mana,
      attackPower: enemyData.attackPower,
      spellPower: enemyData.spellPower,
      armor: enemyData.armor,
      strength: 0,
      intellect: 0,
      spirit: 0,
      stamina: 0,
    };

    // Fetch enemy abilities (based on class)
    const { data: enemyAbilities } = await supabase
      .from('abilities')
      .select('*')
      .eq('class_id', enemyData.classId)
      .lte('level_required', enemyData.level);

    const actions: CombatAction[] = [];
    let round = 0;
    const maxRounds = 50; // Prevent infinite loops

    // Combat loop
    while (player.currentHp > 0 && enemy.currentHp > 0 && round < maxRounds) {
      round++;

      // Player turn
      const playerAbility = this.chooseAIAction(player, abilities); // For now, AI for player too
      const playerAction = await this.executeRound(round, player, enemy, playerAbility);
      actions.push(playerAction);

      if (enemy.currentHp <= 0) break;

      // Enemy turn
      const enemyAbility = this.chooseAIAction(enemy, enemyAbilities || []);
      const enemyAction = await this.executeRound(round, enemy, player, enemyAbility);
      actions.push(enemyAction);

      if (player.currentHp <= 0) break;
    }

    // Determine winner
    const playerWon = player.currentHp > 0;
    const xpGained = playerWon ? Math.floor(50 * enemyData.level * 1.2) : 0;
    const goldGained = playerWon ? Math.floor(10 * enemyData.level) : 0;

    // Update character HP/Mana
    const newHp = playerWon ? Math.max(1, player.currentHp) : character.hp_max; // Full heal if lost
    const newMana = playerWon ? player.currentMana : character.mana_max;

    await supabase
      .from('characters')
      .update({
        hp_current: newHp,
        mana_current: newMana,
      })
      .eq('id', playerCharacterId);

    // If won, grant XP and gold
    if (playerWon) {
      const newXp = character.xp + xpGained;
      const newGold = character.gold + goldGained;

      // Check for level up
      const xpForNextLevel = 100 * character.level;
      let newLevel = character.level;
      let remainingXp = newXp;

      if (newXp >= xpForNextLevel) {
        newLevel++;
        remainingXp = newXp - xpForNextLevel;
      }

      await supabase
        .from('characters')
        .update({
          xp: remainingXp,
          level: newLevel,
          gold: newGold,
        })
        .eq('id', playerCharacterId);
    }

    const result: CombatResult = {
      winnerId: playerWon ? player.characterId : enemy.characterId,
      winnerName: playerWon ? player.name : enemy.name,
      loserId: playerWon ? enemy.characterId : player.characterId,
      loserName: playerWon ? enemy.name : player.name,
      rounds: round,
      actions,
      xpGained,
      goldGained,
    };

    // Log combat
    await supabase.from('combat_logs').insert({
      combat_type: 'pve',
      participants: [
        { character_id: player.characterId, name: player.name, team: 1 },
        { character_id: enemy.characterId, name: enemy.name, team: 2 },
      ],
      winner_team: playerWon ? 1 : 2,
      duration: round * 2, // Approximate seconds
      log_data: { actions },
    });

    return result;
  }
}

export default new CombatService();
