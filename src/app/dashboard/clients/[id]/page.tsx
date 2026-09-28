'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  start_date?: string;
  goals?: string;
}

interface Session {
  id: string;
  session_date: string;
  exercise_name: string;
  sets?: number;
  reps?: number;
  weight?: string;
  notes?: string;
  status: string;
}

interface Metric {
  id: string;
  metric_date: string;
  metric_type: string;
  metric_name: string;
  value: number;
  unit?: string;
  notes?: string;
}

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [coachId, setCoachId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        setCoachId(user.id);

        const clientResponse = await fetch(`/api/clients/${clientId}`);
        const clientData = await clientResponse.json();

        if (clientResponse.ok) {
          setClient(clientData.client);
        }

        const sessionsResponse = await fetch(`/api/sessions?clientId=${clientId}`);
        const sessionsData = await sessionsResponse.json();

        if (sessionsResponse.ok) {
          setSessions(sessionsData.sessions || []);
        }

        const metricsResponse = await fetch(`/api/metrics?clientId=${clientId}`);
        const metricsData = await metricsResponse.json();

        if (metricsResponse.ok) {
          setMetrics(metricsData.metrics || []);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId, router]);

  const handleExport = async (type: 'sessions' | 'metrics' | 'all') => {
    try {
      const url = `/api/export/csv?clientId=${clientId}&type=${type}`;
      window.location.href = url;
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Client not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Coach Progress Tracker</h1>
          <Link href="/dashboard/clients" className="text-indigo-600 hover:text-indigo-900">
            ← Back to Clients
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{client.name}</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-lg text-gray-900">{client.email || '—'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-lg text-gray-900">{client.phone || '—'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <p className="text-lg text-gray-900">
                  {client.start_date ? new Date(client.start_date).toLocaleDateString() : '—'}
                </p>
              </div>
            </div>

            {client.goals && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goals</label>
                <p className="text-lg text-gray-900 whitespace-pre-wrap">{client.goals}</p>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Link
                href={`/dashboard/clients/${client.id}/edit`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Edit Client
              </Link>
              <Link
                href={`/dashboard/clients/${client.id}/log-session`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Log Session
              </Link>
              <Link
                href={`/dashboard/clients/${client.id}/log-metric`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Log Metric
              </Link>
              <Link
                href="/dashboard/clients"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Back
              </Link>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleExport('sessions')}
                className="px-4 py-2 border-2 border-orange-300 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition text-sm"
              >
                Export Sessions
              </button>
              <button
                onClick={() => handleExport('metrics')}
                className="px-4 py-2 border-2 border-purple-300 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition text-sm"
              >
                Export Metrics
              </button>
              <button
                onClick={() => handleExport('all')}
                className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
              >
                Export All Data
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Session History</h3>
          {sessions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No sessions logged yet</p>
              <Link
                href={`/dashboard/clients/${client.id}/log-session`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition inline-block"
              >
                Log First Session
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Exercise
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Sets x Reps
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(session.session_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{session.exercise_name}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {session.sets && session.reps
                          ? `${session.sets}x${session.reps}`
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{session.weight || '—'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            session.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : session.status === 'missed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Metrics History</h3>
          {metrics.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No metrics logged yet</p>
              <Link
                href={`/dashboard/clients/${client.id}/log-metric`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition inline-block"
              >
                Log First Metric
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {metrics.map((metric) => (
                    <tr key={metric.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(metric.metric_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {metric.metric_type.charAt(0).toUpperCase() +
                            metric.metric_type.slice(1).replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{metric.metric_name}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {metric.value}
                        {metric.unit && ` ${metric.unit}`}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{metric.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
