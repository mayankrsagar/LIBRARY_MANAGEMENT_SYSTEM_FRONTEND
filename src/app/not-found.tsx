'use client';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Sorry, the page you are looking for does not exist.</p>
      <button
        onClick={() => router.push('/')}
        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Go back home
      </button>
    </div>
  );
}