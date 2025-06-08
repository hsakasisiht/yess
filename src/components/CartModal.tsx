"use client";
import React, { useRef, useEffect, useState } from "react";
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function getNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return Number(val) || 0;
  if (val && typeof val === 'object' && 'toNumber' in val && typeof (val as { toNumber: unknown }).toNumber === 'function') {
    return (val as { toNumber: () => number }).toNumber();
  }
  return 0;
}

export default function CartModal({ open, onClose, category }: { open: boolean; onClose: () => void; category?: string }) {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  console.log('CartModal cart:', cart);
  const items = category ? cart.filter(i => i.category === category) : cart;
  const total = items.reduce((sum, item) => sum + ((getNumber(item.gemCost) || getNumber(item.price)) * item.quantity), 0);
  const router = useRouter();
  const [showScrollLine, setShowScrollLine] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const handleScroll = () => {
      if (!scrollRef.current) return;
      setShowScrollLine(scrollRef.current.scrollTop < 5);
    };
    const node = scrollRef.current;
    node.addEventListener('scroll', handleScroll);
    return () => node.removeEventListener('scroll', handleScroll);
  }, [open]);

  // Calculate total for gems using pricePer100k
  const gemsTotal = items
    .filter(i => i.category === 'GEMS')
    .reduce((sum, item) => {
      const gemCost = getNumber(item.gemCost);
      const pricePer100k = getNumber(item.pricePer100k);
      if (pricePer100k && gemCost) {
        return sum + ((gemCost * item.quantity) / 100000) * pricePer100k;
      }
      return sum;
    }, 0);

  const getGemsDollarPrice = (item: unknown) => {
    if (!item || typeof item !== 'object') return null;
    const i = item as { gemCost?: unknown; pricePer100k?: unknown; category?: string; quantity?: number };
    const gemCost = getNumber(i.gemCost);
    const pricePer100k = getNumber(i.pricePer100k);
    if (i.category === 'GEMS' && pricePer100k && gemCost && i.quantity) {
      return `$${(((gemCost * i.quantity) / 100000) * pricePer100k).toFixed(2)}`;
    }
    return null;
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in">
      <div className="bg-[#171717] border border-[#333] rounded-xl shadow-2xl shadow-blue-900/40 p-6 w-full max-w-lg sm:max-w-md max-h-[90vh] relative animate-fade-in-up flex flex-col overflow-x-hidden transition-all duration-300 scale-95 opacity-0 animate-cart-modal-in" style={{ minHeight: 400, scrollbarColor: 'transparent transparent', scrollbarWidth: 'thin' }}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-white">Your Cart</h2>
        {/* Optionally show which cart this is */}
        {category === 'GEMS' && <div className="text-blue-400 font-semibold mb-2">Gems Cart</div>}
        {category === 'RESOURCES' && <div className="text-green-400 font-semibold mb-2">Resources Cart</div>}
        {category === 'GEMS' && items.length > 0 && showScrollLine && (
          <div className="w-full h-1 mb-2 rounded-full bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 opacity-80 shadow-lg animate-pulse transition-opacity duration-500" />
        )}
        {loading ? (
          <div className="flex justify-center items-center py-8"><span className="loader" /></div>
        ) : items.length === 0 ? (
          <div className="text-gray-400 text-center">Your cart is empty.</div>
        ) : (
          <div ref={scrollRef} className="flex flex-col gap-4 flex-1">
            {items.map(item => (
              item.category === 'GEMS' ? (
                <div
                  key={item.id}
                  className={
                    item.category === 'GEMS' || item.category === 'RESOURCES'
                      ? "bg-[#2c2c2c] rounded-lg shadow-lg p-4 hover:bg-[#23272f] transition-transform flex flex-col sm:flex-row gap-2 group border border-transparent hover:border-blue-500"
                      : "flex items-center gap-3 bg-[#222] rounded p-2 min-w-0"
                  }
                  style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)' }}
                >
                  <div className="flex flex-row sm:flex-row w-full">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.name} width={56} height={56} className="w-14 h-14 object-contain rounded flex-shrink-0" />
                    )}
                    <div className="flex flex-col justify-center flex-1 min-w-0 pl-3">
                      <div className="font-semibold text-white text-base break-words whitespace-normal">{item.name}</div>
                      <div className="text-blue-400 text-sm">
                        {item.category === 'GEMS' ? (
                          <>
                            {getNumber(item.gemCost) * item.quantity} Gems
                            {item.pricePer100k && item.gemCost && (
                              <> ({getGemsDollarPrice(item)})</>
                            )}
                            {item.mightRange && (
                              <span className="ml-2 text-xs text-green-400">
                                ({item.mightRange.replace('-', ' - ')}m)
                              </span>
                            )}
                          </>
                        ) : (
                          <>${getNumber(item.price).toFixed(2)}</>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Controls for mobile: bottom right */}
                  <div className="flex justify-end items-center gap-1 mt-2 sm:hidden w-full">
                    <button onClick={async () => await updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading || item.quantity <= 1}>-</button>
                    <span className="px-2 text-white">{item.quantity}</span>
                    <button onClick={async () => await updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading}>+</button>
                    <button onClick={async () => await removeFromCart(item.id)} className="text-red-400 hover:text-red-600 ml-2 group-hover:text-blue-500" disabled={loading}>
                      <span aria-label="Remove">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5V19a2 2 0 002 2h8a2 2 0 002-2V7.5M4 7.5h16M9.5 7.5V5a2 2 0 012-2h1a2 2 0 012 2v2.5" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
                        </svg>
                      </span>
                    </button>
                  </div>
                  {/* Controls for desktop: right side */}
                  <div className="hidden sm:flex items-center gap-1">
                    <button onClick={async () => await updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading || item.quantity <= 1}>-</button>
                    <span className="px-2 text-white">{item.quantity}</span>
                    <button onClick={async () => await updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading}>+</button>
                    <button onClick={async () => await removeFromCart(item.id)} className="ml-1 text-red-400 hover:text-red-600 group-hover:text-blue-500" disabled={loading}>
                      <span className="block lg:hidden" aria-label="Remove">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5V19a2 2 0 002 2h8a2 2 0 002-2V7.5M4 7.5h16M9.5 7.5V5a2 2 0 012-2h1a2 2 0 012 2v2.5" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
                        </svg>
                      </span>
                      <span className="hidden lg:block">Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className={
                    item.category === 'GEMS' || item.category === 'RESOURCES'
                      ? "bg-[#2c2c2c] rounded-lg shadow-lg p-4 hover:bg-[#23272f] transition-transform flex flex-col sm:flex-row gap-2 group border border-transparent hover:border-blue-500"
                      : "flex items-center gap-3 bg-[#222] rounded p-2 min-w-0"
                  }
                  style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)' }}
                >
                  <div className="flex flex-row sm:flex-row w-full">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.name} width={56} height={56} className="w-14 h-14 object-contain rounded flex-shrink-0" />
                    )}
                    <div className="flex flex-col justify-center flex-1 min-w-0 pl-3">
                      <div className="font-semibold text-white text-base break-words whitespace-normal">{item.name}</div>
                      <div className="text-blue-400 text-sm">
                        {item.category === 'GEMS' ? (
                          <>
                            {getNumber(item.gemCost) * item.quantity} Gems
                            {item.pricePer100k && item.gemCost && (
                              <> ({getGemsDollarPrice(item)})</>
                            )}
                            {item.mightRange && (
                              <span className="ml-2 text-xs text-green-400">
                                ({item.mightRange.replace('-', ' - ')}m)
                              </span>
                            )}
                          </>
                        ) : (
                          <>${getNumber(item.price).toFixed(2)}</>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Controls for mobile: bottom right */}
                  <div className="flex justify-end items-center gap-1 mt-2 sm:hidden w-full">
                    <button onClick={async () => await updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading || item.quantity <= 1}>-</button>
                    <span className="px-2 text-white">{item.quantity}</span>
                    <button onClick={async () => await updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading}>+</button>
                    <button onClick={async () => await removeFromCart(item.id)} className="text-red-400 hover:text-red-600 group-hover:text-blue-500" disabled={loading}>
                      <span aria-label="Remove">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5V19a2 2 0 002 2h8a2 2 0 002-2V7.5M4 7.5h16M9.5 7.5V5a2 2 0 012-2h1a2 2 0 012 2v2.5" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
                        </svg>
                      </span>
                    </button>
                  </div>
                  {/* Controls for desktop: right side */}
                  <div className="hidden sm:flex items-center gap-1">
                    <button onClick={async () => await updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading || item.quantity <= 1}>-</button>
                    <span className="px-2 text-white">{item.quantity}</span>
                    <button onClick={async () => await updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading}>+</button>
                    <button onClick={async () => await removeFromCart(item.id)} className="ml-1 text-red-400 hover:text-red-600 group-hover:text-blue-500" disabled={loading}>
                      <span className="block lg:hidden" aria-label="Remove">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5V19a2 2 0 002 2h8a2 2 0 002-2V7.5M4 7.5h16M9.5 7.5V5a2 2 0 012-2h1a2 2 0 012 2v2.5" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
                        </svg>
                      </span>
                      <span className="hidden lg:block">Remove</span>
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
        {/* Total and button always at the bottom */}
        {items.length > 0 && !loading && (
          <div className="mt-4">
            <div className="text-right text-lg font-bold text-blue-400 mb-2">
              Total: {category === 'GEMS' || items.some(i => i.category === 'GEMS')
                ? `$${gemsTotal.toFixed(2)} (${items.reduce((sum, i) => sum + getNumber(i.gemCost) * i.quantity, 0)} Gems)`
                : `$${total.toFixed(2)}`}
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg"
              onClick={() => router.push('/cart/checkout')}
              disabled={loading}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      <style jsx global>{`
      @keyframes cart-modal-in {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }
      .animate-cart-modal-in {
        animation: cart-modal-in 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
      }
      `}</style>
    </div>
  );
} 