import './globals.css';

import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
} from 'next/font/google';

import ToastProvider from '@/Components/ToastProvider';
import StoreProvider from '@/store/storeProvider';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Library Management App',
  description: 'A simple CRUD library management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* redux store is now available to all client components under here */}
        <StoreProvider>
          {children}
          <ToastProvider />
        </StoreProvider>
      </body>
    </html>
  )
}
