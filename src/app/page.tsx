"use client";
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

const categories = [
  { name: 'Gems', href: '/products/gems', icon: '/gems.png' },
  { name: 'Resources', href: '/products/resources', icon: '/rss.png' },
  { name: 'Bots', href: '/products/bots', icon: '/bot.png' },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center animate-fade-in overflow-hidden">
      {/* Background gradient and glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a]" />
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-radial from-blue-700/40 via-purple-600/30 to-transparent rounded-full blur-3xl opacity-70 -z-10" />
      {/* Main content */}
      <section className="w-full flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
          Welcome to Konoha Shop
        </h1>
        <p className="text-lg sm:text-2xl text-gray-300 mb-8 max-w-2xl">
          The ultimate online shop for Lords Mobile Gems, Resources, and Bots. Fast, secure, and trusted by gamers.
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform hover:scale-105 animate-bounce"
        >
          Shop Now
        </button>
      </section>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in">
          <div className="bg-[#171717] rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center gap-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2 text-white">Select a Category</h2>
            <div className="flex flex-col gap-4 w-full">
              {categories.map(cat => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="flex items-center gap-4 bg-[#222] hover:bg-[#333] rounded-lg p-4 transition cursor-pointer text-white text-lg font-semibold"
                  onClick={() => setModalOpen(false)}
                >
                  <Image src={cat.icon} alt={cat.name} width={32} height={32} className="w-8 h-8" />
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
