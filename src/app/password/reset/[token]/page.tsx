"use client";
import React, {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';
import {
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  resetAuthSlice,
  resetPassword,
} from '@/features/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

interface FormState {
    password: string;
    confirmPassword: string;
  }
  
  interface ShowPasswordState {
    password: boolean;
    confirmPassword: boolean;
  }

const ResetPassword: React.FC = () => {
  // Safely extract and normalize token to string
  const {token} = useParams<{ token: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, message, error } = useSelector((state: RootState) => state.auth);

//   const tokenParam = rawParams.token;
//   const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam || '';

  const [form, setForm] = useState<FormState>({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState<ShowPasswordState>({ password: false, confirmPassword: false });

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      router.push('/login');
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [message, error, dispatch, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    // Dispatch with normalized string token
    dispatch(resetPassword({ token, password: form.password, confirmPassword: form.confirmPassword }));
  };

  const toggleVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>

        {(['password', 'confirmPassword'] as const).map(field => (
          <div key={field} className="relative">
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field === 'password' ? 'New Password' : 'Confirm Password'}
            </label>
            <input
              id={field}
              name={field}
              type={showPassword[field] ? 'text' : 'password'}
              value={form[field]}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => toggleVisibility(field)}
              className="absolute inset-y-0 right-3 flex items-center mt-5 text-gray-400 hover:text-gray-600"
            >
              {showPassword[field] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
