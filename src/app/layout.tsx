'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../context/CartContext'; // ✅ this is important

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}