import React, {
  useEffect,
  useState,
} from 'react';

import { FiCheckCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  getAllBorrowedBooks,
  resetBorrowSlice,
} from '@/features/borrow/borrowSlice';
import { toggleReturnPopup } from '@/features/popUp/popUpSlice';
import ReturnBookPopup from '@/popups/ReturnBookPopup';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

interface EmailAndId {
  email: string;
  id: string;
}

const Catalog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { allBorrowedBooks, loading, error, message } = useSelector(
    (state: RootState) => state.borrow
  );
  const { returnPopup } = useSelector(
    (state: RootState) => state.popup
  );

  const [emailAndId, setEmailAndId] = useState<EmailAndId>({
    email: '',
    id: '',
  });
  const [activeTab, setActiveTab] = useState<'borrowed' | 'overdue'>('borrowed');

  // fetch all records
  useEffect(() => {
    dispatch(getAllBorrowedBooks());
  }, []);

  // handle success/error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
    if (message && !message.toLowerCase().includes('fetch')) {
      toast.success(message);
      // re-fetch to update table
      dispatch(getAllBorrowedBooks());
      dispatch(resetBorrowSlice());
    }
  }, [message, error, dispatch]);

  if (loading) return <p className="p-4">Loading catalog...</p>;

  const now = new Date();
  const borrowed = allBorrowedBooks.filter((r) => !r.returnDate);
  const overdue = borrowed.filter((r) => new Date(r.dueDate) < now);

  const openReturn = (email: string, id: string) => {
    setEmailAndId({ email, id });
    dispatch(toggleReturnPopup());
  };

  const renderRows = (list: typeof allBorrowedBooks) => (
    <tbody>
      {list.map((r) => (
        <tr key={r._id} className="border-t">
          <td className="px-6 py-2">{r.user.name}</td>
          <td className="px-6 py-2">{r.user.email}</td>
          <td className="px-6 py-2">₹{r.price}</td>
          <td className="px-6 py-2">{new Date(r.borrowDate).toLocaleDateString()}</td>
          <td className="px-6 py-2">{new Date(r.dueDate).toLocaleDateString()}</td>
          <td className="px-6 py-2">
            {r.returnDate ? (
              <FiCheckCircle className="text-green-600" />
            ) : (
              <button
                onClick={() => openReturn(r.user.email, r.book)}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                Return
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="p-4 md:ml-56 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Borrowed Catalog</h1>

      {/* tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('borrowed')}
          className={`px-4 py-2 rounded ${
            activeTab === 'borrowed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          Currently Borrowed
        </button>
        <button
          onClick={() => setActiveTab('overdue')}
          className={`px-4 py-2 rounded ${
            activeTab === 'overdue' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          Overdue
        </button>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">User Email</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Borrow Date</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          {activeTab === 'borrowed' && renderRows(borrowed)}
          {activeTab === 'overdue' && renderRows(overdue)}
        </table>
      </div>

      {/* return popup */}
      {returnPopup && (
        <ReturnBookPopup
          email={emailAndId.email}
          id={emailAndId.id}
        />
      )}
    </div>
  );
};

export default Catalog;
