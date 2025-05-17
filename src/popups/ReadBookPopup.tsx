import React, { useEffect } from 'react';

import { toggleReadBookPopup } from '@/features/popUp/popUpSlice';
import { useAppDispatch } from '@/store/hooks';

interface ReadBook {
  title: string;
  author: string;
  description: string;
}

interface ReadBookProps {
  book: ReadBook;
}

const ReadBookPopup: React.FC<ReadBookProps> = ({ book }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(book.title);
    console.log(book.author);
    console.log(book.description);
  }, [book]);

  const handleClose = () => {
    dispatch(toggleReadBookPopup());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">{book.title}</h2>
        <p className="text-gray-700 mb-2">Author: {book.author}</p>
        <p className="text-gray-600 mb-4">{book.description}</p>
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReadBookPopup;
