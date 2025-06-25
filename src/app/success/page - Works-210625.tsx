'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const email = 'guest@example.com'; // You can replace this with real user data

    if (cart.length > 0) {
      fetch('/api/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'test@example.com',
          items: cart,
          amount: 2499, // ✅ make sure this is sent
          address: '123 Main St',
          stripeSessionId: 'cs_test_abc123',
         }),
      })
        .then(() => {
          localStorage.removeItem('cart'); // Clear cart
        })
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">✅ Payment Successful! 🎉</h1>        
        <p className="mb-6">Thank you for your order. Your groceries are on the way!</p>
        <p className="text-lg">Thanks for shopping with Tamutamu 🍎</p>
        <a href="/" className="mt-4 inline-block text-green-600 underline">Go back home</a>
        <Link href="/" className="text-blue-600 hover:underline">← Back to shop</Link>
      </div>
    </main>
  );
}