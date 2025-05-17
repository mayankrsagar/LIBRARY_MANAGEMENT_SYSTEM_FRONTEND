"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react';

import Image from 'next/image';
import {
  FiEye,
  FiEyeOff,
  FiX,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

import { toggleAddNewAdminPopup } from '@/features/popUp/popUpSlice';
import { addNewAdmin } from '@/features/user/userSlice';
import { useAppDispatch } from '@/store/hooks';

export default function AddNewAdminPopup() {
  const dispatch = useAppDispatch();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  };

const handleSubmit = async (e: FormEvent) => {
   e.preventDefault();
   try {
     // Throws if rejected, so you can catch validation errors
     const { message } = await dispatch(
       addNewAdmin({ name, email, password, avatar: avatarFile })
     ).unwrap();
     toast.success(message);
     dispatch(toggleAddNewAdminPopup());
   } catch (err: unknown) {
  let msg = 'Error while registering new Admin';
  console.error(err);
  if (typeof err === 'string') {
    msg = err;
  } else if (err instanceof Error) {
    msg = err.message;
  }
  toast.error(msg);
}

 };
  const onClose = () => dispatch(toggleAddNewAdminPopup());

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center">
            <label className="relative cursor-pointer">
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Avatar preview"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Upload</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
            <span className="text-xs text-gray-500 mt-2">Click avatar to upload</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Admin name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@example.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-3 mt-5 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
