import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await api.register(email, password, telegramUsername || undefined);
      navigate('/create-character');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slokbot-darker via-slokbot-dark to-slokbot-darker">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8 fade-in">
          <h1 className="font-game text-3xl text-slokbot-primary mb-2">
            Tales of SlokBot
          </h1>
          <p className="text-gray-400 text-sm">Begin Your Adventure</p>
        </div>

        <div className="bg-slokbot-dark border-2 border-slokbot-primary rounded-lg p-8 shadow-2xl fade-in">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Create Account
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
                className="w-full px-4 py-2 bg-slokbot-darker border border-gray-600 rounded-lg text-white focus:outline-none focus:border-slokbot-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Telegram Username <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="text"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                className="w-full px-4 py-2 bg-slokbot-darker border border-gray-600 rounded-lg text-white focus:outline-none focus:border-slokbot-primary"
                placeholder="@username"
              />
              <p className="text-xs text-gray-500 mt-1">For slokjes integration</p>
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
                className="w-full px-4 py-2 bg-slokbot-darker border border-gray-600 rounded-lg text-white focus:outline-none focus:border-slokbot-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slokbot-darker border border-gray-600 rounded-lg text-white focus:outline-none focus:border-slokbot-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slokbot-primary hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg glow-primary disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-slokbot-secondary hover:text-slokbot-primary font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
