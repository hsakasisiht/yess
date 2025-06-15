"use client";
import React, { useRef, useEffect, useState } from "react";
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCurrency } from '../context/CurrencyContext';

function getNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return Number(val) || 0;
  if (val && typeof val === 'object' && 'toNumber' in val && typeof (val as { toNumber: unknown }).toNumber === 'function') {
    return (val as { toNumber: () => number }).toNumber();
  }
  return 0;
}

function getResourcePrice(resourceName: string, kingdomNumber: string | null): number | null {
  if (!kingdomNumber) return null;
  const k = parseInt(kingdomNumber, 10);
  if (isNaN(k)) return null;
  const codeMap: { [name: string]: string } = {
    'FULL BANK (4B EACH TYPE)': '44444',
    'FULL BANK NO GOLD (4B EACH BUT NO GOLD)': '44440',
    'HALF BANK (2B EACH TYPE)': '22222',
    'HALF BANK (2B EACH BUT NO GOLD)': '22220',
    '11111 (1B EACH TYPE RESOURCES)': '11111',
    '11110 (1B EACH TYPE BUT NO GOLD)': '11110',
  };
  const code = codeMap[resourceName];
  if (!code) return null;
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

export default function CartModal({ open, onClose, category }: { open: boolean; onClose: () => void; category?: string }) {
  const { cart, updateQuantity, removeFromCart, loading, refetch } = useCart();
  const { currency, convert, currencySymbol } = useCurrency();
  console.log('CartModal cart:', cart);
  const items = category ? cart.filter(i => i.category === category) : cart;
  const total = items.reduce((sum, item) => sum + ((getNumber(item.gemCost) || getNumber(item.price)) * item.quantity), 0);
  const router = useRouter();
  const [showScrollLine, setShowScrollLine] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [kingdomNumber, setKingdomNumber] = useState<string | null>(null);

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

  useEffect(() => {
    setKingdomNumber(localStorage.getItem('kingdomNumber'));
  }, [open]);

  // Only call refetch when modal transitions from closed to open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (open && !prevOpen.current) {
      refetch();
    }
    prevOpen.current = open;
  }, [open, refetch]);

  // Calculate total for gems using pricePer100k
  const gemsTotal = items
    .filter(i => i.category === 'GEMS')
    .reduce((sum, item) => {
      if (item.pricePer100k && item.gemCost) {
        return sum + ((item.gemCost * item.quantity) / 100000) * item.pricePer100k;
      }
      return sum;
    }, 0);

  const getGemsDollarPrice = (item: unknown) => {
    if (!item || typeof item !== 'object') return null;
    const i = item as { gemCost?: unknown; pricePer100k?: unknown; category?: string; quantity?: number };
    const gemCost = getNumber(i.gemCost);
    const pricePer100k = getNumber(i.pricePer100k);
    if (i.category === 'GEMS' && pricePer100k && gemCost && i.quantity) {
      return `${currencySymbol}${convert(((gemCost * i.quantity) / 100000) * pricePer100k).toFixed(2)}`;
    }
    return null;
  };

  const resourcesTotal = items.filter(i => i.category === 'RESOURCES').reduce((sum, item) => {
    const price = item.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-black/70 border border-blue-900/40 backdrop-blur-xl rounded-xl shadow-2xl p-6 w-full max-w-lg sm:max-w-md max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-white">Your Cart</h2>
        {/* Optionally show which cart this is */}
        {category === 'GEMS' && <div className="text-blue-400 font-semibold mb-2">Gems Cart</div>}
        {category === 'RESOURCES' && <div className="text-green-400 font-semibold mb-2">Resources Cart</div>}
        {category === 'GEMS' && items.length > 0 && showScrollLine && (
          <div className="w-full h-1 mb-2 rounded-full bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 opacity-80 shadow-lg animate-pulse transition-opacity duration-500" />
        )}
        {items.length === 0 ? (
          <div className="text-gray-400 text-center">Your cart is empty.</div>
        ) : (
          <div ref={scrollRef} className="flex flex-col gap-4 flex-1 relative">
            {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10"><span className="loader" /></div>}
            {items.map(item => (
              item.category === 'GEMS' ? (
                <div
                  key={`${item.productId}-${item.mightRange || 'default'}`}
                  className="bg-white/10 rounded-lg shadow-lg p-4 hover:bg-white/20 transition-transform flex flex-col sm:flex-row gap-2 group border border-transparent hover:border-blue-500 backdrop-blur-md text-white"
                  style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)' }}
                >
                  <div className="flex flex-row sm:flex-row w-full">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.name} width={56} height={56} className="w-14 h-14 object-contain rounded flex-shrink-0" />
                    )}
                    <div className="flex flex-col justify-center flex-1 min-w-0 pl-3">
                      <div className="font-semibold text-white text-base break-words whitespace-normal">{item.name}</div>
                      <div className="text-blue-400 text-sm">
                        {item.gemCost * item.quantity} Gems
                        {item.pricePer100k && item.gemCost && (
                          <> ({getGemsDollarPrice(item)})</>
                        )}
                        {item.mightRangeLabel && (
                          <span className="ml-2 text-xs text-green-400">
                            ({item.mightRangeLabel})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Controls for mobile: bottom right */}
                  <div className="flex justify-end items-center gap-1 mt-2 sm:hidden w-full">
                    <button onClick={async () => await updateQuantity(item.id, item.quantity - 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading || item.quantity <= 1}>-</button>
                    <span className="px-2 text-white">{item.quantity}</span>
                    <button onClick={async () => await updateQuantity(item.id, item.quantity + 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading}>+</button>
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
                    <button onClick={async () => await updateQuantity(item.id, item.quantity - 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading || item.quantity <= 1}>-</button>
                    <span className="px-2 text-white">{item.quantity}</span>
                    <button onClick={async () => await updateQuantity(item.id, item.quantity + 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading}>+</button>
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
                  key={`${item.productId}-${item.kingdomNumber || 'default'}`}
                  className="bg-white/10 rounded-lg shadow-lg p-4 hover:bg-white/20 transition-transform flex flex-col sm:flex-row gap-2 group border border-transparent hover:border-blue-500 backdrop-blur-md text-white"
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
                          <>
                            {currencySymbol}{convert(item.price).toFixed(2)}
                            {item.kingdomNumber && (
                              <span className="ml-1 text-xs text-green-400">(Kingdom {item.kingdomNumber})</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Controls for mobile: bottom right */}
                  <div className="flex justify-end items-center gap-1 mt-2 sm:hidden w-full">
                    <button onClick={async () => await updateQuantity(item.id, item.quantity - 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading || item.quantity <= 1}>-</button>
                    <span className="px-2 text-white">{item.quantity}</span>
                    <button onClick={async () => await updateQuantity(item.id, item.quantity + 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading}>+</button>
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
                    <button onClick={async () => await updateQuantity(item.id, item.quantity - 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading || item.quantity <= 1}>-</button>
                    <span className="px-2 text-white">{item.quantity}</span>
                    <button onClick={async () => await updateQuantity(item.id, item.quantity + 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded group-hover:bg-blue-700 transition" disabled={loading}>+</button>
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
        {items.length > 0 && (
          <div className="mt-4">
            <div className="text-right text-lg font-bold text-blue-400 mb-2">
              Total: {category === 'GEMS' || items.some(i => i.category === 'GEMS')
                ? `${currencySymbol}${convert(gemsTotal).toFixed(2)} (${items.reduce((sum, i) => sum + getNumber(i.gemCost) * i.quantity, 0)} Gems)`
                : `${currencySymbol}${convert(resourcesTotal).toFixed(2)}`}
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg"
              onClick={() => router.push('/cart/checkout')}
              disabled={loading}
            >
              {loading ? "Loading..." : "Proceed to Checkout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 