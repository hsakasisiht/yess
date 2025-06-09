"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  items: { product: { name: string; category: string; price: number }; quantity: number; gemCost?: number; pricePer100k?: number }[];
  total: number;
  paymentStatus: string;
  status: string;
}

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (user) {
      fetch("/api/orders")
        .then(res => res.json())
        .then(data => {
          setOrders(data.orders || []);
          setFetching(false);
        });
    }
  }, [user, loading, router]);

  function getOrderTotal(order: Order) {
    return order.items.reduce((sum, item) => {
      const p = item.product;
      if (p.category === 'GEMS' && item.pricePer100k && item.gemCost) {
        return sum + ((item.gemCost * item.quantity) / 100000) * item.pricePer100k;
      }
      return sum + (p.price * item.quantity);
    }, 0);
  }

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-black/80">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-black via-[#0a0a23] to-[#1a1a2e]">
      <div className="w-full max-w-3xl bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 text-white text-center drop-shadow-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">My Orders</h1>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-400 mb-4 animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-lg text-white/80 font-semibold mb-2">No orders yet</div>
            <div className="text-sm text-white/60">Your orders will appear here once you make a purchase.</div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white/10 hover:bg-white/20 text-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-4 items-center transition-transform duration-200 cursor-pointer hover:scale-105 backdrop-blur-md border border-white/10"
                onClick={() => router.push(`/account/orders/${order.id}`)}
              >
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-lg font-bold truncate">Order #{order.id.slice(0, 8)}...</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-blue-700/60 text-xs font-mono tracking-wide">{order.items[0]?.product.name || "-"}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" /></svg>
                      ${getOrderTotal(order).toFixed(2)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className={`w-5 h-5 ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                      {order.paymentStatus}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className={`w-5 h-5 ${order.status === 'done' ? 'text-green-400' : 'text-purple-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" /></svg>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold shadow transition">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 