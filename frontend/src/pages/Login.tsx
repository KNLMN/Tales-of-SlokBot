import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(email, password);
      
      // Redirect based on whether user has a character
      if (response.character) {
        navigate('/game');
      } else {
        navigate('/create-character');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slokbot-darker via-slokbot-dark to-slokbot-darker">
      <div className="max-w-md w-full mx-4">
        {/* Logo/Title */}
        <div className="text-center mb-8 fade-in">
          <h1 className="font-game text-3xl text-slokbot-primary mb-2">
            Tales of SlokBot
          </h1>
          <p className="text-gray-400 text-sm">
            🍺 Enter the Tavern ⚔️
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slokbot-dark border-2 border-slokbot-primary rounded-lg p-8 shadow-2xl fade-in">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Login
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slokbot-darker border border-gray-600 rounded-lg text-white focus:outline-none focus:border-slokbot-primary transition-colors"
                placeholder="adventurer@slokbot.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slokbot-darker border border-gray-600 rounded-lg text-white focus:outline-none focus:border-slokbot-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slokbot-primary hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Enter the Tavern'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-slokbot-secondary hover:text-slokbot-primary transition-colors font-semibold"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>Built with ❤️ and 🍺 by the SlokBot crew</p>
        </div>
      </div>
    </div>
  );
}
