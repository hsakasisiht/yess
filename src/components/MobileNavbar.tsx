"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HomeIcon, ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import Image from 'next/image';

const navLinks = [
  { name: "Home", href: "/", icon: <HomeIcon className="h-5 w-5" /> },
  { name: "Gems", href: "/products/gems", icon: <Image src="/gems.png" width={20} height={20} className="h-5 w-5" alt="Gems" /> },
  { name: "Resources", href: "/products/resources", icon: <Image src="/rss.png" width={20} height={20} className="h-5 w-5" alt="Resources" /> },
  { name: "Bots", href: "/products/bots", icon: <Image src="/bot.png" width={20} height={20} className="h-5 w-5" alt="Bots" /> },
  { name: "Contact Us", href: "/contact", icon: null },
  { name: "Social", href: "#", icon: null },
];

export default function MobileNavbar({ pageName }: { pageName: string }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 w-full h-14 bg-[#171717] border-b border-[#222] flex items-center justify-between px-4 z-50 sm:hidden">
        <button onClick={() => setOpen(true)} className="p-2 text-white"><Bars3Icon className="h-7 w-7" /></button>
        <span className="text-white font-bold text-lg text-center flex-1 absolute left-0 right-0 mx-auto w-fit pointer-events-none">{pageName}</span>
        {user ? (
          <button onClick={() => { console.log('Cart icon clicked'); router.push('/cart/checkout'); }} className="p-2 text-white"><ShoppingCartIcon className="h-7 w-7" /></button>
        ) : (
          <Link href="/login" className="p-2 text-white font-semibold">Login</Link>
        )}
      </nav>
      {/* Side Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-64 bg-[#181c24] shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#222]">
              <span className="text-white font-bold text-xl">Menu</span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white"><XMarkIcon className="h-7 w-7" /></button>
            </div>
            <div className="flex-1 flex flex-col gap-2 p-4">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded text-white hover:bg-[#222] transition ${pathname === link.href ? 'bg-[#222]' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-[#222]">
              {user && (
                <button
                  onClick={() => { signOut(auth); setOpen(false); }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden" onClick={() => setOpen(false)} />}
    </>
  );
} 