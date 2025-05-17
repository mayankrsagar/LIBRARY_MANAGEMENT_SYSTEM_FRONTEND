import React, {
  useEffect,
  useState,
} from 'react';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { getAllBooks } from '@/features/book/bookSlice';
import {
  recordBorrowedBook,
  resetBorrowSlice,
} from '@/features/borrow/borrowSlice';
import { toggleRecordPopup } from '@/features/popUp/popUpSlice';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

interface RecordBookPopupProps {
  bookId: string;
}

const RecordBookPopup: React.FC<RecordBookPopupProps> = ({ bookId }) => {
  const dispatch = useAppDispatch();
  const { loading, error, message } = useSelector((state: RootState) => state.borrow);
  const [email, setEmail] = useState<string>('');

  // Close on success or error
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(toggleRecordPopup());
      dispatch(getAllBooks());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [message, error, dispatch]);

  const handleClose = () => {
    dispatch(toggleRecordPopup());
    dispatch(resetBorrowSlice());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }
    dispatch(recordBorrowedBook({ email, id: bookId }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Record Borrowed Book</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              User Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="user@example.com"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-70"
            >
              {loading ? 'Recording...' : 'Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordBookPopup;
