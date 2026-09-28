'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalClients: number;
  sessionsThisMonth: number;
  metricsLogged: number;
  activeStudios: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [coachName, setCoachName] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    sessionsThisMonth: 0,
    metricsLogged: 0,
    activeStudios: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        setUserId(user.id);

        const { data: coach } = await supabase
          .from('coaches')
          .select('name, email')
          .eq('id', user.id)
          .single();

        if (coach) {
          setCoachName(coach.name || coach.email);
        }

        const { data: clients } = await supabase
          .from('clients')
          .select('id')
          .eq('coach_id', user.id)
          .eq('is_active', true);

        const { data: sessions } = await supabase
          .from('sessions')
          .select('id')
          .eq('coach_id', user.id)
          .gte('session_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);

        const { data: metrics } = await supabase
          .from('metrics')
          .select('id')
          .eq('coach_id', user.id);

        const { data: studios } = await supabase
          .from('studios')
          .select('id')
          .eq('created_by', user.id);

        setStats({
          totalClients: clients?.length || 0,
          sessionsThisMonth: sessions?.length || 0,
          metricsLogged: metrics?.length || 0,
          activeStudios: studios?.length || 0,
        });
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Coach Progress Tracker</h1>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard/clients" className="text-gray-600 hover:text-gray-900 font-medium">
              Clients
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back, {coachName}!
              </h2>
              <p className="text-gray-600 mt-2">Here's your coaching overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Active Clients</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalClients}</p>
                  </div>
                  <div className="text-4xl text-indigo-100">👥</div>
                </div>
                <Link
                  href="/dashboard/clients"
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-4 inline-block"
                >
                  View clients →
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Sessions This Month</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.sessionsThisMonth}</p>
                  </div>
                  <div className="text-4xl text-green-100">💪</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Metrics Logged</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.metricsLogged}</p>
                  </div>
                  <div className="text-4xl text-blue-100">📊</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Studios</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeStudios}</p>
                  </div>
                  <div className="text-4xl text-purple-100">🏋️</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/dashboard/clients"
                  className="px-6 py-4 border-2 border-indigo-200 hover:border-indigo-600 rounded-lg font-medium text-indigo-600 hover:bg-indigo-50 transition text-center"
                >
                  Manage Clients
                </Link>
                <Link
                  href="/dashboard/clients"
                  className="px-6 py-4 border-2 border-green-200 hover:border-green-600 rounded-lg font-medium text-green-600 hover:bg-green-50 transition text-center"
                >
                  Log Session
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
