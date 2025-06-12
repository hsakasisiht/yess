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

  // Calculate subtotal for gems using locked-in pricePer100k and gemCost
  const gemsSubtotal = items
    .filter(i => i.category === 'GEMS')
    .reduce((sum, item) => {
      if (item.pricePer100k && item.gemCost) {
        return sum + ((item.gemCost * item.quantity) / 100000) * item.pricePer100k;
      }
      return sum;
    }, 0);

  // Calculate subtotal for resources using locked-in price
  const resourcesSubtotal = items
    .filter(i => i.category === 'RESOURCES')
    .reduce((sum, item) => {
      const price = item.price ?? 0;
      return sum + price * item.quantity;
    }, 0);

  const getGemsDollarPrice = (item: unknown) => {
    if (!item || typeof item !== 'object') return null;
    const i = item as { gemCost?: number; pricePer100k?: number; category?: string; quantity?: number };
    if (i.category === 'GEMS' && i.pricePer100k && i.gemCost && i.quantity) {
      return `$${(((i.gemCost * i.quantity) / 100000) * i.pricePer100k).toFixed(2)}`;
    }
    return null;
  };

  // Add getResourcePrice utility (copy from ResourcesClient)
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
        '44444': 3.5,
        '44440': 2.5,
        '22222': 2.3,
        '22220': 1.7,
        '11111': 1.8,
        '11110': 1.5,
      },
      '1686-1739': {
        '44444': 4,
        '44440': 2.8,
        '22222': 2.7,
        '22220': 2,
        '11111': 2.2,
        '11110': 1.8,
      },
      '1740-1769': {
        '44444': 5,
        '44440': 3.7,
        '22222': 3.2,
        '22220': 2.5,
        '11111': 2.5,
        '11110': 2.2,
      },
      '1770-1780': {
        '44444': 6,
        '44440': 4.4,
        '22222': 3.7,
        '22220': 2.8,
        '11111': 2.7,
        '11110': 2.3,
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

  // Get kingdom number from localStorage
  const [kingdomNumber, setKingdomNumber] = React.useState<string | null>(null);
  React.useEffect(() => {
    setKingdomNumber(localStorage.getItem('kingdomNumber'));
  }, []);

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
          kingdomNumber: item.kingdomNumber,
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

  // In resource item display, use getResourcePrice for price
  const getResourcePriceForItem = (item: unknown) => {
    if (!item || typeof item !== 'object') return null;
    const i = item as { name: string; category: string };
    if (i.category === 'RESOURCES') {
      return getResourcePrice(i.name, kingdomNumber);
    }
    return null;
  };

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
              <div key={`${item.productId}-${item.kingdomNumber || item.mightRange || 'default'}`} className="flex flex-col sm:flex-row bg-[#181c24] rounded-lg p-4 border border-white/10 gap-2 sm:gap-4 items-start sm:items-center">
                <div className="flex flex-row w-full items-start gap-3">
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="w-12 h-12 object-contain rounded bg-black/20 border border-white/10 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-start">
                    <div className="font-semibold text-white text-base break-words whitespace-normal">{item.name}</div>
                    {item.category === 'GEMS' && (
                      <div className="text-blue-400 text-xs mt-1">
                        Gems: {(item.gemCost || 0) * item.quantity} {item.pricePer100k && item.gemCost && (
                          <>(${(((item.gemCost * item.quantity) / 100000) * item.pricePer100k).toFixed(2)})</>
                        )}
                        {item.mightRangeLabel && (
                          <span className="ml-2 text-xs text-green-400">
                            ({item.mightRangeLabel})
                          </span>
                        )}
                      </div>
                    )}
                    {item.category === 'RESOURCES' && (
                      <div className="text-green-400 text-xs mt-1">
                        ${item.price}
                        {item.kingdomNumber && (
                          <span className="ml-1 text-xs text-green-400">(Kingdom {item.kingdomNumber})</span>
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
                  <div className="flex justify-between"><span>Resources:</span><span>${resourcesSubtotal.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-blue-400 mt-2 text-lg border-t border-white/10 pt-2"><span>Total:</span><span>${(gemsSubtotal + resourcesSubtotal).toFixed(2)}</span></div>
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