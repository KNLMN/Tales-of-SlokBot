import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Debug() {
  const [backendHealth, setBackendHealth] = useState<any>(null);
  const [classes, setClasses] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const API_URL = (import.meta as any).env.VITE_API_URL || 'NOT SET';
  const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || 'NOT SET';
  const SUPABASE_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY
    ? '✅ SET (hidden for security)'
    : '❌ NOT SET';

  useEffect(() => {
    testBackend();
  }, []);

  const testBackend = async () => {
    try {
      // Test health endpoint
      const healthResponse = await fetch(API_URL.replace('/api', '/health'));
      const healthData = await healthResponse.json();
      setBackendHealth(healthData);

      // Test classes endpoint
      const classesData = await api.getClasses();
      setClasses(classesData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🔧 Debug Info</h1>

        {/* Environment Variables */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-purple-500">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">VITE_API_URL:</span>
              <span className="text-white">{API_URL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">VITE_SUPABASE_URL:</span>
              <span className="text-white">{SUPABASE_URL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">VITE_SUPABASE_ANON_KEY:</span>
              <span className="text-white">{SUPABASE_KEY}</span>
            </div>
          </div>
        </div>

        {/* Backend Health */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-purple-500">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Backend Health</h2>
          {backendHealth ? (
            <pre className="bg-slate-900 p-4 rounded text-green-400 overflow-x-auto">
              {JSON.stringify(backendHealth, null, 2)}
            </pre>
          ) : (
            <p className="text-yellow-400">Testing backend...</p>
          )}
        </div>

        {/* Classes Test */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-purple-500">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Classes API Test</h2>
          {classes ? (
            <div>
              <p className="text-green-400 mb-2">✅ Successfully fetched {classes.length} classes:</p>
              <pre className="bg-slate-900 p-4 rounded text-white overflow-x-auto text-sm">
                {JSON.stringify(classes, null, 2)}
              </pre>
            </div>
          ) : error ? (
            <p className="text-red-400">❌ Error: {error}</p>
          ) : (
            <p className="text-yellow-400">Testing API...</p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-slate-800 rounded-lg p-6 border border-purple-500">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Troubleshooting</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong className="text-white">If VITE_API_URL shows "NOT SET":</strong>
              <br />
              Add environment variable in Vercel: Settings → Environment Variables
            </p>
            <p>
              <strong className="text-white">If Backend Health fails:</strong>
              <br />
              Check Railway logs and verify the backend is running
            </p>
            <p>
              <strong className="text-white">If Classes API fails with CORS error:</strong>
              <br />
              Add CORS_ORIGIN to Railway environment variables
            </p>
            <p className="mt-4">
              <a
                href="/login"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                ← Back to Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
