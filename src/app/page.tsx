'use client';

import { useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type CartItem = Product & { quantity: number };

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
        try{
            const res = await fetch('/api/products');
            const text = await res.text();
            console.log('Raw API response:', text); // 👈 log this
            try {
                const data = JSON.parse(text);
                if (res.ok) {
                    setProducts(data);
                } else {
                    console.error('API error:', data.error || data);
                }                
            } catch (error) {
            console.error('Fetch errorFailed to load products:', error);
            }
        } catch (err) {
            console.error('Fetch failed:', err);
        }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">Tamutamu</h1>
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
