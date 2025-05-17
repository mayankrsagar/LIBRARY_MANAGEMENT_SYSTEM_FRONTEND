// src/app/page.tsx
'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import AdminDashboard from '@/Components/AdminDashboard';
import BookManagement from '@/Components/BookManagement';
import Catalog from '@/Components/Catalog';
import HamburgerMenu from '@/Components/HamburgerMenu';
import Header from '@/Components/Header';
import MyBorrowedBooks from '@/Components/MyBorrowedBooks';
import Sidebar from '@/Components/Sidebar';
import UserDashboard from '@/Components/UserDashboard';
import Users from '@/Components/Users';
import { getUser } from '@/features/auth/authSlice';
import { getAllBooks } from '@/features/book/bookSlice';
import { getAllUsers } from '@/features/user/userSlice';
import AddNewAdminPopup from '@/popups/AddNewAdminPopup';
import UpdatePasswordPopup from '@/popups/UpdatePasswordPopup';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

export type ComponentType =
  | 'Dashboard'
  | 'Books'
  | 'Catalog'
  | 'Users'
  | 'My Borrowed Books'
  | 'Add New Admin'
  | 'Change Credentials';



export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>('Dashboard');
  const dispatch = useAppDispatch();
  const router=useRouter();
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const { addNewAdminPopup ,settingPopup } = useSelector((s: RootState) => s.popup);

  // const handleLogout = () => {
  //   dispatch(logout());
  // };

  const renderContent = () => {
    switch (selectedComponent) {
      case 'Dashboard':
        return user?.role === 'User' ? <UserDashboard /> : <AdminDashboard />;
      case 'Books':
        return <BookManagement />;
      case 'Catalog':
        return user?.role === 'Admin' ? <Catalog /> : <UserDashboard />;
      case 'Users':
        return user?.role === 'Admin' ? <Users /> : <UserDashboard />;
      case 'My Borrowed Books':
        return <MyBorrowedBooks />;
      default:
        return user?.role === 'User' ? <UserDashboard /> : <AdminDashboard />;
    }
  };

 

  
// Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  
  }, [router,isAuthenticated]);

useEffect(()=>{
  dispatch(getUser());
  dispatch(getAllBooks());
  // dispatch(getAllBorrowedBooks());
  if(isAuthenticated && user?.role === "Admin"){
    dispatch(getAllUsers());
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[])

   
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex pt-20"> {/* pt-20 offsets the fixed header */}
        <HamburgerMenu
          setSelectedComponent={setSelectedComponent}
          // onLogout={handleLogout}
        />

        {/* Desktop sidebar */}
      <Sidebar
        setSelectedComponent={setSelectedComponent}
        // onLogout={handleLogout}
      />

        {addNewAdminPopup && (
          <AddNewAdminPopup/>
        )}

        {
          settingPopup && <UpdatePasswordPopup />
        }


        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
