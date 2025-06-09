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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-black/60 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 sm:p-10 border border-white/10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-white text-center drop-shadow-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">Order Details</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-semibold">Order ID:</span>
            <span className="text-blue-400 font-mono text-sm select-all cursor-pointer" title="Click to copy" onClick={() => {navigator.clipboard.writeText(order.id)}}>{order.id.slice(0, 8)}...<svg className="inline w-4 h-4 ml-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" /><rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2" /></svg></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-blue-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>{order.paymentStatus}</span>
            <span className="flex items-center gap-1 text-purple-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" /></svg>{order.status}</span>
          </div>
        </div>
        {/* Calculate total using gem logic for gems, normal for others */}
        {(() => {
          let total = 0;
          order.items.forEach((item: any) => {
            if (item.product.category === 'GEMS' && item.gemCost && item.pricePer100k) {
              total += (item.gemCost * item.quantity / 100000) * item.pricePer100k;
            } else {
              total += Number(item.product.price) * item.quantity;
            }
          });
          return (
            <div className="mb-4 flex items-center gap-4 text-lg font-bold text-white/90">
              {/* Price with currency icon */}
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" /></svg>
                <span className="text-blue-400">${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </span>
              {/* Payment status icon */}
              <span className="flex items-center gap-1">
                <svg className={`w-5 h-5 ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                {order.paymentStatus}
              </span>
              {/* Order status icon */}
              <span className="flex items-center gap-1">
                <svg className={`w-5 h-5 ${order.status === 'done' ? 'text-green-400' : 'text-purple-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" /></svg>
                {order.status}
              </span>
            </div>
          );
        })()}
        <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
          Items
        </h2>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-white/10 backdrop-blur-md rounded-xl text-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-transparent">
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any, idx: number) => (
                <tr key={item.id} className={`transition hover:bg-white/20 ${idx % 2 === 0 ? 'bg-white/5' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold flex items-center gap-2">
                    {item.product.imageUrl && <img src={item.product.imageUrl} alt={item.product.name} className="w-8 h-8 rounded object-contain bg-black/30 border border-white/10" />}
                    {item.product.name}
                  </td>
                  <td className="px-6 py-4 text-center font-mono">{item.quantity}</td>
                  <td className="px-6 py-4 text-right font-mono text-blue-300">
                    {item.product.category === 'GEMS' && item.gemCost && item.pricePer100k
                      ? `$${((item.gemCost * item.quantity / 100000) * item.pricePer100k).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                      : `$${Number(item.product.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 