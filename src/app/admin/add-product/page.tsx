'use client';

import { useState } from 'react';

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Submitting...');

    try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const text = await res.text();
    console.log('📦 Raw response:', text);

    const data = text ? JSON.parse(text) : {};

    if (res.ok) {
      setMessage('✅ Product added!');
      setForm({ name: '', description: '', price: '', image: '' });
    } else {
      setMessage(`❌ Error: ${data.error || 'Unknown error'}`);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Form submit error:', err.message);
    } else {
      console.error('Form submit error:', err);
    }
    setMessage('❌ Unexpected error during submission');
  }
};

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </main>
  );
}
