import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Character } from '../types';

export default function Game() {
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacter();
  }, []);

  const fetchCharacter = async () => {
    try {
      const data = await api.getMyCharacter();
      setCharacter(data);
    } catch (err) {
      console.error('Failed to fetch character:', err);
      navigate('/create-character');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slokbot-darker flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slokbot-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!character) return null;

  const hpPercentage = (character.hp_current / character.hp_max) * 100;
  const manaPercentage = (character.mana_current / character.mana_max) * 100;
  const xpForNextLevel = 100 * Math.pow(1.5, character.level - 1);
  const xpPercentage = (character.xp / xpForNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slokbot-darker via-slokbot-dark to-slokbot-darker">
      {/* Header */}
      <header className="bg-slokbot-dark border-b-2 border-slokbot-primary py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-game text-2xl text-slokbot-primary">Tales of SlokBot</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Character Info Panel */}
        <div className="bg-slokbot-dark border-2 border-slokbot-primary rounded-lg p-6 mb-8 fade-in">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-6xl border-2 border-white flex-shrink-0"
              style={{ backgroundColor: character.avatar_color }}
            >
              {character.class?.role === 'tank' && '🛡️'}
              {character.class?.role === 'dps' && '⚔️'}
              {character.class?.role === 'healer' && '✨'}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{character.name}</h2>
                  <p className="text-slokbot-secondary text-lg">
                    Level {character.level} {character.class?.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-slokbot-gold text-xl font-bold">{character.gold}g</div>
                  <div className="text-sm text-gray-400">Arena: {character.arena_rating}</div>
                </div>
              </div>

              {/* Resource Bars */}
              <div className="space-y-3">
                {/* HP Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400">Health</span>
                    <span className="text-white font-semibold">
                      {character.hp_current} / {character.hp_max}
                    </span>
                  </div>
                  <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="health-bar h-full transition-all duration-300"
                      style={{ width: `${hpPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Mana Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-400">Mana</span>
                    <span className="text-white font-semibold">
                      {character.mana_current} / {character.mana_max}
                    </span>
                  </div>
                  <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="mana-bar h-full transition-all duration-300"
                      style={{ width: `${manaPercentage}%` }}
                    />
                  </div>
                </div>

                {/* XP Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-yellow-400">Experience</span>
                    <span className="text-white font-semibold">
                      {character.xp} / {Math.floor(xpForNextLevel)}
                    </span>
                  </div>
                  <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full transition-all duration-300"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{character.strength}</div>
              <div className="text-sm text-gray-400">💪 Strength</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{character.intellect}</div>
              <div className="text-sm text-gray-400">🧠 Intellect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{character.spirit}</div>
              <div className="text-sm text-gray-400">✨ Spirit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{character.stamina}</div>
              <div className="text-sm text-gray-400">❤️ Stamina</div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon="⚔️" 
            title="Duels" 
            description="Challenge other players to 1v1 combat"
            comingSoon 
          />
          <FeatureCard 
            icon="🏟️" 
            title="Arena" 
            description="Compete in ranked battles"
            comingSoon 
          />
          <FeatureCard 
            icon="🗺️" 
            title="Quests" 
            description="Complete missions and earn rewards"
            comingSoon 
          />
          <FeatureCard 
            icon="🏰" 
            title="Dungeons" 
            description="Team up for challenging PvE content"
            comingSoon 
          />
          <FeatureCard 
            icon="🎒" 
            title="Inventory" 
            description="Manage your items and equipment"
            comingSoon 
          />
          <FeatureCard 
            icon="🏆" 
            title="Leaderboards" 
            description="See who's on top"
            comingSoon 
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  comingSoon 
}: { 
  icon: string; 
  title: string; 
  description: string; 
  comingSoon?: boolean;
}) {
  return (
    <div className="bg-slokbot-dark border-2 border-gray-600 rounded-lg p-6 relative overflow-hidden group hover:border-slokbot-secondary transition-colors">
      {comingSoon && (
        <div className="absolute top-2 right-2 bg-slokbot-primary px-3 py-1 rounded-full text-xs font-bold">
          SOON
        </div>
      )}
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
