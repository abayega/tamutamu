'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const saveOrder = async () => {
      if (!sessionId) {
        console.warn('⚠️ No session ID found in URL');
        return;
      }
      console.log('📦 Sending request to finalize order with session_id:', sessionId);

      const res = await fetch(`/api/finalize-order?session_id=${sessionId}`);
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
      } else {
        console.error('Order saving failed:', data.error);
        setStatus('error');
      }
    };
    saveOrder();
  }, [sessionId]);
  //<a href="/" className="mt-4 inline-block text-green-600 underline">Go back home</a>
  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">✅ Payment Successful! 🎉</h1>        
        <p className="mb-6">Thank you for your order. Your groceries are on the way!</p>
        <p className="text-lg">Thanks for shopping with Tamutamu 🍎</p>
        {status === 'loading' && <p>Saving your order...</p>}
        {status === 'success' && <p>Your order has been saved successfully.</p>}
        {status === 'error' && <p>There was a problem saving your order.</p>}
        
        <Link href="/" className="text-blue-600 hover:underline">← Back to shop</Link>
      </div>
    </main>
  );
}