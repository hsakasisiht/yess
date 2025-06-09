"use client";

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] text-white p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#181c24] rounded-2xl shadow-2xl p-8 border border-white/10">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Refund & Cancellation Policy</h1>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">1. No Refunds or Cancellations</h2>
          <p className="text-white/90">All sales on Konoha Shop are final. We do <span className="font-bold text-red-400">not</span> provide refunds or accept cancellations once an order is placed and payment is confirmed.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">2. Product Changes</h2>
          <ul className="list-disc pl-6 text-white/90 space-y-2">
            <li>If you wish to change the items in your order (for example, swap or modify products), please contact us as soon as possible after placing your order.</li>
            <li>Product changes are only possible if your order has not yet been processed or delivered.</li>
            <li>We will do our best to accommodate your request, but changes are not guaranteed and are subject to availability.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">3. How to Request a Product Change</h2>
          <ul className="list-disc pl-6 text-white/90 space-y-2">
            <li>Email us at <a href="mailto:shakyaakash1324@konohabazar.store" className="text-blue-400 underline">shakyaakash1324@konohabazar.store</a> with your order number and the details of the change you want.</li>
            <li>We will review your request and respond within 2 business days.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">4. Contact Us</h2>
          <p className="text-white/90">If you have any questions about our policy or need to request a product change, please contact us at <a href="mailto:shakyaakash1324@konohabazar.store" className="text-blue-400 underline">shakyaakash1324@konohabazar.store</a>.</p>
        </section>
      </div>
    </div>
  );
} 