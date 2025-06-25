'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '/context/CartContext'; // adjust path if needed

export default function RootLayout({ children }) {
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
