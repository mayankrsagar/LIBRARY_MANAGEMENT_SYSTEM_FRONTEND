// src/Components/OtpVerification.tsx
'use client';

import React, {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import { FiMail } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  otpVerification,
  resetAuthSlice,
} from '@/features/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

export default function OtpVerification() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const params   = useParams<{ email: string }>();  // 👉 ensure email is a string
  const email = decodeURIComponent(params.email);

  const [otp, setOtp] = useState('');

  const { loading, error, message, isAuthenticated } = useSelector(
    (s: RootState) => s.auth
  );

  // Clear any previous auth state on mount
  // useEffect(() => {
  //   dispatch(resetAuthSlice());
  // }, [dispatch]);

  // Show errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [error]);

  // On success, toast + redirect
  useEffect(() => {
    if (message) toast.success(message);
    if (isAuthenticated) router.push('/');
  }, [message, isAuthenticated, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 1) Must have an email param
    if (!email) {
      toast.error('Invalid verification link (no email provided)');
      return;
    }

    // 2) Must enter OTP
    if (!otp.trim()) {
      toast.error('Please enter the OTP code');
      return;
    }
    
    // Dispatch the thunk
    dispatch(otpVerification({ email: email.toLowerCase(), otp }));
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Verify Your Account
        </h2>

        <p className="text-sm text-center text-gray-600 flex items-center justify-center space-x-2">
          <FiMail /> 
          <span>
            We sent an OTP to{' '}
            <strong>{email || '<no-email>'}</strong>
          </span>
        </p>

        {/* OTP Input */}
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            OTP Code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            disabled={loading}
            required
            autoFocus
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter the 6-digit code"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex justify-center items-center disabled:opacity-70"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {/* Links */}
        <div className="text-center space-y-2 text-sm text-gray-600">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
          <p>
            Don’t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
