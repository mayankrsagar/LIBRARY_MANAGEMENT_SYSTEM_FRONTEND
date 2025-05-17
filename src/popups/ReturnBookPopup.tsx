import React from 'react';

import { useSelector } from 'react-redux';

import { returnBorrowedBook } from '@/features/borrow/borrowSlice';
import { toggleReturnPopup } from '@/features/popUp/popUpSlice';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

interface ReturnBookProps {
  email: string;
  id: string;
}

const ReturnBookPopup: React.FC<ReturnBookProps> = ({ email, id }) => {
  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.borrow);

  // // handle success/error
  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //     dispatch(resetBorrowSlice());
  //   }
  //   if (message) {
  //     toast.success(message);
  //     dispatch(resetBorrowSlice());
  //     dispatch(toggleReturnPopup());
  //   }
  // }, [error, message, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(returnBorrowedBook({ email, id }));
  };

  const handleClose = () => {
    dispatch(toggleReturnPopup());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Return Borrowed Book</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              User Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
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
              {loading ? 'Processing...' : 'Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnBookPopup;
