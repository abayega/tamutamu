'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <main>
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">GreenCart</h1>

        <div className="flex items-center gap-4">
          <a href="/cart" className="text-sm hover:text-green-600">🛒 Cart</a>
          {session ? (
            <>
              <span className="text-sm">Hi, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn('github')}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Login with GitHub
            </button>
          )}
        </div>
      </header>

      {/* ✅ Add your grocery items here */}
      <section className="p-4">
        <h2 className="text-xl font-semibold mb-2">Fresh Picks</h2>
        {/* Example static item */}
        <div className="border p-4 rounded shadow">
          <h3 className="text-lg font-bold">Apples</h3>
          <p>$2.99 / lb</p>
          <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded">
            Add to Cart
          </button>
        </div>
      </section>
    </main>
  );
}
