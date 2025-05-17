import React, {
  useEffect,
  useState,
} from 'react';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { getAllUsers } from '@/features/user/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useSelector((state: RootState) => state.user);

  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPage = Math.ceil(users.length / perPage);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) return <p className="text-center py-10">Loading users...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  // Paginated slice
  const start = (page - 1) * perPage;
  const paginated = users.slice(start, start + perPage);

  return (
    <div className="p-6 bg-gray-100 min-h-full md:ml-56">
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Role</th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase">Books Borrowed</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Registered On</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((user, idx) => (
              <tr
                key={user._id}
                className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="px-6 py-4 text-sm text-gray-700">{user._id.slice(-6)}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                <td className="px-6 py-4 text-sm text-blue-600 hover:underline">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
                      user.role === 'Admin'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  {user.borrowedBooks.length}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-3">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} of {totalPage}
        </span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPage))}
          disabled={page === totalPage}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
