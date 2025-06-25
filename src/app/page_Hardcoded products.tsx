'use client';

import { useState } from 'react';

const products = [
  { id: 1, name: "Fresh Apples", price: 3.99, image: "https://source.unsplash.com/featured/?apples" },
  { id: 2, name: "Organic Bananas", price: 2.49, image: "https://source.unsplash.com/featured/?bananas" },
  { id: 3, name: "Broccoli", price: 1.99, image: "https://source.unsplash.com/featured/?broccoli" }
];

export default function Home() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);

  const addToCart = (product: { id: number; name: string; price: number }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const updatedCart = existingItem
        ? prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        :  [...prevCart, { ...product, quantity: 1 }];

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">GreenCart</h1>
        <a href="/cart" className="text-sm text-gray-700 hover:text-green-600">
  🛒      Cart: <strong>{cart.reduce((total, item) => total + item.quantity, 0)}</strong> items
      </a>
      </header>

      <section className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow p-4">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-2" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-green-700 font-bold">${product.price.toFixed(2)}</p>
            <button
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}
