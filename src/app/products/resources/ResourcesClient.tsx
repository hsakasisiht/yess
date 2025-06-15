"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import CartModal from '../../../components/CartModal';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { useCurrency } from '../../../context/CurrencyContext';

function KingdomModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (kingdom: string) => void }) {
  const [kingdom, setKingdom] = useState('');
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      <div className="bg-black/70 text-white p-8 rounded-xl min-w-[320px] max-w-[400px] w-full backdrop-blur-xl">
        <h2 className="text-2xl mb-4 font-bold">Enter Your Kingdom Number</h2>
        <input
          type="number"
          min={1}
          max={999}
          value={kingdom}
          onChange={e => setKingdom(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full p-3 rounded-lg bg-white/10 border border-green-500/30 text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/40 shadow transition-all text-center mb-4"
          placeholder="Kingdom Number"
        />
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg"
          onClick={() => { if (kingdom) { onSave(kingdom); onClose(); } }}
          disabled={!kingdom}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default function ResourcesClient() {
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [resources, setResources] = useState<unknown[]>([]);
  const [resourceQty, setResourceQty] = useState<{ [id: string]: number }>({});
  const totalResources = cart.filter(i => i.category === 'RESOURCES').reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [kingdomModalOpen, setKingdomModalOpen] = useState(false);
  const [kingdomNumber, setKingdomNumber] = useState<string | null>(null);
  const { currency, convert, currencySymbol } = useCurrency();

  // Fetch resources on mount
  useEffect(() => {
    fetch('/api/products/resources')
      .then(res => res.json())
      .then(data => setResources(data));
    const savedKingdom = localStorage.getItem('kingdomNumber');
    if (savedKingdom) setKingdomNumber(savedKingdom);
  }, []);

  // Description fallback map for resources
  const descriptionMap: { [name: string]: string } = {
    'Full Bank (4B EACH TYPE)': '4B of each resource type.',
    'Half Bank (2B EACH TYPE)': '2B of each resource type.',
    'Full Bank NO GOLD (4B EACH BUT NO GOLD)': '4B of each resource type except gold.',
    'Half Bank (2B EACH BUT NO GOLD)': '2B of each resource type except gold.',
    '11111 (1B EACH TYPE RESOURCES)': '1B of each resource type.',
    '11110 (1B EACH TYPE BUT NO GOLD)': '1B of each resource type except gold.',
  };

  // Dynamic pricing map by kingdom range and resource type
  function getResourcePrice(resourceName: string, kingdomNumber: string | null): number | null {
    if (!kingdomNumber) return null;
    const k = parseInt(kingdomNumber, 10);
    if (isNaN(k)) return null;
    // Map resource names to codes (normalize to uppercase)
    const codeMap: { [name: string]: string } = {
      'FULL BANK (4B EACH TYPE)': '44444',
      'FULL BANK NO GOLD (4B EACH BUT NO GOLD)': '44440',
      'HALF BANK (2B EACH TYPE)': '22222',
      'HALF BANK (2B EACH BUT NO GOLD)': '22220',
      '11111 (1B EACH TYPE RESOURCES)': '11111',
      '11110 (1B EACH TYPE BUT NO GOLD)': '11110',
    };
    const code = codeMap[resourceName.toUpperCase()];
    if (!code) return null;
    // Price tables
    const priceTable: { [range: string]: { [code: string]: number } } = {
      '1-1685': {
        '44444': 3,
        '44440': 2.2,
        '22222': 2.3,
        '22220': 1.5,
        '11111': 1.5,
        '11110': 1.2,
      },
      '1686-1739': {
        '44444': 4,
        '44440': 2.5,
        '22222': 2.4,
        '22220': 2,
        '11111': 2,
        '11110': 1.5,
      },
      '1740-1769': {
        '44444': 5,
        '44440': 3.5,
        '22222': 3,
        '22220': 2.4,
        '11111': 2.5,
        '11110': 2,
      },
      '1770-1780': {
        '44444': 6,
        '44440': 4.4,
        '22222': 3.5,
        '22220': 2.4,
        '11111': 2.5,
        '11110': 2,
      },
    };
    let range: string | null = null;
    if (k >= 1 && k <= 1685) range = '1-1685';
    else if (k >= 1686 && k <= 1739) range = '1686-1739';
    else if (k >= 1740 && k <= 1769) range = '1740-1769';
    else if (k >= 1770 && k <= 1780) range = '1770-1780';
    if (!range) return null;
    return priceTable[range][code] || null;
  }

  // Calculate total resources price using locked-in cart item price
  const resourcesCartTotal = cart.filter(i => i.category === 'RESOURCES').reduce((sum, item) => {
    const price = item.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

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
    if (!kingdomNumber) {
      setKingdomModalOpen(true);
      return;
    }
    console.log('Adding resource:', resource.name, 'Kingdom:', kingdomNumber, 'Price:', getResourcePrice(resource.name, kingdomNumber));
    addToCart(
      resource.id,
      1,
      {
        mode: 'add',
        kingdomNumber,
        price: getResourcePrice(resource.name, kingdomNumber) ?? resource.price,
      }
    );
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-8 animate-fade-in mt-20 sm:mt-0">
      <Toaster position="top-center" reverseOrder={false} />
      <KingdomModal
        open={kingdomModalOpen}
        onClose={() => setKingdomModalOpen(false)}
        onSave={(kingdom) => {
          setKingdomNumber(kingdom);
          localStorage.setItem('kingdomNumber', kingdom);
        }}
      />
      <div className="w-full mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-left flex items-center gap-3">
          Resources
        </h1>
        {/* Mobile: row of buttons below title, spaced between */}
        <div className="flex flex-row justify-between items-center w-full mt-3 sm:hidden">
          <button
            className="px-3 py-1 rounded bg-[#222] text-green-400 font-mono text-base border border-green-700 hover:bg-[#333] transition"
            onClick={() => setKingdomModalOpen(true)}
            title={kingdomNumber ? `Current: Kingdom ${kingdomNumber}` : 'Set Kingdom Number'}
          >
            {kingdomNumber ? `Kingdom ${kingdomNumber}` : 'Set Kingdom'}
          </button>
          <div className="cart-btn resources ml-2" onClick={() => setCartOpen(true)} title="View Cart">
            <span className="cart-icon">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78z"/></svg>
            </span>
            <span>Resources Cart</span>
            <span className="cart-badge">{currencySymbol}{convert(resourcesCartTotal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
        </div>
        {/* Desktop: keep previous layout */}
        <div className="hidden sm:flex flex-row items-center gap-4 w-full sm:w-auto mt-0">
          <button
            className="ml-0 sm:ml-2 px-3 py-1 rounded bg-[#222] text-green-400 font-mono text-base border border-green-700 hover:bg-[#333] transition w-full sm:w-auto"
            onClick={() => setKingdomModalOpen(true)}
            title={kingdomNumber ? `Current: Kingdom ${kingdomNumber}` : 'Set Kingdom Number'}
          >
            {kingdomNumber ? `Kingdom ${kingdomNumber}` : 'Set Kingdom'}
          </button>
          <div className="cart-btn resources w-full sm:w-auto justify-center sm:justify-start" onClick={() => setCartOpen(true)} title="View Cart">
            <span className="cart-icon">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78z"/></svg>
            </span>
            <span>Resources Cart</span>
            <span className="cart-badge">{currencySymbol}{convert(resourcesCartTotal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
        </div>
      </div>
      {/* Grid: 2 col on mobile, 3+ on md+ */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
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
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-1"
              />
            )}
            <div className="text-sm sm:text-xs md:text-sm font-semibold text-center truncate w-full">{resource.name}</div>
            {/* Description below name */}
            <div className="text-xs text-gray-300 text-center w-full min-h-[18px]">
              {resource.description || descriptionMap[resource.name] || ''}
            </div>
            <div className="text-green-400 font-bold text-sm sm:text-xs md:text-sm">
              {currencySymbol}{convert(getResourcePrice(resource.name, kingdomNumber) ?? resource.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <button
              className="mt-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-base sm:text-xs md:text-sm transition w-full"
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