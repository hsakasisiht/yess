"use client";
import { useCart } from '../../../context/CartContext';
import CartModal from '../../../components/CartModal';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ResourcesPage() {
  const { addToCart, cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [resources, setResources] = useState<unknown[]>([]);
  const totalResources = cart.filter(i => i.category === 'RESOURCES').reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    fetch('/api/products/resources')
      .then(res => res.json())
      .then(data => setResources(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 animate-fade-in mt-16 sm:mt-0">
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">Resources</h1>
        <div className="flex items-center">
          <div
            className="bg-[#222] rounded-full px-5 py-2 text-white font-bold text-lg flex items-center gap-2 shadow cursor-pointer hover:bg-[#333] transition"
            onClick={() => setCartOpen(true)}
            title="View Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25A3.75 3.75 0 0011.25 18h1.5a3.75 3.75 0 003.75-3.75m-9-9h12.216c.977 0 1.651.97 1.337 1.91l-1.43 4.287a2.25 2.25 0 01-2.143 1.553H6.684m10.566 0l-.348 1.045c-.285.855-1.085 1.455-1.987 1.455H8.25m-2.25-6.75l1.5 6.75m0 0l.75 3.375m0 0h6m-6 0a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75z" /></svg>
            ${totalResources.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {resources.map((res) => (
              <div key={res.id} className="bg-[#171717] rounded-lg shadow-lg p-6 flex flex-col items-center gap-4 hover:bg-[#222] transition-transform hover:scale-105">
                <Image src="/rss.png" alt="Resource" width={80} height={80} className="w-20 h-20 object-contain" />
                <div className="text-xl font-semibold">{res.name}</div>
                <div className="text-blue-400 font-bold">{res.resourceAmount || res.resourceType}</div>
                <div className="text-gray-400 text-sm text-center">{res.description}</div>
                <div className="text-green-400 font-bold text-lg">${typeof res.price === 'number' ? res.price.toFixed(2) : parseFloat(res.price).toFixed(2)}</div>
                <button
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  onClick={() => addToCart(res.id, 1)}
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