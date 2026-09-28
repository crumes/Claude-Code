'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MetricsFormProps {
  clientId: string;
  coachId: string;
}

const METRIC_PRESETS = {
  weight: [
    { name: 'Weight', unit: 'lbs' },
    { name: 'Weight', unit: 'kg' },
  ],
  measurements: [
    { name: 'Chest', unit: 'cm' },
    { name: 'Waist', unit: 'cm' },
    { name: 'Hips', unit: 'cm' },
    { name: 'Biceps', unit: 'cm' },
    { name: 'Thighs', unit: 'cm' },
  ],
  benchmark: [
    { name: 'Bench Press Max', unit: 'lbs' },
    { name: 'Squat Max', unit: 'lbs' },
    { name: 'Deadlift Max', unit: 'lbs' },
    { name: 'Mile Time', unit: 'minutes' },
    { name: 'Push-ups', unit: 'reps' },
  ],
};

export function MetricsForm({ clientId, coachId }: MetricsFormProps) {
  const router = useRouter();
  const [metricDate, setMetricDate] = useState(new Date().toISOString().split('T')[0]);
  const [metricType, setMetricType] = useState('weight');
  const [metricName, setMetricName] = useState('Weight');
  const [unit, setUnit] = useState('lbs');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMetricTypeChange = (type: string) => {
    setMetricType(type);
    const presets = METRIC_PRESETS[type as keyof typeof METRIC_PRESETS];
    if (presets && presets.length > 0) {
      setMetricName(presets[0].name);
      setUnit(presets[0].unit);
    }
  };

  const handleMetricNameChange = (name: string) => {
    setMetricName(name);
    const presets = METRIC_PRESETS[metricType as keyof typeof METRIC_PRESETS];
    const preset = presets?.find((p) => p.name === name);
    if (preset) {
      setUnit(preset.unit);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!value) {
      setError('Metric value is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          coachId,
          metricDate,
          metricType,
          metricName,
          value: parseFloat(value),
          unit,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to log metric');
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

  const presets = METRIC_PRESETS[metricType as keyof typeof METRIC_PRESETS] || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="metricDate" className="block text-sm font-medium text-gray-700 mb-1">
          Date *
        </label>
        <input
          id="metricDate"
          type="date"
          value={metricDate}
          onChange={(e) => setMetricDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Metric Type *</label>
        <div className="grid grid-cols-3 gap-4">
          {['weight', 'measurements', 'benchmark'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleMetricTypeChange(type)}
              className={`px-4 py-3 rounded-lg font-medium transition ${
                metricType === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="metricName" className="block text-sm font-medium text-gray-700 mb-1">
          Metric Name *
        </label>
        <select
          id="metricName"
          value={metricName}
          onChange={(e) => handleMetricNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
          required
        >
          {presets.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            Value *
          </label>
          <input
            id="value"
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0.00"
            disabled={loading}
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <input
            id="unit"
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="lbs"
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
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., Client felt good, morning weigh-in"
          disabled={loading}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Log Metric'}
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
