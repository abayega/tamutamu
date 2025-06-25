'use client';

import { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart(); // 🧹 clear cart when arriving on this page
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">✅ Payment Successful!</h1>
        <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
        <p className="mb-6">Thank you for your order. Your groceries are on the way!</p>
        <p className="text-lg">Thanks for shopping with GreenCart 🍎</p>
        <a href="/" className="mt-4 inline-block text-green-600 underline">Go back home</a>
        <Link href="/" className="text-blue-600 hover:underline">← Back to shop</Link>
      </div>
    </main>
  );
}
