import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Class } from '../types';

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DFE6E9', '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7'
];

export default function CreateCharacter() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await api.getClasses();
      setClasses(data);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClass) {
      setError('Please select a class');
      return;
    }

    if (!characterName.trim()) {
      setError('Please enter a character name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createCharacter(characterName, selectedClass.id, avatarColor);
      navigate('/game');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create character');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'tank': return '🛡️';
      case 'dps': return '⚔️';
      case 'healer': return '✨';
      default: return '🎮';
    }
  };

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'strength': return '💪';
      case 'intellect': return '🧠';
      case 'spirit': return '✨';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slokbot-darker via-slokbot-dark to-slokbot-darker py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="font-game text-4xl text-slokbot-primary mb-2">
            Create Your Hero
          </h1>
          <p className="text-gray-400">Choose wisely, adventurer...</p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Class Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Select Your Class
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classes.map((classData) => (
                <div
                  key={classData.id}
                  onClick={() => setSelectedClass(classData)}
                  className={`
                    bg-slokbot-dark border-2 rounded-lg p-6 cursor-pointer transition-all duration-300
                    hover:scale-105 hover:shadow-2xl
                    ${selectedClass?.id === classData.id 
                      ? 'border-slokbot-primary shadow-lg shadow-slokbot-primary/50' 
                      : 'border-gray-600 hover:border-slokbot-secondary'}
                  `}
                >
                  {/* Class Icon/Role */}
                  <div className="text-6xl text-center mb-4">
                    {getRoleIcon(classData.role)}
                  </div>

                  {/* Class Name */}
                  <h3 className="text-xl font-bold text-white text-center mb-2">
                    {classData.name}
                  </h3>

                  {/* Role Badge */}
                  <div className="text-center mb-4">
                    <span className={`
                      inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${classData.role === 'tank' && 'bg-blue-500/20 text-blue-300'}
                      ${classData.role === 'dps' && 'bg-red-500/20 text-red-300'}
                      ${classData.role === 'healer' && 'bg-green-500/20 text-green-300'}
                    `}>
                      {classData.role.toUpperCase()}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm text-center mb-4 h-20">
                    {classData.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Primary Stat:</span>
                      <span className="text-white font-semibold">
                        {getStatIcon(classData.primary_stat)} {classData.primary_stat}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Base HP:</span>
                      <span className="text-red-400 font-semibold">{classData.base_hp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Base Mana:</span>
                      <span className="text-blue-400 font-semibold">{classData.base_mana}</span>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {selectedClass?.id === classData.id && (
                    <div className="mt-4 text-center">
                      <span className="text-slokbot-primary font-bold">✓ SELECTED</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Character Customization */}
          {selectedClass && (
            <div className="max-w-2xl mx-auto bg-slokbot-dark border-2 border-slokbot-primary rounded-lg p-8 fade-in">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Customize Your Hero
              </h2>

              {/* Character Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Character Name
                </label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  required
                  maxLength={20}
                  className="w-full px-4 py-3 bg-slokbot-darker border border-gray-600 rounded-lg text-white text-lg font-semibold focus:outline-none focus:border-slokbot-primary"
                  placeholder="Enter your hero's name..."
                />
              </div>

              {/* Avatar Color */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Avatar Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAvatarColor(color)}
                      className={`
                        w-12 h-12 rounded-full border-2 transition-all
                        ${avatarColor === color 
                          ? 'border-white scale-110' 
                          : 'border-gray-600 hover:scale-105'}
                      `}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mb-6 p-6 bg-slokbot-darker rounded-lg border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-4 text-center">
                  PREVIEW
                </h3>
                <div className="flex items-center justify-center gap-6">
                  {/* Avatar */}
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl border-2 border-white"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {getRoleIcon(selectedClass.role)}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-1">
                      {characterName || 'Hero Name'}
                    </h4>
                    <p className="text-slokbot-secondary">
                      Level 1 {selectedClass.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !characterName.trim()}
                className="w-full bg-slokbot-primary hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Hero...' : '⚔️ Enter the World ⚔️'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
