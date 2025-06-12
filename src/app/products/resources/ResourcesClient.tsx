"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import CartModal from '../../../components/CartModal';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function ResourcesClient() {
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [resources, setResources] = useState<unknown[]>([]);
  const [resourceQty, setResourceQty] = useState<{ [id: string]: number }>({});
  const totalResources = cart.filter(i => i.category === 'RESOURCES').reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fetch resources on mount
  useEffect(() => {
    fetch('/api/products/resources')
      .then(res => res.json())
      .then(data => setResources(data));
  }, []);

  // Description fallback map for resources
  const descriptionMap: { [name: string]: string } = {
    'FULL BANK (4B EACH TYPE)': '4B of each resource type.',
    'HALF BANK (2B EACH TYPE)': '2B of each resource type.',
    'FULL BANK NO GOLD (4B EACH BUT NO GOLD)': '4B of each resource type except gold.',
    'HALF BANK (2B EACH BUT NO GOLD)': '2B of each resource type except gold.',
    '11111 (1B EACH TYPE RESOURCES)': '1B of each resource type.',
    '11110 (1B EACH TYPE BUT NO GOLD)': '1B of each resource type except gold.',
  };

  const handleAddToCart = (resource: any) => {
    if (!user) {
      toast.custom((t) => (
        <div className="bg-red-900/90 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-xs w-full text-sm relative">
          <span>You must be logged in to add items to the cart.</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-auto px-2 py-1 text-xs bg-red-700 hover:bg-red-800 rounded transition"
          >
            Close
          </button>
        </div>
      ));
      return;
    }
    addToCart(resource.id, resourceQty[resource.id] || 1);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-8 animate-fade-in mt-20 sm:mt-0">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full mb-8 flex flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-left">Resources</h1>
        <div className="cart-btn resources" onClick={() => setCartOpen(true)} title="View Cart">
          <span className="cart-icon">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78z"/></svg>
          </span>
          <span>Resources Cart</span>
          <span className="cart-badge">${totalResources.toFixed(2)}</span>
        </div>
      </div>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
        {resources.map((resource: any) => (
          <div
            key={resource.id}
            className="bg-black/40 rounded-lg shadow-lg flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 gap-2 hover:bg-black/60 transition-transform hover:scale-105 backdrop-blur-md text-white"
          >
            {resource.imageUrl && (
              <Image
                src={resource.imageUrl}
                alt={resource.name}
                width={64}
                height={64}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-1"
              />
            )}
            <div className="text-xs sm:text-sm font-semibold text-center truncate w-full">{resource.name}</div>
            {/* Description below name */}
            <div className="text-xs text-gray-300 text-center w-full min-h-[18px]">
              {resource.description || descriptionMap[resource.name] || ''}
            </div>
            <div className="text-green-400 font-bold text-xs sm:text-sm">${resource.price}</div>
            <button
              className="mt-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs sm:text-sm transition w-full"
              onClick={() => handleAddToCart(resource)}
            >
              Add
            </button>
          </div>
        ))}
      </div>
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} category="RESOURCES" />
    </div>
  );
} 