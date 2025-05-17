'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import {
  FiBookOpen,
  FiHome,
  FiLayers,
  FiLogOut,
  FiUserPlus,
  FiUsers,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { ComponentType } from '@/app/page';
import {
  logout,
  resetAuthSlice,
} from '@/features/auth/authSlice';
import {
  toggleAddNewAdminPopup,
  toggleSettingPopup,
} from '@/features/popUp/popUpSlice';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

export interface MenuItem {
  key:   ComponentType;
  label: string;
  icon:  React.ReactNode;
}

const fullMenu: MenuItem[] = [
  { key: 'Dashboard',        label: 'Dashboard',         icon: <FiHome size={20} /> },
  { key: 'Books',            label: 'Books',             icon: <FiBookOpen size={20} /> },
  { key: 'Catalog',          label: 'Catalog',           icon: <FiLayers size={20} /> },
  { key: 'Users',            label: 'Users',             icon: <FiUsers size={20} /> },
  { key: 'My Borrowed Books',label: 'My Borrowed Books', icon: <FiUserPlus size={20} /> },
  { key: 'Add New Admin',    label: 'Add New Admin',     icon: <FiUserPlus size={20} /> },
  { key: 'Change Credentials', label: 'Change Credentials', icon: <FiLogOut size={20} /> },
];

interface SidebarProps {
  setSelectedComponent: (value: ComponentType) => void;
  // onLogout:            () => void;
}

export default function Sidebar({ setSelectedComponent}: SidebarProps) {
  const dispatch=useAppDispatch();
  const { user}=useSelector((state : RootState)=>state.auth);
const router=useRouter();
 
  // useEffect(()=>{
  //   if(error){
  //     toast.error(error);
  //   dispatch(resetAuthSlice());
  //   }
    
  //   if(message){
  //     toast.success(message);
  //     dispatch(resetAuthSlice());
  //   }

  // },[error,dispatch,message,isAuthenticated,loading])

  const menu = fullMenu.filter(item => {
    // 1) Remove Catalog & Users if not admin
    if ((item.key === 'Catalog' || item.key === 'Users' || item.key === 'Add New Admin') && user?.role==="User") {
      return false;
    }
    // 2) Everyone else stays
    return true;
  });
  
const handleSelect = (key: ComponentType) => {
    if(key === "Add New Admin"){
      dispatch(toggleAddNewAdminPopup());
    }else if(key === "Change Credentials"){
      dispatch(toggleSettingPopup());
    }
    else
    setSelectedComponent(key);
  };


const handleLogout = async () => {
  try {
    // wait for the thunk to finish
    const { message } = await dispatch(logout()).unwrap();
    // show its success message
    toast.success(message);
  } catch (err: unknown) {
    if(err instanceof Error)
    toast.error(err.message);
  } finally {
    // clear any leftover flags, ensure isAuthenticated is false
    dispatch(resetAuthSlice());
    // send them to login
    router.push('/login');
  }
};


  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 bg-gray-900 text-white shadow-lg z-30">
      <div className="flex items-center space-x-3 px-6 py-8">
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </span>
        <span className="text-2xl font-bold">BookWorm</span>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {menu.map(({ key, label, icon }) => (
            <li key={key}>
              <button
                onClick={() =>handleSelect(key)}
                className="flex items-center space-x-3 w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <span className="text-gray-300">{icon}</span>
                <span className="font-medium">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout at the bottom */}
      <div className="px-4 py-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FiLogOut size={20} className="text-gray-300" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
