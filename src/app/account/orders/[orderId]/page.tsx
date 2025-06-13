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
    <>
      <style>{`
        @media (max-width: 640px) {
          .order-mobile-card {
            border-radius: 1rem;
            box-shadow: 0 2px 12px 0 #0004;
            padding: 0.5rem 0.5rem 1.2rem 0.5rem !important;
            margin-top: 1.2rem !important;
          }
          .order-mobile-title {
            font-size: 1.25rem !important;
            margin-bottom: 0.3rem !important;
          }
          .order-mobile-section {
            padding: 0.3rem 0 !important;
            gap: 0.3rem !important;
          }
          .order-mobile-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.3rem !important;
            padding: 0.5rem !important;
          }
          .order-mobile-item-img {
            width: 2rem !important;
            height: 2rem !important;
          }
          .order-mobile-item-name {
            font-size: 0.95rem !important;
            max-width: 11rem !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
          }
          .order-mobile-qty {
            font-size: 0.75rem !important;
            padding: 0.15rem 0.6rem !important;
          }
          .order-mobile-price {
            font-size: 0.95rem !important;
            min-width: 54px !important;
          }
          .order-mobile-total-invoice-row {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 0.3rem !important;
            margin-bottom: 0.3rem !important;
          }
          .order-mobile-invoice-btn {
            width: auto !important;
            min-width: 70px !important;
            font-size: 0.85rem !important;
            font-weight: bold !important;
            border-radius: 0.7rem !important;
            background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%) !important;
            box-shadow: 0 2px 8px 0 #2563eb33 !important;
            padding: 0.35rem 0.7rem !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0.3rem !important;
          }
          .order-mobile-status-badge {
            font-size: 0.7rem !important;
            padding: 0.12rem 0.5rem !important;
            margin-right: 0.2rem !important;
          }
        }
        @media (min-width: 640px) {
          .order-pc-invoice-btn {
            background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%) !important;
            color: #fff !important;
            font-size: 1rem !important;
            font-weight: bold !important;
            border-radius: 0.75rem !important;
            box-shadow: 0 2px 8px 0 #2563eb33 !important;
            padding: 0.5rem 1.2rem !important;
            min-width: 80px !important;
            transition: background 0.2s, box-shadow 0.2s;
            border: none !important;
            outline: none !important;
            margin-left: 1rem !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0.5rem !important;
            cursor: pointer !important;
          }
          .order-pc-invoice-btn:hover {
            background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%) !important;
            box-shadow: 0 4px 16px 0 #2563eb55 !important;
          }
        }
      `}</style>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] p-4">
        <div className="w-full max-w-2xl mx-auto bg-[#18181b] border border-[#23232b] rounded-2xl shadow-2xl p-0 sm:p-0 order-mobile-card">
          <div className="py-8 px-4 sm:px-10 border-b border-[#23232b] text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-white drop-shadow-lg order-mobile-title">Order Details</h1>
          </div>
          <div className="px-4 sm:px-10 py-6 flex flex-col gap-6 order-mobile-section">
            {/* Order Info Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span className="font-semibold">Order ID:</span>
                  <span className="text-blue-400 font-mono text-xs select-all cursor-pointer" title="Click to copy" onClick={() => {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(order.id);
                    } else {
                      alert('Copy not supported on this browser. Please copy manually.');
                    }
                  }}>{order.id.slice(0, 8)}...</span>
                  <button className="text-blue-400 hover:text-blue-300 focus:outline-none" title="Copy Order ID" onClick={() => {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(order.id);
                    } else {
                      alert('Copy not supported on this browser. Please copy manually.');
                    }
                  }}>
                    <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" /><rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2" /></svg>
                  </button>
                </div>
                {/* Add order date here if available */}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold order-mobile-status-badge ${order.paymentStatus === 'paid' ? 'bg-green-700/70 text-green-200' : order.paymentStatus === 'pending' ? 'bg-yellow-700/70 text-yellow-200' : 'bg-blue-700/70 text-blue-200'}`}>{order.paymentStatus}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold order-mobile-status-badge ${order.status === 'done' ? 'bg-green-700/70 text-green-200' : 'bg-purple-700/70 text-purple-200'}`}>{order.status}</span>
          </div>
        </div>
            {/* Total and Invoice Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2 order-mobile-total-invoice-row">
              <div className="flex items-center gap-2 text-lg font-bold text-white/90">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" /></svg>
                <span className="text-blue-400">${order.items.reduce((total: number, item: any) => {
          if (item.product.category === 'GEMS' && item.gemCost && item.pricePer100k) {
            return total + (item.gemCost * item.quantity / 100000) * item.pricePer100k;
          } else {
            return total + Number(item.price) * item.quantity;
          }
        }, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              {order.invoiceId && (
                <button
                  className="order-mobile-invoice-btn order-pc-invoice-btn"
                  onClick={() => router.push(`/invoice/${order.invoiceId}`)}
                >
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
                  <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#23232b] rounded-xl shadow p-4 order-mobile-item">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {item.product.imageUrl && <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 sm:w-12 sm:h-12 rounded object-contain bg-black/30 border border-white/10 order-mobile-item-img" />}
                      <span className="font-bold text-white/90 text-lg truncate order-mobile-item-name">{item.product.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 rounded-full bg-blue-700/70 text-blue-100 font-bold text-sm order-mobile-qty">Qty: {item.quantity}</span>
                      <span className="font-bold text-lg text-blue-300 text-right min-w-[80px] order-mobile-price">
                    {item.product.category === 'GEMS' && item.gemCost && item.pricePer100k
                      ? `$${((item.gemCost * item.quantity / 100000) * item.pricePer100k).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                      : `$${Number(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                    }
                      </span>
                    </div>
                  </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 