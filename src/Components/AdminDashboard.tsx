import React, { useMemo } from 'react';

import { useSelector } from 'react-redux';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { RootState } from '@/store/store';

const AdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.user);
  const { books } = useSelector((state: RootState) => state.book);
  const { userBorrowedBooks, allBorrowedBooks } = useSelector((state: RootState) => state.borrow);

  const stats = useMemo(
    () => [
      { name: 'Total Users', value: users.length },
      { name: 'Total Books', value: books.length },
      { name: 'Borrowed (all Users)', value: allBorrowedBooks.length },
      { name: 'My Borrowings', value: userBorrowedBooks.filter(b =>!b.returned).length },
    ],
    [users.length, books.length, allBorrowedBooks.length, userBorrowedBooks, user]
  );

  return (
    <section className="p-6 md:ml-56 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(s => (
          <div key={s.name} className="bg-white rounded-2xl shadow p-6">
            <div className="text-sm text-gray-500 uppercase">{s.name}</div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Overview Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default AdminDashboard;