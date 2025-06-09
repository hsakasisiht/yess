"use client";
import React from "react";
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [placingOrder, setPlacingOrder] = React.useState(false);
  const [orderError, setOrderError] = React.useState("");
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

  const handlePlaceOrder = async () => {
    router.push("/payment");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] p-4 animate-fade-in relative">
      {showSummary && (
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10"
          onClick={() => window.history.back()}
          aria-label="Close"
        >
          &times;
        </button>
      )}
      <div className="w-full max-w-3xl bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col gap-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white text-center drop-shadow-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">{title}</h1>
        {loading ? (
          <div className="flex justify-center items-center py-12"><span className="loader" /></div>
        ) : gemsBelowMin && (
          <div className="mb-4 p-3 bg-red-900 text-red-300 rounded text-center font-semibold">
            Minimum purchase is 100,000 gems.
          </div>
        )}
        {/* Cart Items List */}
        <div className="flex flex-col gap-4">
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
                  className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col sm:flex-row gap-4 items-center hover:bg-white/20 transition-transform hover:scale-[1.01] border border-white/10"
                >
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt={item.name} width={56} height={56} className="w-14 h-14 object-contain rounded bg-black/20 border border-white/10" />
                  )}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="font-bold text-white text-lg truncate">{item.name}</div>
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
                  <div className="flex items-center gap-2">
                    <button onClick={async () => await updateQuantity(item.id, item.quantity - 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#23272f] text-white rounded hover:bg-blue-700 transition" disabled={loading || item.quantity <= 1}>-</button>
                    <span className="px-3 text-white font-bold text-lg">{item.quantity}</span>
                    <button onClick={async () => await updateQuantity(item.id, item.quantity + 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#23272f] text-white rounded hover:bg-blue-700 transition" disabled={loading}>+</button>
                    <button onClick={async () => await removeFromCart(item.id)} className="ml-2 text-red-400 hover:text-red-600 transition" disabled={loading} title="Remove">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5V19a2 2 0 002 2h8a2 2 0 002-2V7.5M4 7.5h16M9.5 7.5V5a2 2 0 012-2h1a2 2 0 012 2v2.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        {/* Order Summary */}
        {showSummary && items.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-transparent rounded-2xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-white text-center">Order Summary</h2>
            <div className="flex flex-col gap-3 text-white text-lg">
              {cart.length > 0 && (
                <>
                  <div className="flex justify-between"><span>Gems:</span><span>${gemsSubtotal.toFixed(2)} ({cart.filter(i => i.category === 'GEMS').reduce((sum, i) => sum + (i.gemCost || 0) * i.quantity, 0)} Gems)</span></div>
                  <div className="flex justify-between"><span>Resources:</span><span>${cart.filter(i => i.category === 'RESOURCES').reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-blue-400 mt-2 text-xl"><span>Total:</span><span>${(gemsSubtotal + cart.filter(i => i.category === 'RESOURCES').reduce((sum, i) => sum + i.price * i.quantity, 0)).toFixed(2)}</span></div>
                </>
              )}
            </div>
            {showPlaceOrder && (
              <>
                {orderError && <div className="text-red-400 text-sm mb-2 text-center font-semibold bg-red-900/30 rounded py-2 px-3 animate-fade-in">{orderError}</div>}
                <button
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl text-xl shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={gemsBelowMin || placingOrder}
                  onClick={handlePlaceOrder}
                >
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
} 