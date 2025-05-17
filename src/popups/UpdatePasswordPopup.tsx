import React, { useState } from 'react';

import axios from 'axios';
import {
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

import { toggleSettingPopup } from '@/features/popUp/popUpSlice';
import { useAppDispatch } from '@/store/hooks';

const UpdatePasswordPopup: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put('http://localhost:4000/api/v1/auth/password/update', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      }, {
        withCredentials: true,
      });

      toast.success(response.data.message || 'Password updated successfully');
      dispatch(toggleSettingPopup());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to update password');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-96 space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Update Password</h2>

        <div className="relative">
          <input
            type={showPassword.currentPassword ? 'text' : 'password'}
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('currentPassword')}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword.currentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showPassword.newPassword ? 'text' : 'password'}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('newPassword')}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword.newPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showPassword.confirmNewPassword ? 'text' : 'password'}
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirmNewPassword')}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword.confirmNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>

        <button
          type="button"
          onClick={() => dispatch(toggleSettingPopup())}
          className="w-full py-2 mt-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdatePasswordPopup;
