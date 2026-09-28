'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function StudioForm() {
  const router = useRouter();
  const [studioName, setStudioName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getEmailFromStorage = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('signup-email') || '';
    }
    return '';
  };

  const handleCreateStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!studioName.trim()) {
      setError('Please enter a studio name');
      return;
    }

    if (studioName.trim().length < 2) {
      setError('Studio name must be at least 2 characters');
      return;
    }

    setLoading(true);
    try {
      const email = getEmailFromStorage();
      const response = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studioName: studioName.trim(),
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create studio');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreateStudio} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="studioName" className="block text-sm font-medium text-gray-700 mb-1">
            Studio Name
          </label>
          <input
            id="studioName"
            type="text"
            value={studioName}
            onChange={(e) => setStudioName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Elite Fitness Studio"
            disabled={loading}
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Studio'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <button
        onClick={handleSkip}
        disabled={loading}
        className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue as Solo Coach
      </button>
    </div>
  );
}
