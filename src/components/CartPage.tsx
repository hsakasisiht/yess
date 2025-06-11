"use client";
import React from "react";
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

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
  const { cart, updateQuantity, removeFromCart, loading, refetch, clearCart } = useCart();
  const router = useRouter();
  const [placingOrder, setPlacingOrder] = React.useState(false);
  const [orderError, setOrderError] = React.useState("");
  const items = filterCategory ? cart.filter(i => i.category === filterCategory) : cart;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalGems = items.filter(i => i.category === 'GEMS').reduce((sum, i) => sum + (i.gemCost || 0) * i.quantity, 0);
  const isCheckout = showSummary;
  const gemsBelowMin = isCheckout && totalGems > 0 && totalGems < 100000;
  const { dbUser } = useAuth();

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
    setPlacingOrder(true);
    setOrderError("");
    try {
      const invoiceData = {
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          category: item.category,
          gemCost: item.gemCost,
          pricePer100k: item.pricePer100k,
          mightRange: item.mightRange,
          mightRangeLabel: item.mightRangeLabel,
          productId: item.productId,
        })),
        total: items.reduce((sum, item) => {
          if (item.category === 'GEMS' && item.pricePer100k && item.gemCost) {
            return sum + ((item.gemCost * item.quantity) / 100000) * item.pricePer100k;
          }
          return sum + (item.price * item.quantity);
        }, 0),
        userName: dbUser?.name || 'Customer',
        userEmail: dbUser?.email || '',
      };
      const res = await fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });
      const data = await res.json();
      if (data.id) {
        await clearCart();
        router.push(`/invoice/${data.id}`);
      } else {
        setOrderError('Failed to create invoice.');
      }
    } catch (err) {
      setOrderError('Failed to create invoice.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const lastRefetchRef = React.useRef(0);
  React.useEffect(() => {
    const now = Date.now();
    if (now - lastRefetchRef.current > 2000) {
      refetch();
      lastRefetchRef.current = now;
    }
  }, [refetch]);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] p-4 ${showSummary ? 'mt-20 md:mt-24 lg:mt-0' : ''}`}>
      <div className="w-full max-w-xl bg-[#23232b] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col gap-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-4 tracking-tight">Checkout</h1>
        {/* Cart Items */}
        <div className="flex flex-col gap-4">
            {items.length === 0 && !loading ? (
            <div className="text-gray-400 text-center py-12">Your cart is empty.</div>
            ) : (
              items.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row bg-[#181c24] rounded-lg p-4 border border-white/10 gap-2 sm:gap-4 items-start sm:items-center">
                <div className="flex flex-row w-full items-start gap-3">
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="w-12 h-12 object-contain rounded bg-black/20 border border-white/10 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-start">
                    <div className="font-semibold text-white text-base break-words whitespace-normal">{item.name}</div>
                    {item.category === 'GEMS' && (
                      <div className="text-blue-400 text-xs mt-1">
                        Gems: {(item.gemCost || 0) * item.quantity} {item.pricePer100k && item.gemCost && (
                          <>(${getGemsDollarPrice(item)})</>
                        )}
                        {item.mightRange && (
                          <span className="ml-2 text-xs text-green-400">
                            ({item.mightRange.replace('-', ' - ')}m)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-row justify-end items-center w-full gap-2 mt-2 sm:mt-0">
                  <button type="button" onClick={async () => await updateQuantity(item.id, item.quantity - 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#23272f] text-white rounded" disabled={loading || item.quantity <= 1}>-</button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => updateQuantity(
                      item.id,
                      Math.max(1, Number(e.target.value)),
                      { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel }
                    )}
                    onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                    className="w-14 px-2 py-1 rounded bg-[#23272f] text-white border border-[#333] text-center no-spinner"
                    disabled={loading}
                  />
                  <button type="button" onClick={async () => await updateQuantity(item.id, item.quantity + 1, { gemCost: item.gemCost, mightRange: item.mightRange, pricePer100k: item.pricePer100k, mightRangeLabel: item.mightRangeLabel })} className="px-2 py-1 bg-[#23272f] text-white rounded" disabled={loading}>+</button>
                  <button type="button" onClick={async () => await removeFromCart(item.id)} className="ml-2 text-red-400" disabled={loading} title="Remove">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5V19a2 2 0 002 2h8a2 2 0 002-2V7.5M4 7.5h16M9.5 7.5V5a2 2 0 012-2h1a2 2 0 012 2v2.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>
              ))
            )}
        </div>
        {/* Order Summary */}
        {showSummary && (
          <div className="mt-4 bg-[#23232b] rounded-xl p-6 border border-white/10 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white text-center mb-2">Order Summary</h2>
            {items.length === 0 ? (
              <div className="text-gray-400 text-center py-4">Your cart is empty.</div>
            ) : (
              <div className="flex flex-col gap-2 text-white text-base">
                  <div className="flex justify-between"><span>Gems:</span><span>${gemsSubtotal.toFixed(2)} ({cart.filter(i => i.category === 'GEMS').reduce((sum, i) => sum + (i.gemCost || 0) * i.quantity, 0)} Gems)</span></div>
                  <div className="flex justify-between"><span>Resources:</span><span>${cart.filter(i => i.category === 'RESOURCES').reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-blue-400 mt-2 text-lg border-t border-white/10 pt-2"><span>Total:</span><span>${(gemsSubtotal + cart.filter(i => i.category === 'RESOURCES').reduce((sum, i) => sum + i.price * i.quantity, 0)).toFixed(2)}</span></div>
              </div>
              )}
            {showPlaceOrder && (
                <button
                className="w-full mt-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={items.length === 0 || gemsBelowMin || placingOrder || loading}
                  onClick={handlePlaceOrder}
                >
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
            )}
            {orderError && <div className="text-red-400 text-sm mt-2 text-center font-semibold bg-red-900/30 rounded py-2 px-3">{orderError}</div>}
          </div>
        )}
      </div>
    </div>
  );
} 