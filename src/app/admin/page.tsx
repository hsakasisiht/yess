"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';

export default function AdminOrdersPage() {
  const { user, dbUser, loading } = useAuth();
  const [orders, setOrders] = useState<Array<{
    id: string;
    user?: { email?: string };
    items: Array<{
      id: string;
      product?: { name?: string };
      quantity: number;
    }>;
    total: number | string;
    status: string;
    paymentStatus?: string;
    paymentMethod?: string;
    createdAt: string | Date;
    invoiceId?: string;
  }>>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  // Auth check
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (!loading && dbUser && dbUser.role !== "admin") {
      toast.error("You are not authorized to access the admin dashboard.");
      router.replace("/account");
    }
  }, [user, dbUser, loading, router]);

  useEffect(() => {
    if (!loading && user && dbUser && dbUser.role === "admin") {
      fetchOrders();
    }
  }, [user, dbUser, loading]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders || data); // support both {orders:[]} and []
    setLoadingOrders(false);
  };

  const handleStatusChange = async (orderId: string, field: "status" | "paymentStatus", value: string) => {
    setUpdating(orderId + field);
    await fetch(`/api/admin/orders/${orderId}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    await fetchOrders();
    setUpdating(null);
  };

  if (loading || !user || !dbUser || dbUser.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] text-white p-4 animate-fade-in">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Orders Dashboard</h1>
      {loadingOrders ? (
        <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>
      ) : (
        <div className="overflow-x-auto w-full max-w-7xl mx-auto rounded-xl shadow-2xl bg-black/50 backdrop-blur-xl border border-white/10">
          <table className="min-w-full text-white">
            <thead className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-transparent">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">User Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Items</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Payment Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Order Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Invoice</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#222] hover:bg-white/10 transition">
                  <td className="px-4 py-2 font-mono text-blue-300 whitespace-nowrap">{order.id.slice(0, 8)}...</td>
                  <td className="px-4 py-2 whitespace-nowrap">{order.user?.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap max-w-[200px]">
                    <div className="flex flex-col gap-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="truncate text-white/90">
                          {item.product?.name} <span className="text-blue-400">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-blue-400">${typeof order.total === 'number' ? Number(order.total).toFixed(2) : parseFloat(order.total).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <select
                      className={`bg-black/60 border border-white/10 rounded-xl px-3 py-1 text-xs font-bold ${order.paymentStatus === 'paid' ? 'text-green-300' : 'text-yellow-200'} focus:outline-none`}
                      value={order.paymentStatus || 'pending'}
                      disabled={updating === order.id + 'paymentStatus'}
                      onChange={e => handleStatusChange(order.id, 'paymentStatus', e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <select
                      className={`bg-black/60 border border-white/10 rounded-xl px-3 py-1 text-xs font-bold ${order.status === 'done' ? 'text-green-300' : 'text-purple-200'} focus:outline-none`}
                      value={order.status}
                      disabled={updating === order.id + 'status'}
                      onChange={e => handleStatusChange(order.id, 'status', e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="done">Done</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {order.invoiceId ? (
                      <button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1 rounded-md font-semibold shadow transition-transform hover:scale-105 text-xs"
                        onClick={() => router.push(`/invoice/${order.invoiceId}`)}
                      >
                        View Invoice
                      </button>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center text-xs text-white/70">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 