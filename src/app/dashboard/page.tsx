'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [coachName, setCoachName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCoachProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        const { data: coach } = await supabase
          .from('coaches')
          .select('name, email')
          .eq('id', user.id)
          .single();

        if (coach) {
          setCoachName(coach.name || coach.email);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCoachProfile();
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
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back, {coachName}!
              </h2>
              <p className="text-gray-600 mt-2">You're all set. More features coming soon!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Clients</h3>
                <p className="text-3xl font-bold text-indigo-600">0</p>
                <p className="text-sm text-gray-500 mt-2">Active clients</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sessions</h3>
                <p className="text-3xl font-bold text-indigo-600">0</p>
                <p className="text-sm text-gray-500 mt-2">This month</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress</h3>
                <p className="text-3xl font-bold text-indigo-600">—</p>
                <p className="text-sm text-gray-500 mt-2">Average progress</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
