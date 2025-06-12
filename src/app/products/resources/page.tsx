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
            className="cart-btn resources"
            onClick={() => setCartOpen(true)}
            title="View Cart"
          >
            <span className="cart-icon">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12.93V17h-2v-2.07A6.002 6.002 0 014 11H2v-2h2a6.002 6.002 0 015-5.93V3h2v2.07A6.002 6.002 0 0116 9h2v2h-2a6.002 6.002 0 01-5 5.93z"/></svg>
            </span>
            <span className="text-sm sm:text-base">Cart</span>
            <span className="cart-badge">${totalResources.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {resources.map((resource) => {
              const r = resource as any;
              return (
                <div key={r.id} className="bg-[#171717] rounded-lg shadow-lg p-3 flex flex-col items-center gap-4 w-full max-w-xs sm:max-w-none">
                  <img src={r.imageUrl} alt={r.name} className="w-12 h-12 sm:w-20 sm:h-20 object-contain" />
                  <span className="text-sm sm:text-xl font-semibold text-white text-center">{r.name}</span>
                  <span className="text-xs sm:text-base text-white/70 text-center">{r.description}</span>
                  <span className="text-xs sm:text-lg font-bold text-green-400">${Number(r.price).toFixed(2)}</span>
                  <button
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-base py-1 px-4 rounded transition"
                    onClick={() => {
                      if (!user) {
                        toast.error('You must be logged in to add items to the cart.');
                        return;
                      }
                      addToCart(r.id, 1, { mode: 'add' });
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} category="RESOURCES" />
    </div>
  );
} 