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

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

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

    loadClient();
  }, [clientId, router]);

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

          <div className="mt-8 flex gap-4">
            <Link
              href={`/dashboard/clients/${client.id}/edit`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Edit Client
            </Link>
            <Link
              href="/dashboard/clients"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
