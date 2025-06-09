"use client";
import React from "react";
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

export default function CartPage({
  title,
  filterCategory,
  showSummary = false,
  showPlaceOrder = false,
}: {
  title: string;
  filterCategory?: string;
  showSummary?: boolean;
  showPlaceOrder?: boolean;
}) {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const items = filterCategory ? cart.filter(i => i.category === filterCategory) : cart;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalGems = items.filter(i => i.category === 'GEMS').reduce((sum, i) => sum + (i.gemCost || 0) * i.quantity, 0);
  const isCheckout = showSummary;
  const gemsBelowMin = isCheckout && totalGems > 0 && totalGems < 100000;

  // Calculate subtotal for gems using pricePer100k
  const gemsSubtotal = items
    .filter(i => i.category === 'GEMS')
    .reduce((sum, item) => {
      if (item.pricePer100k && item.gemCost) {
        return sum + ((item.gemCost * item.quantity) / 100000) * item.pricePer100k;
      }
      return sum;
    }, 0);

  const getGemsDollarPrice = (item: unknown) => {
    if (!item || typeof item !== 'object') return null;
    const i = item as { gemCost?: number; pricePer100k?: number; category?: string; quantity?: number };
    if (i.category === 'GEMS' && i.pricePer100k && i.gemCost && i.quantity) {
      return `$${(((i.gemCost * i.quantity) / 100000) * i.pricePer100k).toFixed(2)}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center p-4 sm:p-8 animate-fade-in relative">
      {showSummary && (
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10"
          onClick={() => window.history.back()}
          aria-label="Close"
        >
          &times;
        </button>
      )}
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
      <div className="w-full max-w-2xl">
        {loading ? (
          <div className="flex justify-center items-center py-12"><span className="loader" /></div>
        ) : gemsBelowMin && (
          <div className="mb-4 p-3 bg-red-900 text-red-300 rounded text-center font-semibold">
            Minimum purchase is 100,000 gems.
          </div>
        )}
        <AnimatePresence>
          {items.length === 0 && !loading ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-gray-400 text-center py-12"
            >
              Your cart is empty.
            </motion.div>
          ) : (
            items.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="bg-[#171717] rounded-lg shadow-lg p-4 mb-4 hover:bg-[#222] transition-transform flex flex-col sm:flex-row gap-2"
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
                          {(item.gemCost || 0) * item.quantity} Gems
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
                        <>${(item.price * item.quantity).toFixed(2)}</>
                      )}
                    </div>
                  </div>
                </div>
                {/* Controls for mobile: bottom right */}
                <div className="flex justify-end items-center gap-1 mt-2 sm:hidden w-full">
                  <button onClick={async () => await updateQuantity(item.id, item.quantity - 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded" disabled={loading || item.quantity <= 1}>-</button>
                  <span className="px-2 text-white">{item.quantity}</span>
                  <button onClick={async () => await updateQuantity(item.id, item.quantity + 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded" disabled={loading}>+</button>
                  <button onClick={async () => await removeFromCart(item.id)} className="text-red-400 hover:text-red-600 ml-2" disabled={loading}>
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
                  <button onClick={async () => await updateQuantity(item.id, item.quantity - 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded" disabled={loading || item.quantity <= 1}>-</button>
                  <span className="px-2 text-white">{item.quantity}</span>
                  <button onClick={async () => await updateQuantity(item.id, item.quantity + 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#333] text-white rounded" disabled={loading}>+</button>
                  <button onClick={async () => await removeFromCart(item.id)} className="ml-1 text-red-400 hover:text-red-600" disabled={loading}>
                    <span className="block lg:hidden" aria-label="Remove">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5V19a2 2 0 002 2h8a2 2 0 002-2V7.5M4 7.5h16M9.5 7.5V5a2 2 0 012-2h1a2 2 0 012 2v2.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
                      </svg>
                    </span>
                    <span className="hidden lg:block">Remove</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {items.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right text-lg font-bold text-blue-400 mt-4"
          >
            Subtotal: {items.some(i => i.category === 'GEMS')
              ? `$${gemsSubtotal.toFixed(2)} (${items.filter(i => i.category === 'GEMS').reduce((sum, i) => sum + (i.gemCost || 0) * i.quantity, 0)} Gems)`
              : `$${subtotal.toFixed(2)}`}
          </motion.div>
        )}
        {showSummary && items.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-[#181c24] rounded-lg p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>
            <div className="flex flex-col gap-2 text-white">
              {cart.length > 0 && (
                <>
                  <div className="flex justify-between"><span>Gems:</span><span>${gemsSubtotal.toFixed(2)} ({cart.filter(i => i.category === 'GEMS').reduce((sum, i) => sum + (i.gemCost || 0) * i.quantity, 0)} Gems)</span></div>
                  <div className="flex justify-between"><span>Resources:</span><span>${cart.filter(i => i.category === 'RESOURCES').reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-blue-400 mt-2"><span>Total:</span><span>${(gemsSubtotal + cart.filter(i => i.category === 'RESOURCES').reduce((sum, i) => sum + i.price * i.quantity, 0)).toFixed(2)}</span></div>
                </>
              )}
            </div>
            {showPlaceOrder && (
              <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={gemsBelowMin}>Place Order</button>
            )}
          </motion.div>
        )}
        {items.length > 0 && filterCategory === 'GEMS' && !loading && (
          <button
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => window.location.href = '/cart/checkout'}
          >
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
} 