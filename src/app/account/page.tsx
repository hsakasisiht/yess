"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  items: {
    product: { name: string; category: string; price: number };
    price: number; // locked-in price
    quantity: number;
    gemCost?: number;
    pricePer100k?: number;
  }[];
  total: number;
  paymentStatus: string;
  status: string;
}

export default function AccountPage() {
  const { user, loading, dbUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if ((dbUser && dbUser.firebaseUid) || (user && user.email)) {
      const queryParam = dbUser && dbUser.firebaseUid
        ? `firebaseUid=${encodeURIComponent(dbUser.firebaseUid)}`
        : `userEmail=${encodeURIComponent(user.email)}`;
      fetch(`/api/orders?${queryParam}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data.orders || []);
          setFetching(false);
        });
    }
  }, [user, dbUser, loading, router]);

  function getOrderTotal(order: Order) {
    return order.items.reduce((sum, item) => {
      if (item.product.category === 'GEMS' && item.pricePer100k && item.gemCost) {
        return sum + ((item.gemCost * item.quantity) / 100000) * item.pricePer100k;
      }
      return sum + (item.price * item.quantity);
    }, 0);
  }

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-black/80">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] mt-20 md:mt-24 lg:mt-0">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">My Orders</h1>
          <div className="text-lg text-white/60">Track your recent purchases and order status</div>
        </div>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <svg width="100" height="100" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-400 mb-8 animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-2xl text-white/80 font-semibold mb-2">No orders yet</div>
            <div className="text-base text-white/60 mb-6">Your orders will appear here once you make a purchase.</div>
            <a href="/" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold shadow transition text-lg">Start Shopping</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-[#202027] border border-[#23232b] rounded-2xl shadow-xl p-6 flex flex-col gap-4 transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl group relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white tracking-wide">Order #{order.id.slice(0, 8)}...</span>
                    <button
                      className="text-blue-400 hover:text-blue-300 focus:outline-none"
                      title="Copy Order ID"
                      onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(order.id); }}
                    >
                      <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" /><rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2" /></svg>
                    </button>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-green-700/70 text-green-200' : order.paymentStatus === 'pending' ? 'bg-yellow-700/70 text-yellow-200' : 'bg-blue-700/70 text-blue-200'}`}>{order.paymentStatus}</span>
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex items-center gap-2 text-base text-white/90 font-semibold">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" /></svg>
                      ${getOrderTotal(order).toFixed(2)}
                  </div>
                  <div className="text-sm text-white/70 mt-1">
                    {order.items.length === 1 ? order.items[0].product.name : `${order.items.length} items`}
                  </div>
                </div>
                <button
                  className="mt-2 px-5 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-lg text-white font-bold shadow transition flex items-center gap-2 self-end"
                  onClick={() => router.push(`/account/orders/${order.id}`)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 