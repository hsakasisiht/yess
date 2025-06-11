"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useRouter, useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (user && params?.orderId) {
      fetch(`/api/orders/${params.orderId}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data.order || null);
          setFetching(false);
        });
    }
  }, [user, loading, params, router]);

  if (loading || fetching) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] p-4">
      <div className="w-full max-w-2xl mx-auto bg-[#18181b] border border-[#23232b] rounded-2xl shadow-2xl p-0 sm:p-0">
        <div className="py-8 px-4 sm:px-10 border-b border-[#23232b] text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-white drop-shadow-lg">Order Details</h1>
        </div>
        <div className="px-4 sm:px-10 py-6 flex flex-col gap-6">
          {/* Order Info Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <span className="font-semibold">Order ID:</span>
                <span className="text-blue-400 font-mono text-xs select-all cursor-pointer" title="Click to copy" onClick={() => {navigator.clipboard.writeText(order.id)}}>{order.id.slice(0, 8)}...</span>
                <button className="text-blue-400 hover:text-blue-300 focus:outline-none" title="Copy Order ID" onClick={() => navigator.clipboard.writeText(order.id)}>
                  <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" /><rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2" /></svg>
                </button>
              </div>
              {/* Add order date here if available */}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-green-700/70 text-green-200' : order.paymentStatus === 'pending' ? 'bg-yellow-700/70 text-yellow-200' : 'bg-blue-700/70 text-blue-200'}`}>{order.paymentStatus}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'done' ? 'bg-green-700/70 text-green-200' : 'bg-purple-700/70 text-purple-200'}`}>{order.status}</span>
            </div>
          </div>
          {/* Total and Invoice Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div className="flex items-center gap-2 text-lg font-bold text-white/90">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" /></svg>
              <span className="text-blue-400">${order.items.reduce((total: number, item: any) => {
                if (item.product.category === 'GEMS' && item.gemCost && item.pricePer100k) {
                  return total + (item.gemCost * item.quantity / 100000) * item.pricePer100k;
                } else {
                  return total + Number(item.product.price) * item.quantity;
                }
              }, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            {order.invoiceId && (
              <button
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold shadow transition text-lg flex items-center gap-2 self-end"
                onClick={() => router.push(`/invoice/${order.invoiceId}`)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h6v6m-3-6V7m0 10a9 9 0 110-18 9 9 0 010 18z" /></svg>
                View Invoice
              </button>
            )}
          </div>
          {/* Items Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
              Items
            </h2>
            <div className="flex flex-col gap-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#23232b] rounded-xl shadow p-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {item.product.imageUrl && <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded object-contain bg-black/30 border border-white/10" />}
                    <span className="font-bold text-white/90 text-lg truncate">{item.product.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-blue-700/70 text-blue-100 font-bold text-sm">Qty: {item.quantity}</span>
                    <span className="font-bold text-lg text-blue-300 text-right min-w-[80px]">{item.product.category === 'GEMS' && item.gemCost && item.pricePer100k
                      ? `$${((item.gemCost * item.quantity / 100000) * item.pricePer100k).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                      : `$${Number(item.product.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                    }</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 