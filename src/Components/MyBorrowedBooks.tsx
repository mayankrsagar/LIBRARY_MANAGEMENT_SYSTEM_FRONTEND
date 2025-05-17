import React, {
  useEffect,
  useState,
} from 'react';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  borrowedBookByUser,
  resetBorrowSlice,
} from '@/features/borrow/borrowSlice';
import { toggleReadBookPopup } from '@/features/popUp/popUpSlice';
import ReadBookPopup from '@/popups/ReadBookPopup';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

// Reuse the same ReadBook type
type ReadBook = {
  title: string;
  author: string;
  description: string;
};

const MyBorrowedBooks: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userBorrowedBooks, loading, error, message } = useSelector(
    (state: RootState) => state.borrow
  );
  const { books } = useSelector((state: RootState) => state.book);
  const { readBookPopup } = useSelector((state: RootState) => state.popup);

  // Tabs
  const [activeTab, setActiveTab] = useState<'current' | 'returned'>('current');
  // Book details for popup
  const [readBook, setReadBook] = useState<ReadBook>({ title: '', author: '', description: '' });

  useEffect(() => {
    dispatch(borrowedBookByUser());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
    if (message && !message.toLowerCase().includes('fetch')) {
      toast.success(message);
      dispatch(resetBorrowSlice());
    }
  }, [message, error, dispatch]);

  if (loading) return <p className="p-4">Loading your borrowed books...</p>;

  const notReturned = userBorrowedBooks.filter((b) => !b.returned);
  const returned = userBorrowedBooks.filter((b) => b.returned);

  // Open read popup using redux flag
  const openRead = (id: string) => {
    const fullBook = books.find((x) => x._id === id);
    if (fullBook) {
      setReadBook({
        title: fullBook.title,
        author: fullBook.author,
        description: fullBook.description,
      });
      dispatch(toggleReadBookPopup());
    }
  };

  const renderTable = (list: typeof userBorrowedBooks) => (
    <div className="overflow-x-auto">
      {list.length ? (
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Book Title</th>
              <th className="px-6 py-3 text-left">Borrowed Date</th>
              <th className="px-6 py-3 text-left">Due Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.bookId} className="border-t">
                <td className="px-6 py-2">{b.bookTitle}</td>
                <td className="px-6 py-2">{new Date(b.borrowedDate).toLocaleDateString()}</td>
                <td className="px-6 py-2">{new Date(b.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-2">
                  <button
                    onClick={() => openRead(b.bookId)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 mt-2">No books in this section.</p>
      )}
    </div>
  );

  return (
    <div className="p-4 md:ml-56 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Borrowed Books</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('current')}
          className={`px-4 py-2 rounded ${
            activeTab === 'current' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          Currently Borrowed
        </button>
        <button
          onClick={() => setActiveTab('returned')}
          className={`px-4 py-2 rounded ${
            activeTab === 'returned' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          Returned Books
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'current' && renderTable(notReturned)}
        {activeTab === 'returned' && renderTable(returned)}
      </div>

      {/* Read Details Popup from Redux flag */}
      {readBookPopup && <ReadBookPopup book={readBook} />}
    </div>
  );
};

export default MyBorrowedBooks;
