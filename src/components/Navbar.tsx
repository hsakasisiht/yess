"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { UserIcon, HomeIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';

const productCategories = [
  { name: "Gems", href: "/products/gems", icon: "/gems.png" },
  { name: "Resources", href: "/products/resources", icon: "/rss.png" },
];

export default function Navbar() {
  const { user } = useAuth();
  const [prodOpen, setProdOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="bg-[#171717] border-b border-[#222] px-4 py-2 flex items-center justify-between sticky top-0 z-50 shadow-lg animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <HomeIcon className="h-6 w-6 text-blue-400" /> Konoha Shop
        </Link>
        <div className="relative ml-4">
          <button
            className="text-white hover:text-blue-400 font-semibold px-3 py-2 rounded transition flex items-center gap-1"
            onClick={() => setProdOpen((v) => !v)}
            onBlur={() => setTimeout(() => setProdOpen(false), 200)}
          >
            Product
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {prodOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-black/70 border border-blue-900/40 backdrop-blur-xl rounded-2xl shadow-2xl py-2 animate-fade-in-up z-50 transition-all duration-200 overflow-hidden">
              {productCategories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="flex items-center gap-3 px-5 py-3 text-white hover:bg-blue-900/30 hover:scale-[1.03] transition-all rounded-xl font-semibold text-base group"
                  onClick={() => setProdOpen(false)}
                >
                  <span className="flex items-center justify-center w-8 h-8 bg-black/30 rounded-lg border border-white/10 group-hover:bg-blue-900/40 transition">
                    <Image src={cat.icon} alt={cat.name} width={24} height={24} className="w-6 h-6 object-contain" />
                  </span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link href="/contact" className="text-white hover:text-blue-400 font-semibold px-3 py-2 rounded transition">Contact Us</Link>
        <Link href="/social" className="text-white hover:text-blue-400 font-semibold px-3 py-2 rounded transition">Social</Link>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/cart/checkout" className="flex items-center justify-center bg-transparent hover:bg-[#222] text-white p-2 rounded transition">
          <ShoppingCartIcon className="h-6 w-6" />
        </Link>
        <div className="h-6 border-l border-[#333] mx-2" />
        {user ? (
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-[#23272f] hover:bg-[#222] text-white px-3 py-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setProfileOpen((v) => !v)}
              onBlur={() => setTimeout(() => setProfileOpen(false), 200)}
            >
              <UserIcon className="h-5 w-5 text-blue-400" />
              <span className="hidden sm:block font-semibold text-white text-sm">{user.displayName || user.email?.split("@")[0]}</span>
              <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#23272f] border border-[#333] rounded-xl shadow-xl py-2 animate-fade-in z-50">
                <Link
                  href="/account"
                  className="block px-4 py-2 text-white hover:bg-[#222] rounded-t-xl transition"
                  onClick={() => setProfileOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/session/logout', { method: 'POST' });
                    await signOut(auth);
                    window.location.replace('/login');
                  }}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:bg-[#222] rounded-b-xl transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition">Login</Link>
            <Link href="/signup" className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded transition">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
} 