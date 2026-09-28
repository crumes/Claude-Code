import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Sign In</h1>
        <p className="text-gray-600 mb-6">Welcome back to Coach Progress Tracker</p>
        <LoginForm />
      </div>
    </div>
  );
}
