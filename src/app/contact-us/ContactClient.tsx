"use client";
import React from 'react';

export default function ContactClient() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] text-white p-4 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-6 text-center max-w-xl">Contact Konoha Bazar for support, questions, or partnership inquiries. We're here to help you!</p>
      <div className="bg-[#23232b] rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 border border-white/10">
        <div>
          <span className="block text-sm font-semibold mb-1">Email:</span>
          <a href="mailto:support@konohabazar.store" className="text-blue-400 hover:underline">support@konohabazar.store</a>
        </div>
        <div>
          <span className="block text-sm font-semibold mb-1">WhatsApp:</span>
          <a href="https://wa.me/message/MELAKEM7S4MRO1" className="text-green-400 hover:underline">+91 7599318577</a>
        </div>
        <div>
          <span className="block text-sm font-semibold mb-1">Telegram:</span>
          <a href="http://t.me/blackfurry0505" className="text-blue-300 hover:underline">@blackfurry0505</a>
        </div>
        <div>
          <span className="block text-sm font-semibold mb-1">Line:</span>
          <a href="https://line.me/ti/p/i8bWEMStVS" className="text-purple-400 hover:underline">Line Contact</a>
        </div>
      </div>
    </div>
  );
} 