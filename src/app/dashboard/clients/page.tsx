'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  start_date?: string;
  goals?: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [coachId, setCoachId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        setCoachId(user.id);

        const response = await fetch(`/api/clients?coachId=${user.id}`);
        const data = await response.json();

        if (response.ok) {
          setClients(data.clients || []);
        }
      } catch (err) {
        console.error('Error loading clients:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [router]);

  const handleDelete = async (clientId: string, clientName: string) => {
    if (!confirm(`Are you sure you want to delete ${clientName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClients(clients.filter((c) => c.id !== clientId));
      }
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Coach Progress Tracker</h1>
          <div className="flex gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Clients</h2>
            <p className="text-gray-600 mt-1">{clients.length} active client(s)</p>
          </div>
          {coachId && (
            <Link
              href={`/dashboard/clients/new`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              + Add Client
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No clients yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first client</p>
            {coachId && (
              <Link
                href={`/dashboard/clients/new`}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition inline-block"
              >
                Add First Client
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Start Date</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/clients/${client.id}`}
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{client.email || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{client.phone || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {client.start_date
                        ? new Date(client.start_date).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <Link
                        href={`/dashboard/clients/${client.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(client.id, client.name)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
