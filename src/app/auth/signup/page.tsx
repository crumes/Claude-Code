import { SignupForm } from '@/components/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Create Account</h1>
        <p className="text-gray-600 mb-6">Join coaches already using Coach Progress Tracker</p>
        <SignupForm />
      </div>
    </div>
  );
}
