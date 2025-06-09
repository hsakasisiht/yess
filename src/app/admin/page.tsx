"use client";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { UserIcon, CheckCircleIcon, ClockIcon, CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Order {
  id: string;
  user: { email: string };
  items: { product: { name: string; category: string; price: number; imageUrl?: string }; quantity: number; gemCost?: number; pricePer100k?: number }[];
  total: number;
  paymentStatus: string;
  status: string;
}

export default function AdminPage() {
  const { user, dbUser, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Debug logs
  console.log('user:', user);
  console.log('dbUser:', dbUser);
  console.log('loading:', loading);

  useEffect(() => {
    if (!loading && dbUser !== null && dbUser.role !== "admin") {
      router.replace("/login");
    }
    if (user && dbUser && dbUser.role === "admin") {
      fetch("/api/admin/orders")
        .then(res => res.json())
        .then(data => {
          setOrders(data.orders || []);
          setFetching(false);
        });
    }
  }, [user, dbUser, loading, router]);

  const markDone = async (orderId: string) => {
    await fetch(`/api/admin/orders/${orderId}/done`, { method: "PATCH" });
    setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: "done" } : o));
  };

  function getOrderTotal(order: Order) {
    return order.items.reduce((sum, item) => {
      const p = item.product;
      if (p.category === 'GEMS' && item.pricePer100k && item.gemCost) {
        return sum + ((item.gemCost * item.quantity) / 100000) * item.pricePer100k;
      }
      return sum + (p.price * item.quantity);
    }, 0);
  }

  // Dashboard summary
  const summary = useMemo(() => {
    let total = orders.length;
    let pending = orders.filter(o => o.status === "pending").length;
    let done = orders.filter(o => o.status === "done").length;
    let paid = orders.filter(o => o.paymentStatus === "paid").length;
    return { total, pending, done, paid };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesEmail = search ? order.user.email.toLowerCase().includes(search.toLowerCase()) : true;
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      return matchesEmail && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  if (loading || fetching) return <div className="min-h-screen flex items-center justify-center bg-black/80"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] p-4 animate-fade-in">
      {/* Dashboard Summary */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 flex flex-col items-center border border-white/10">
          <span className="text-gray-400 text-xs font-bold uppercase mb-1">Total Orders</span>
          <span className="text-3xl font-extrabold text-blue-400 flex items-center gap-2"><CurrencyDollarIcon className="w-6 h-6 text-blue-400" />{summary.total}</span>
        </div>
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 flex flex-col items-center border border-white/10">
          <span className="text-gray-400 text-xs font-bold uppercase mb-1">Pending</span>
          <span className="text-3xl font-extrabold text-yellow-400 flex items-center gap-2"><ClockIcon className="w-6 h-6 text-yellow-400" />{summary.pending}</span>
        </div>
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 flex flex-col items-center border border-white/10">
          <span className="text-gray-400 text-xs font-bold uppercase mb-1">Done</span>
          <span className="text-3xl font-extrabold text-green-400 flex items-center gap-2"><CheckCircleIcon className="w-6 h-6 text-green-400" />{summary.done}</span>
        </div>
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 flex flex-col items-center border border-white/10">
          <span className="text-gray-400 text-xs font-bold uppercase mb-1">Paid</span>
          <span className="text-3xl font-extrabold text-purple-400 flex items-center gap-2"><CurrencyDollarIcon className="w-6 h-6 text-purple-400" />{summary.paid}</span>
        </div>
      </div>
      {/* Search/Filter Bar */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex items-center bg-black/60 rounded-xl px-3 py-2 border border-white/10 w-full sm:w-1/2">
          <MagnifyingGlassIcon className="w-5 h-5 text-blue-400 mr-2" />
          <input
            type="text"
            placeholder="Search by user email..."
            className="bg-transparent outline-none text-white flex-1"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>
      {/* Orders Table */}
      <div className="w-full max-w-6xl overflow-x-auto rounded-xl shadow-2xl bg-black/50 backdrop-blur-xl border border-white/10">
        <table className="min-w-full text-white">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-transparent">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Order Name</th>
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400 text-lg">No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((order, idx) => (
                <tr key={order.id} className={`transition hover:bg-white/20 ${idx % 2 === 0 ? 'bg-white/5' : ''} animate-fade-in-up`}>
                  <td className="px-6 py-4 font-mono text-blue-300 whitespace-nowrap">{order.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-400" />
                    <span>{order.user.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                    {order.items[0]?.product?.imageUrl && (
                      <img src={order.items[0].product.imageUrl} alt={order.items[0].product.name} className="w-7 h-7 rounded object-contain bg-black/30 border border-white/10" />
                    )}
                    <span>{order.items[0]?.product.name || "-"}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-blue-400">${getOrderTotal(order).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-green-700 text-green-200' : 'bg-yellow-700 text-yellow-200'}`}>{order.paymentStatus}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.status === 'done' ? 'bg-green-700 text-green-200' : 'bg-purple-700 text-purple-200'}`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1 rounded-md font-semibold shadow transition-transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={order.status === "done"}
                      onClick={() => markDone(order.id)}
                    >
                      Mark as Done
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 