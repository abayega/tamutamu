'use client';

import { useEffect, useState } from 'react';

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  address: string;
  amount: number;
  stripeSessionId: string;
  items: string;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin: Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Order #{order.id}</h2>
              <p><strong>🧑 Name:</strong> {order.name}</p>
              <p><strong>📧 Email:</strong> {order.email}</p>
              <p><strong>📞 Phone:</strong> {order.phone || 'N/A'}</p>
              <p><strong>🏠 Address:</strong> {order.address}</p>
              <p><strong>💵 Amount Paid:</strong> ${(order.amount / 100).toFixed(2)}</p>
              <p><strong>🛒 Items:</strong></p>
              <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleString()}</p>
              <ul className="mt-2 list-disc list-inside">
                {(JSON.parse(order.items) as OrderItem[]).map((item, index) => (
                  <li key={index}>
                    {item.name} × {item.quantity} — ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}