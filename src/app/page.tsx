"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { getIdToken } from 'firebase/auth';
import Image from 'next/image';

const categories = [
  { name: 'Gems', href: '/products/gems', icon: '/gems.png' },
  { name: 'Resources', href: '/products/resources', icon: '/rss.png' },
  { name: 'Bots', href: '/products/bots', icon: '/bot.png' },
];

export default function Home() {
  const { user } = useAuth();

  const printToken = async () => {
    if (user) {
      const token = await getIdToken(user);
      // Print to browser console
      console.log('Firebase ID Token:', token);
      // Send to server to print in terminal
      fetch('/api/print-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center animate-fade-in">
      <section className="w-full flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
          Welcome to Konoha Shop
        </h1>
        <p className="text-lg sm:text-2xl text-gray-300 mb-8 max-w-2xl">
          The ultimate online shop for Lords Mobile Gems, Resources, and Bots. Fast, secure, and trusted by gamers.
        </p>
        <Link href="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform hover:scale-105 animate-bounce">
          Shop Now
        </Link>
        {user && (
          <button onClick={printToken} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Print Firebase Token
          </button>
        )}
      </section>
      <section className="w-full max-w-5xl flex flex-col items-center gap-8 py-12">
        <h2 className="text-3xl font-bold mb-4">Featured Categories</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href} className="bg-[#171717] rounded-lg shadow-lg p-8 flex flex-col items-center gap-4 hover:bg-[#222] transition-transform hover:scale-105">
              <Image src={cat.icon} alt={cat.name} width={64} height={64} className="w-16 h-16" />
              <span className="text-xl font-semibold">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
