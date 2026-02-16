import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface CombatAction {
  round: number;
  actorName: string;
  actionType: string;
  abilityName?: string;
  targetName: string;
  damage?: number;
  healing?: number;
  isCritical?: boolean;
  message: string;
}

interface CombatResult {
  winnerId: string;
  winnerName: string;
  loserName: string;
  rounds: number;
  actions: CombatAction[];
  xpGained: number;
  goldGained: number;
}

export default function Combat() {
  const navigate = useNavigate();
  const [selectedEnemy, setSelectedEnemy] = useState<string>('');
  const [combatInProgress, setCombatInProgress] = useState(false);
  const [combatResult, setCombatResult] = useState<CombatResult | null>(null);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [error, setError] = useState('');

  const enemies = [
    {
      id: 'goblin',
      name: 'Goblin Scout',
      description: 'A weak goblin, perfect for practice',
      difficulty: 'Easy',
      color: 'text-green-400',
      icon: '👺',
      stats: 'Low HP • Low Damage • Weak Armor',
    },
    {
      id: 'bandit',
      name: 'Drunken Bandit',
      description: 'A rowdy bandit who had too many slokjes',
      difficulty: 'Medium',
      color: 'text-yellow-400',
      icon: '🍺',
      stats: 'Medium HP • Medium Damage • Medium Armor',
    },
    {
      id: 'wolf',
      name: 'Dire Wolf',
      description: 'A fierce predator with sharp fangs',
      difficulty: 'Medium',
      color: 'text-yellow-400',
      icon: '🐺',
      stats: 'Medium HP • High Damage • Low Armor',
    },
    {
      id: 'mage',
      name: 'Rogue Mage',
      description: 'A dangerous spellcaster',
      difficulty: 'Hard',
      color: 'text-orange-400',
      icon: '🧙',
      stats: 'Low HP • Very High Spell Damage • Very Low Armor',
    },
    {
      id: 'boss',
      name: 'Tavern Boss',
      description: 'The toughest challenge!',
      difficulty: 'Boss',
      color: 'text-red-400',
      icon: '👑',
      stats: 'Very High HP • Very High Damage • High Armor',
    },
  ];

  const startCombat = async (enemyType: string) => {
    try {
      setError('');
      setCombatInProgress(true);
      setCombatResult(null);
      setCurrentActionIndex(0);

      const result = await api.startPvECombat(enemyType);
      setCombatResult(result);

      // Animate combat actions
      animateCombat(result.actions);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Combat failed');
      setCombatInProgress(false);
    }
  };

  const animateCombat = (actions: CombatAction[]) => {
    let index = 0;
    const interval = setInterval(() => {
      setCurrentActionIndex(index);
      index++;

      if (index >= actions.length) {
        clearInterval(interval);
        setCombatInProgress(false);
      }
    }, 1000); // 1 second per action
  };

  const returnToGame = () => {
    navigate('/game');
  };

  if (combatResult) {
    const visibleActions = combatResult.actions.slice(0, currentActionIndex + 1);
    const playerWon = combatResult.xpGained > 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Combat Header */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border-2 border-purple-500">
            <h1 className="text-3xl font-bold text-center mb-4">
              ⚔️ Combat: Round {Math.ceil(currentActionIndex / 2)} / {combatResult.rounds}
            </h1>
          </div>

          {/* Combat Log */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-purple-500 h-96 overflow-y-auto">
            <div className="space-y-2 font-mono text-sm">
              {visibleActions.map((action, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded ${
                    action.isCritical
                      ? 'bg-red-900 border border-red-500 text-red-200'
                      : action.actionType === 'heal'
                      ? 'bg-green-900 border border-green-500 text-green-200'
                      : 'bg-slate-700 text-gray-200'
                  } animate-fadeIn`}
                >
                  <div className="flex justify-between items-center">
                    <span>{action.message}</span>
                    {action.damage && (
                      <span className="text-red-400 font-bold">-{action.damage} HP</span>
                    )}
                    {action.healing && (
                      <span className="text-green-400 font-bold">+{action.healing} HP</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result Panel */}
          {!combatInProgress && (
            <div
              className={`bg-slate-800 rounded-lg p-8 border-2 ${
                playerWon ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <h2
                className={`text-4xl font-bold text-center mb-6 ${
                  playerWon ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {playerWon ? '🎉 VICTORY!' : '💀 DEFEAT'}
              </h2>

              {playerWon && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-900 p-4 rounded text-center">
                    <div className="text-blue-200 text-sm">XP Gained</div>
                    <div className="text-3xl font-bold text-blue-400">
                      +{combatResult.xpGained}
                    </div>
                  </div>
                  <div className="bg-yellow-900 p-4 rounded text-center">
                    <div className="text-yellow-200 text-sm">Gold Gained</div>
                    <div className="text-3xl font-bold text-yellow-400">
                      +{combatResult.goldGained}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center space-y-4">
                <button
                  onClick={returnToGame}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition transform hover:scale-105"
                >
                  Return to Game
                </button>
              </div>
            </div>
          )}

          {combatInProgress && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              <p className="text-purple-300 mt-4">Combat in progress...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-purple-500">
          <h1 className="text-4xl font-bold text-center mb-2">⚔️ Choose Your Enemy</h1>
          <p className="text-center text-gray-400">Select an enemy to battle!</p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-500 text-red-200 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enemies.map((enemy) => (
            <div
              key={enemy.id}
              className={`bg-slate-800 rounded-lg p-6 border-2 ${
                selectedEnemy === enemy.id
                  ? 'border-purple-500 shadow-lg shadow-purple-500/50'
                  : 'border-slate-700 hover:border-purple-400'
              } cursor-pointer transition transform hover:scale-105`}
              onClick={() => setSelectedEnemy(enemy.id)}
            >
              <div className="text-6xl text-center mb-4">{enemy.icon}</div>
              <h3 className="text-2xl font-bold text-center mb-2">{enemy.name}</h3>
              <p className="text-gray-400 text-center text-sm mb-3">{enemy.description}</p>
              <div className="bg-slate-900 rounded p-3 mb-3">
                <div className="text-xs text-gray-500 text-center mb-1">Battle Stats</div>
                <div className="text-xs text-gray-300 text-center">{enemy.stats}</div>
              </div>
              <div className="text-center">
                <span className={`${enemy.color} font-bold px-3 py-1 rounded-full text-sm`}>
                  {enemy.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/game')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition"
          >
            ← Back to Game
          </button>
          <button
            onClick={() => selectedEnemy && startCombat(selectedEnemy)}
            disabled={!selectedEnemy || combatInProgress}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-bold transition transform hover:scale-105"
          >
            {combatInProgress ? 'Fighting...' : 'Start Combat!'}
          </button>
        </div>
      </div>
    </div>
  );
}
