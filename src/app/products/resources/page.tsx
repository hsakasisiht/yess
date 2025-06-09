"use client";
import { useCart } from '../../../context/CartContext';
import CartModal from '../../../components/CartModal';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function ResourcesPage() {
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [resources, setResources] = useState<unknown[]>([]);
  const totalResources = cart.filter(i => i.category === 'RESOURCES').reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    fetch('/api/products/resources')
      .then(res => res.json())
      .then(data => setResources(data));
  }, []);

  return (
    <div className="min-h-screen text-white p-8 animate-fade-in mt-16 sm:mt-0">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">Resources</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <div
            className="relative flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-green-500/30 shadow-lg hover:shadow-green-500/30 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:bg-white/20"
            onClick={() => setCartOpen(true)}
            title="View Cart"
            style={{ minWidth: 120 }}
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-500/20 border border-green-400/30 shadow-inner">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12.93V17h-2v-2.07A6.002 6.002 0 014 11H2v-2h2a6.002 6.002 0 015-5.93V3h2v2.07A6.002 6.002 0 0116 9h2v2h-2a6.002 6.002 0 01-5 5.93z"/></svg>
            </span>
            <span className="font-bold text-base text-green-100 drop-shadow">Resources Cart</span>
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow border-2 border-white/20">${totalResources.toFixed(0)}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {resources.map((res) => (
              <div key={res.id} className="bg-black/40 rounded-lg shadow-lg p-6 flex flex-col items-center gap-4 hover:bg-black/60 transition-transform hover:scale-105 backdrop-blur-md text-white">
                <Image src="/rss.png" alt="Resource" width={80} height={80} className="w-20 h-20 object-contain" />
                <div className="text-xl font-semibold">{res.name}</div>
                <div className="text-blue-400 font-bold">{res.resourceAmount || res.resourceType}</div>
                <div className="text-gray-400 text-sm text-center">{res.description}</div>
                <div className="text-green-400 font-bold text-lg">${typeof res.price === 'number' ? res.price.toFixed(2) : parseFloat(res.price).toFixed(2)}</div>
                <button
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  onClick={() => {
                    if (!user) {
                      toast.error('You must be logged in to add items to the cart.');
                      return;
                    }
                    addToCart(res.id, 1);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} category="RESOURCES" />
    </div>
  );
} 