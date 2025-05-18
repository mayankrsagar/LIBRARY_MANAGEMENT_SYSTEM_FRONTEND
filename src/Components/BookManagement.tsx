import React, {
  useEffect,
  useState,
} from 'react';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  BookAdditionalData,
  resetBookSlice,
} from '@/features/book/bookSlice';
import { resetBorrowSlice } from '@/features/borrow/borrowSlice';
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordPopup,
} from '@/features/popUp/popUpSlice';
import AddBookPopup from '@/popups/AddBookPopup';
import ReadBookPopup from '@/popups/ReadBookPopup';
import RecordBookPopup from '@/popups/RecordBookPopup';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

export type ReadBook = Pick<BookAdditionalData, 'title' | 'author' | 'description'>;

const BookManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const {  error, books, message } = useSelector((s: RootState) => s.book);
  const {  error: borrowError, message: borrowMessage } = useSelector(
    (s: RootState) => s.borrow
  );
  const { addBookPopup, readBookPopup, recordPopup } = useSelector(
    (s: RootState) => s.popup
  );

  const [readBook, setReadBook] = useState<ReadBook>({
    title: '',
    author: '',
    description: '',
  });

  const [borrowBookId, setBorrowBookId] = useState<string>('');
  const [searchTitle, setSearchTitle] = useState<string>('');
useEffect(() => {
  // only show real write‐action successes
  if (message && !message.toLowerCase().includes('fetch')) {
    toast.success(message);
    dispatch(resetBookSlice());
  }
  if (borrowMessage && !borrowMessage.toLowerCase().includes('fetch')) {
    toast.success(borrowMessage);
    dispatch(resetBorrowSlice());
  }

  // show errors always
  if (error) {
    toast.error(error);
    dispatch(resetBookSlice());
  }
  if (borrowError) {
    toast.error(borrowError);
    dispatch(resetBorrowSlice());
  }
}, [message, borrowMessage, error, borrowError, dispatch]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value.toLowerCase());
  };

  const openReadPopup = (id: string) => {
    const book = books.find((b) => b._id === id);
    if (book) {
      setReadBook({
        title: book.title,
        author: book.author,
        description: book.description,
      });
      dispatch(toggleReadBookPopup());
    }
  };

  const openRecordBookPopup = (id: string) => {
    setBorrowBookId(id);
    dispatch(toggleRecordPopup());
  };

 const filtered = books.filter((b) => {
    return b && typeof b.title === 'string' && b.title.toLowerCase().includes(searchTitle);
  });

  return (
    <div className="p-4 md:ml-56 bg-gray-100 min-h-screen">
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {user?.role === 'Admin' ? 'Book Management' : 'Books'}
        </h1>
        {user?.role === 'Admin' && (
          <button
            onClick={() => dispatch(toggleAddBookPopup())}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Add Book
          </button>
        )}
      </div>
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTitle}
        onChange={handleSearch}
        className="mb-4 px-3 py-2 border rounded w-full"
      />

      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                {user?.role === 'Admin' && (
                  <th className="px-4 py-2">Quantity</th>
                )}
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Availability</th>
                {user?.role === 'Admin' && (
                  <th className="px-4 py-2">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <tr key={book._id} className="border-t">
                  <td className="px-4 py-2">{book._id.slice(-6)}</td>
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.author}</td>
                  {user?.role === 'Admin' && (
                    <td className="px-4 py-2">{book.quantity}</td>
                  )}
                  <td className="px-4 py-2">₹{book.price}</td>
                  <td className="px-4 py-2">
                    {book.availability ? 'Available' : 'Out of stock'}
                  </td>
                  {user?.role === 'Admin' && (
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => openReadPopup(book._id)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openRecordBookPopup(book._id)}
                        className="text-green-600 hover:underline"
                      >
                        Record
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h3>No books found</h3>
      )}

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordPopup && <RecordBookPopup bookId={borrowBookId} />}
    </div>
    </div>
  );
};

export default BookManagement;
