"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import CartModal from '../../../components/CartModal';
import MightRangeModal from '../../../components/MightRangeModal';
import AddGemsModal from '../../../components/AddGemsModal';
import ResetMightModal from '../../../components/ResetMightModal';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

// Type for mightRange
interface MightRange {
  key: string;
  label: string;
  price: number;
}

export default function GemsClient() {
  const [gems, setGems] = useState<Array<{
    id: string;
    name: string;
    imageUrl?: string;
    gemCost: number;
  }>>([]);
  const [search, setSearch] = useState("");
  const { addToCart, cart } = useCart();
  const totalGems = cart.reduce((sum, item) => sum + (item.gemCost || 0) * item.quantity, 0);
  const [cartOpen, setCartOpen] = useState(false);
  const [mightRange, setMightRange] = useState<MightRange | null>(null);
  const [pendingGem, setPendingGem] = useState<{ id: string; name: string; imageUrl?: string; gemCost: number } | null>(null);
  const [addModalGem, setAddModalGem] = useState<{ id: string; name: string; imageUrl?: string; gemCost: number } | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetch('/api/products/gems')
      .then(res => res.json())
      .then(data => setGems(data));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('mightRange');
    if (saved) {
      setMightRange(JSON.parse(saved));
    }
  }, []);

  const filteredGems = gems.filter(gem =>
    gem.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (gem: unknown) => {
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
    if (!mightRange) {
      setPendingGem(gem as any);
    } else {
      setAddModalGem(gem as any);
      setAddModalOpen(true);
    }
  };

  const handleAddGems = (quantity: number) => {
    if (!addModalGem || !mightRange) return;
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
    // Calculate locked-in price for this gem and might range
    // price = (gem.gemCost * quantity / 100000) * mightRange.price
    // But for cart item, store pricePer100k and gemCost, and use them in cart display
    addToCart(addModalGem.id, quantity, {
      mightRange: mightRange.key,
      mightRangeLabel: mightRange.label,
      pricePer100k: mightRange.price,
      gemCost: addModalGem.gemCost,
      mode: 'add',
      price: ((addModalGem.gemCost * 1) / 100000) * mightRange.price, // locked-in price for 1 unit (will be multiplied by quantity in cart)
    } as any);
    setAddModalGem(null);
    setAddModalOpen(false);
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-8 animate-fade-in">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Responsive Top Bar */}
      <div className="w-full mb-8">
        {/* Desktop layout */}
        <div className="hidden md:flex flex-row items-center justify-between gap-4 w-full">
          {/* Left: Gems title + Might Range */}
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-left">Gems</h1>
            {mightRange && (
              <button
                className="px-4 py-2 rounded bg-[#222] text-blue-400 font-mono text-base border border-blue-700 hover:bg-[#333] transition"
                onClick={() => setResetModalOpen(true)}
                title="Change Might Range"
              >
                {mightRange.label}
              </button>
            )}
          </div>
          {/* Center: Gems Cart */}
          <div className="flex-1 flex justify-center items-center">
            <div
              className="cart-btn gems"
              onClick={() => setCartOpen(true)}
              title="View Cart"
            >
              <span className="cart-icon">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78z"/></svg>
              </span>
              <span>Gems Cart</span>
              <span className="cart-badge">{totalGems}</span>
            </div>
          </div>
          {/* Right: Search bar */}
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search gems..."
              className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-md border border-blue-500/30 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 shadow transition-all pl-10 relative"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ position: 'relative' }}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            </span>
          </div>
        </div>
        {/* Mobile/Tablet layout (unchanged) */}
        <div className="flex flex-col gap-4 w-full md:hidden mt-15">
          <div className="flex flex-row items-center justify-between gap-4 w-full mt-4 md:mt-0">
            {/* Might Range Selector (left) */}
            <div className="flex items-center">
              {mightRange && (
                <button
                  className="px-4 py-2 rounded bg-[#222] text-blue-400 font-mono text-base border border-blue-700 hover:bg-[#333] transition"
                  onClick={() => setResetModalOpen(true)}
                  title="Change Might Range"
                >
                  {mightRange.label}
                </button>
              )}
            </div>
            {/* Gems Cart Button (right) for mobile */}
            <div className="flex-1 flex justify-end items-center">
              <div
                className="cart-btn gems"
                onClick={() => setCartOpen(true)}
                title="View Cart"
              >
                <span className="cart-icon">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78z"/></svg>
                </span>
                <span>Gems Cart</span>
                <span className="cart-badge">{totalGems}</span>
              </div>
            </div>
          </div>
          {/* Search Bar */}
          <div className="relative w-full mt-2">
            <input
              type="text"
              placeholder="Search gems..."
              className="w-full sm:w-72 p-3 rounded-lg bg-white/10 backdrop-blur-md border border-blue-500/30 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 shadow transition-all pl-10 relative"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ position: 'relative' }}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10 gap-4 lg:gap-6 xl:gap-8">
        {filteredGems.map((gem) => (
          <div
            key={gem.id}
            className="bg-black/40 rounded-lg shadow-lg flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 gap-2 hover:bg-black/60 transition-transform hover:scale-105 backdrop-blur-md text-white"
          >
            {gem.imageUrl && (
              <Image
                src={gem.imageUrl}
                alt={gem.name}
                width={64}
                height={64}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-1"
              />
            )}
            <div className="text-xs sm:text-sm font-semibold text-center truncate w-full">{gem.name}</div>
            <div className="text-blue-400 font-bold text-xs sm:text-sm">{gem.gemCost} Gems</div>
            <button
              className="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs sm:text-sm transition w-full"
              onClick={() => handleAddToCart(gem)}
            >
              Add
            </button>
          </div>
        ))}
      </div>
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} category="GEMS" />
      <MightRangeModal
        open={!!pendingGem}
        onClose={() => setPendingGem(null)}
        onSelect={range => {
          setMightRange({ key: range.key, label: range.label, price: range.price });
          localStorage.setItem('mightRange', JSON.stringify({ key: range.key, label: range.label, price: range.price }));
          if (pendingGem) {
            addToCart(pendingGem.id, 1, {
              mightRange: range.key,
              mightRangeLabel: range.label,
              pricePer100k: range.price,
              gemCost: pendingGem.gemCost,
              mode: 'add',
            } as any);
            setPendingGem(null);
          }
        }}
      />
      <AddGemsModal
        open={addModalOpen}
        onClose={() => { setAddModalOpen(false); setAddModalGem(null); }}
        onAdd={handleAddGems}
        gem={addModalGem}
      />
      <ResetMightModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onReset={() => {
          setMightRange(null);
          localStorage.removeItem('mightRange');
          setPendingGem(null); // force re-prompt
        }}
        mightLabel={mightRange?.label || ''}
      />
    </div>
  );
} 