"use client";

import { reset } from '@/lib/actions/user.actions';
import { ResetPass } from '@/types/schema';
import { useState, FormEvent } from 'react';

const ForgotPasswordForm: React.FC = () => {
  const [form, setForm] = useState<Partial<ResetPass>>({ email: '' });
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (form.email) {
      await reset(form as ResetPass);
    } else {
      setMessage('Email is required.');
      setLoading(false);
    }

    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      setMessage('If this email is registered, a reset link has been sent.');
      setForm({ email: '' });
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={form.email || ''}
              onChange={(e) => setForm({ email: e.target.value })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white font-bold py-2 rounded-md transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
