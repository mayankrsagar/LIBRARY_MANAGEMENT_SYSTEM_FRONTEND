// src/Components/Login.tsx
'use client';

import React, {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { login } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

export default function Login() {
  const dispatch = useAppDispatch();
  const router   = useRouter();

  // Form fields
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Pull loading & error from Redux
  const { loading, error, isAuthenticated } = useSelector((s: RootState) => s.auth);

  // Show toast on error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Redirect on successful login
  useEffect(() => {
    if (isAuthenticated) {
      // toast.success('Login successful!');
      router.push('/');
    }
  }, [isAuthenticated, router]);

// src/Components/Login.tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!email || !password) {
    toast.error('Email and password are required');
    return;
  }

  try {
    // Wait for the login thunk to resolve or throw
    await dispatch(login({ email, password })).unwrap();
    toast.success('Login successful!');
    router.push('/');
  } catch (err: unknown) {
    // `unwrap()` will throw your rejectWithValue message
    if(err instanceof Error)
    toast.error(err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>
        <p className="text-sm text-right mt-1">
  <Link href="/password/forgot" className="text-blue-600 hover:underline">
    Forgot password?
  </Link>
</p>
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex justify-center items-center disabled:opacity-70"
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          )}
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {/* Sign up link */}
        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
