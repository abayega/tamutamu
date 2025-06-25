'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

type ReceiptItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function SuccessPage() {
  const { clearCart } = useCart();
  const [receipt, setReceipt] = useState<ReceiptItem[]>([]);

  useEffect(() => {
    clearCart();
    // Load the last receipt from localStorage
    const stored = localStorage.getItem('lastReceipt');
    if (stored) {
      setReceipt(JSON.parse(stored));
      localStorage.removeItem('lastReceipt'); // ✅ clean up
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = receipt.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
      <p className="mb-6">Thank you for your order. Here’s a summary:</p>

      {receipt.length > 0 ? (
        <div className="mb-8 mx-auto max-w-md text-left">
          <ul className="border rounded p-4 space-y-2 bg-gray-50">
            {receipt.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.quantity} × {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-semibold text-right">
            Total: ${total.toFixed(2)}
          </p>
        </div>
      ) : (
        <p className="mb-6 text-gray-500">No receipt data found.</p>
      )}

      <Link href="/" className="text-blue-600 hover:underline">← Back to shop</Link>
    </main>
  );
}
