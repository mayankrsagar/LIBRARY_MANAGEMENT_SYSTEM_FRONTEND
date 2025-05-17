'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { FiSettings } from 'react-icons/fi';
import { useSelector } from 'react-redux';

import { toggleSettingPopup } from '@/features/popUp/popUpSlice';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

interface DateAndTime {
  date: string;
  time: string;
}

export default function Header() {
  const dispatch = useAppDispatch();
  const { user } = useSelector((s: RootState) => s.auth);

  const [dt, setDt] = useState<DateAndTime>({ date: '', time: '' });

  const updateDateAndTime = useCallback(() => {
    const now = new Date();
    setDt({
      date: now.toLocaleDateString(undefined, {
        weekday: 'long',
        year:    'numeric',
        month:   'long',
        day:     'numeric',
      }),
      time: now.toLocaleTimeString(undefined, {
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });
  }, []);

  useEffect(() => {
    updateDateAndTime();
    const id = setInterval(updateDateAndTime, 1000);
    return () => clearInterval(id);
  }, [updateDateAndTime]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow px-6 py-3 md:pr-6 pr-10 flex justify-between items-center w-full">
      {/* Welcome with role */}
      <div className="text-lg font-medium text-gray-700">
        Welcome,&nbsp;
        <span className="font-semibold">
          {user?.name ?? 'Guest'}
          {user?.role ? ` (${user.role})` : ''}
        </span>
      </div>

      {/* Date & Time */}
      <div className="text-right text-sm text-gray-600 flex-shrink-0 mx-4">
        <div>{dt.date}</div>
        <div className="font-mono">{dt.time}</div>
      </div>

      {/* Settings button */}
      <button
        onClick={() => dispatch(toggleSettingPopup())}
        className="p-2 rounded-full hover:bg-gray-100 transition hidden md:block"
        aria-label="Settings"
      >
        <FiSettings size={24} className="text-gray-600" />
      </button>
    </header>
  );
}

