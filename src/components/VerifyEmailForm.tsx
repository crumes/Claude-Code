'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const email = searchParams.get('email');

      if (!email) {
        setStatus('error');
        setError('Email not found');
        return;
      }

      setStatus('success');
      setTimeout(() => {
        router.push('/onboarding/profile');
      }, 2000);
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        {status === 'checking' && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Email Confirmed</h1>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <p className="text-gray-600">Setting up your profile...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Account Ready!</h1>
            <p className="text-gray-600 mb-4">
              Redirecting to complete your profile...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Verification Failed</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                The link may have expired. Try signing up again.
              </p>
              <Link
                href="/auth/signup"
                className="block px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Sign Up Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
