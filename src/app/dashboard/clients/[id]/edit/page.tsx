'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ClientForm } from '@/components/ClientForm';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  start_date?: string;
  goals?: string;
}

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
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

        const response = await fetch(`/api/clients/${clientId}`);
        const data = await response.json();

        if (response.ok) {
          setClient(data.client);
        }
      } catch (err) {
        console.error('Error loading client:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId, router]);

  if (loading || !coachId) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Coach Progress Tracker</h1>
          <Link href={`/dashboard/clients/${clientId}`} className="text-indigo-600 hover:text-indigo-900">
            ← Back to Client
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Edit {client.name}</h2>
        <div className="bg-white rounded-lg shadow p-8">
          <ClientForm
            clientId={client.id}
            coachId={coachId}
            initialData={{
              name: client.name,
              email: client.email,
              phone: client.phone,
              goals: client.goals,
              start_date: client.start_date,
            }}
          />
        </div>
      </div>
    </div>
  );
}
