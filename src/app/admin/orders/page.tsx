"use client";
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
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
    paymentMethod?: string;
    createdAt: string | Date;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Admin Orders Dashboard</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#171717] rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">User Email</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Payment Method</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#222]">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.user?.email}</td>
                  <td className="px-4 py-2">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.product?.name} x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">${typeof order.total === 'number' ? order.total.toFixed(2) : parseFloat(order.total).toFixed(2)}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">{order.paymentMethod || '-'}</td>
                  <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 