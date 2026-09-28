'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ClientForm } from '@/components/ClientForm';

export default function NewClientPage() {
  const router = useRouter();
  const [coachId, setCoachId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCoachId = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      setCoachId(user.id);
      setLoading(false);
    };

    getCoachId();
  }, [router]);

  if (loading || !coachId) {
    return <div>Loading...</div>;
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
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Add New Client</h2>
        <div className="bg-white rounded-lg shadow p-8">
          <ClientForm coachId={coachId} />
        </div>
      </div>
    </div>
  );
}
