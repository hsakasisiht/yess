"use client";

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] text-white p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#181c24] rounded-2xl shadow-2xl p-8 flex flex-col gap-8 border border-white/10">
        <h1 className="text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">Order Payment</h1>
        <div className="bg-black/40 rounded-xl p-6 shadow flex flex-col gap-4 border border-white/10">
          <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2"><svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>Order Summary</h2>
          <div className="text-white/80 text-lg text-center py-8">Payment methods will be available soon. Please contact support for manual payment options.</div>
        </div>
      </div>
    </div>
  );
} 