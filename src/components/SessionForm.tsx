'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SessionFormProps {
  clientId: string;
  coachId: string;
}

export function SessionForm({ clientId, coachId }: SessionFormProps) {
  const router = useRouter();
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('completed');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!exerciseName.trim()) {
      setError('Exercise name is required');
      return;
    }

    if (!sessionDate) {
      setError('Session date is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          coachId,
          sessionDate,
          exerciseName: exerciseName.trim(),
          sets: sets ? parseInt(sets) : undefined,
          reps: reps ? parseInt(reps) : undefined,
          weight: weight.trim() || undefined,
          notes: notes.trim() || undefined,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to log session');
        return;
      }

      router.push(`/dashboard/clients/${clientId}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sessionDate" className="block text-sm font-medium text-gray-700 mb-1">
            Session Date *
          </label>
          <input
            id="sessionDate"
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-700 mb-1">
          Exercise Name *
        </label>
        <input
          id="exerciseName"
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., Bench Press, Squats, Running"
          disabled={loading}
          required
          autoFocus
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="sets" className="block text-sm font-medium text-gray-700 mb-1">
            Sets
          </label>
          <input
            id="sets"
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="3"
            min="0"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="reps" className="block text-sm font-medium text-gray-700 mb-1">
            Reps
          </label>
          <input
            id="reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="10"
            min="0"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Weight
          </label>
          <input
            id="weight"
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="185 lbs"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., Form was good, client felt strong"
          disabled={loading}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging...' : 'Log Session'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
