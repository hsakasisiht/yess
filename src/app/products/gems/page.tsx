"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import CartModal from '../../../components/CartModal';
import MightRangeModal from '../../../components/MightRangeModal';
import AddGemsModal from '../../../components/AddGemsModal';
import ResetMightModal from '../../../components/ResetMightModal';
import Image from 'next/image';

// Type for mightRange
interface MightRange {
  key: string;
  label: string;
  price: number;
}

// Define the might ranges and their prices
const MIGHT_RANGES = [
  { key: '0-399', label: '0-399m', price: 4.35 },
  { key: '400-799', label: '400m - 799m', price: 4.45 },
  { key: '800-1099', label: '800m - 1099m', price: 4.6 },
  { key: '1100-1499', label: '1100m - 1499m', price: 4.8 },
  { key: '1500-2399', label: '1500m - 2399m', price: 4.9 },
];

export default function GemsPage() {
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

  const handleAddToCart = (gem: any) => {
    if (!mightRange) {
      setPendingGem(gem);
    } else {
      setAddModalGem(gem);
      setAddModalOpen(true);
    }
  };

  const handleAddGems = (quantity: number) => {
    if (!addModalGem || !mightRange) return;
    // Pass mightRange, price per 100k, and gemCost to addToCart
    addToCart(addModalGem.id, quantity, {
      mightRange: mightRange.key,
      mightRangeLabel: mightRange.label,
      pricePer100k: mightRange.price,
      gemCost: addModalGem.gemCost,
    });
    setAddModalGem(null);
    setAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 w-full">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <h1 className="text-3xl font-bold text-left">Gems</h1>
        </div>
        {mightRange && (
          <div className="flex items-center">
            <button
              className="ml-2 px-3 py-1 rounded bg-[#222] text-blue-400 font-mono text-base border border-blue-700 hover:bg-[#333] transition"
              onClick={() => setResetModalOpen(true)}
              title="Change Might Range"
            >
              {mightRange.label}
            </button>
          </div>
        )}
        <div className="flex-1 flex justify-center items-center w-full sm:w-auto">
          <div
            className="bg-[#222] rounded-full px-5 py-2 text-white font-bold text-lg flex items-center gap-2 shadow cursor-pointer hover:bg-[#333] transition"
            onClick={() => setCartOpen(true)}
            title="View Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25A3.75 3.75 0 0011.25 18h1.5a3.75 3.75 0 003.75-3.75m-9-9h12.216c.977 0 1.651.97 1.337 1.91l-1.43 4.287a2.25 2.25 0 01-2.143 1.553H6.684m10.566 0l-.348 1.045c-.285.855-1.085 1.455-1.987 1.455H8.25m-2.25-6.75l1.5 6.75m0 0l.75 3.375m0 0h6m-6 0a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75z" /></svg>
            {totalGems} Gems
          </div>
        </div>
        <input
          type="text"
          placeholder="Search gems..."
          className="w-full sm:w-72 p-3 rounded bg-[#171717] text-white border border-[#333] focus:outline-none focus:border-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10 gap-4 lg:gap-6 xl:gap-8">
        {filteredGems.map((gem) => (
          <div
            key={gem.id}
            className="bg-[#171717] rounded-lg shadow-lg flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 gap-2 hover:bg-[#222] transition-transform hover:scale-105"
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
            });
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