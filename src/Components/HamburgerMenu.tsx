'use client';

import {
  useEffect,
  useState,
} from 'react';

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

import { MenuItem } from './Sidebar';

const fullMenu: MenuItem[] = [
  { key: 'Dashboard',        label: 'Dashboard',         icon: <FiHome size={20} /> },
  { key: 'Books',            label: 'Books',             icon: <FiBookOpen size={20} /> },
  { key: 'Catalog',          label: 'Catalog',           icon: <FiLayers size={20} /> },
  { key: 'Users',            label: 'Users',             icon: <FiUsers size={20} /> },
  { key: 'My Borrowed Books',label: 'My Borrowed Books', icon: <FiUserPlus size={20} /> },
  { key: 'Add New Admin',    label: 'Add New Admin',     icon: <FiUserPlus size={20} /> },
  { key: 'Change Credentials', label: 'Change Credentials', icon: <FiLogOut size={20} /> },
];


interface HamburgerMenuProps {
  setSelectedComponent: (value: ComponentType) => void;
  // onLogout:            () => void;
}

export default function HamburgerMenu({
  setSelectedComponent,
  // onLogout,
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(open => !open);
  const router=useRouter();
  const dispatch=useAppDispatch();
  const {user}=useSelector((state : RootState)=>state.auth);
  
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


  // close on outside click / Escape
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const menuEl = document.querySelector('.mobile-sidebar');
      const btnEl  = document.querySelector('.hamburger-button');
     
      if (
        isOpen &&
        menuEl &&
        btnEl &&
        !menuEl.contains(e.target as Node) &&
        !btnEl.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [isOpen]);

  const handleSelect = (key: ComponentType) => {
    if(key === "Add New Admin"){
      dispatch(toggleAddNewAdminPopup());
      
    }else if(key=== "Change Credentials"){
      dispatch(toggleSettingPopup());
    }
    else
    setSelectedComponent(key);
    toggleMenu();
  };

  const menu = fullMenu.filter(item => {
    // 1) Remove Catalog & Users if not admin
    if ((item.key === 'Catalog' || item.key === 'Users' || item.key === 'Add New Admin') && user?.role ==="User") {
      return false;
    }
    // 2) Everyone else stays
    return true;
  });


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
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger-button fixed top-6 right-6 z-50 md:hidden focus:outline-none ${
          isOpen ? 'open' : ''
        }`}
        onClick={toggleMenu}
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <span
          className={`block w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${
            isOpen ? 'transform rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
            isOpen ? 'transform -rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Mobile Sidebar */}
      <aside
        className={`mobile-sidebar fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-40 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden flex flex-col`}
      >
        <div className="px-6 pt-16 flex-grow overflow-y-auto">
          <h2 className="text-2xl font-bold mb-8">BookWorm</h2>
          <nav>
            <ul className="space-y-4">
              {menu.map(({ key, label, icon }) => (
                <li key={key}>
                  <button
                    onClick={() => handleSelect(key)}
                    className="flex items-center space-x-3 w-full text-left text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    <span>{icon}</span>
                    <span className="font-medium">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout at the bottom */}
        <div className="px-6 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full text-left text-gray-800 hover:text-red-600 transition-colors"
          >
            <FiLogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
}
