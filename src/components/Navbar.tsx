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
  { name: "Bots", href: "/products/bots", icon: "/bot.png" },
];

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);

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
            <div className="absolute left-0 mt-2 w-48 bg-[#222] rounded shadow-lg py-2 animate-fade-in">
              {productCategories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#333] transition"
                  onClick={() => setProdOpen(false)}
                >
                  <Image src={cat.icon} alt={cat.name} width={20} height={20} className="w-5 h-5" />
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link href="/contact" className="text-white hover:text-blue-400 font-semibold px-3 py-2 rounded transition">Contact Us</Link>
        <Link href="#" className="text-white hover:text-blue-400 font-semibold px-3 py-2 rounded transition">Social</Link>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/cart/checkout" className="flex items-center justify-center bg-transparent hover:bg-[#222] text-white p-2 rounded transition">
          <ShoppingCartIcon className="h-6 w-6" />
        </Link>
        <div className="h-6 border-l border-[#333] mx-2" />
        {user ? (
          <>
            <span className="text-white flex items-center gap-1">
              <UserIcon className="h-5 w-5" />
              {user.displayName || user.email}
            </span>
            <button
              onClick={() => signOut(auth)}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
            >Logout</button>
          </>
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