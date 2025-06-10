"use client";
import React from "react";
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ResourcesCartSidebar() {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const router = useRouter();
  const resources = cart.filter(i => i.category === 'RESOURCES');
  const subtotal = resources.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <aside className="bg-[#171717] rounded-lg shadow-xl p-4 w-full max-w-xs sticky top-6 self-start flex flex-col gap-4">
      <h2 className="text-xl font-bold text-white mb-2">Resources Cart</h2>
      {loading ? (
        <div className="flex justify-center items-center py-8"><span className="loader" /></div>
      ) : resources.length === 0 ? (
        <div className="text-gray-400 text-center">Your cart is empty.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {resources.map(item => (
            <div key={item.id} className="flex items-center gap-2 bg-[#222] rounded p-2">
              {item.imageUrl && <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="w-10 h-10 object-contain rounded" />}
              <div className="flex-1">
                <div className="font-semibold text-white text-sm truncate">{item.name}</div>
                <div className="text-blue-400 text-xs">${Number(item.price).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={async () => await updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-[#333] text-white rounded" disabled={loading || item.quantity <= 1}>-</button>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                  className="w-12 px-1 py-0.5 rounded bg-[#222] text-white border border-[#333] text-center"
                  style={{ width: 48 }}
                  disabled={loading}
                />
                <button onClick={async () => await updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-[#333] text-white rounded" disabled={loading}>+</button>
              </div>
              <button onClick={async () => await removeFromCart(item.id)} className="text-red-400 hover:text-red-600" disabled={loading}>
                <span className="block lg:hidden" aria-label="Remove">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5V19a2 2 0 002 2h8a2 2 0 002-2V7.5M4 7.5h16M9.5 7.5V5a2 2 0 012-2h1a2 2 0 012 2v2.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
                  </svg>
                </span>
                <span className="hidden lg:block">Remove</span>
              </button>
            </div>
          ))}
          <div className="text-right text-lg font-bold text-blue-400 mt-2">Subtotal: ${subtotal.toFixed(2)}</div>
          <button
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg"
            onClick={() => router.push('/cart/checkout')}
            disabled={loading}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </aside>
  );
} 