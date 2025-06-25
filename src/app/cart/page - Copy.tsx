'use client';

import { useState, useEffect } from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const increaseQuantity = (id: number) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id: number) => {
    setCart(cart =>
      cart
        .map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                  ${item.price.toFixed(2)} × {item.quantity} ={" "}
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-right text-xl font-bold text-green-700">
            Total: ${total.toFixed(2)}
            <button
              onClick={async () => {
                try {
                  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                  console.log('🛒 Sending cart to checkout:', cart);
                  if (cart.length === 0) {
                    console.error('Cart is empty');
                    return;
                  }
                  const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart }),
                  });
                  if (!res.ok) {
                    const text = await res.text();
                    console.error('Checkout error:', text); // Will now show a real message
                    return;
                  }
                  const data = await res.json();
                  window.location = data.url;
                } catch (err) {
                  console.error('Unexpected error:', err);
                }
              }}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"              
            >
              Proceed to Checkout              
            </button> 
          </div>
        </div>
      )}
    </main>
  );
}

