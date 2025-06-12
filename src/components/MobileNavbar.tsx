"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HomeIcon, ShoppingCartIcon, Bars3Icon, XMarkIcon, ChatBubbleLeftRightIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import Image from 'next/image';

const navLinks = [
  { name: "Gems", href: "/products/gems", icon: "gems" },
  { name: "Resources", href: "/products/resources", icon: "resources" },
  { name: "Contact Us", href: "/contact", icon: "contact" },
  { name: "Social", href: "/social", icon: "social" },
];

export default function MobileNavbar({ pageName }: { pageName: string }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-[#171717] border-b border-[#222] flex items-center justify-between px-4 z-50 shadow-lg sm:hidden transition-all duration-200">
        <button onClick={() => setOpen(true)} className="p-2 text-white rounded-full hover:bg-[#222] transition"><Bars3Icon className="h-8 w-8" /></button>
        <span className="flex-1 flex justify-center items-center pointer-events-none">
          <img src="/1.png" alt="KONOHA BAZAR Logo" className="h-15 w-24 object-contain" />
        </span>
        {user ? (
          <button onClick={() => router.push('/cart/checkout')} className="p-2 text-white rounded-full hover:bg-[#222] transition"><ShoppingCartIcon className="h-8 w-8" /></button>
        ) : (
          <Link href="/login" className="p-2 text-white font-semibold rounded-full hover:bg-[#222] transition">Login</Link>
        )}
      </nav>
      {/* Minimal Half-Screen Left Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-[50vw] max-w-xs bg-[#181c24] z-50 flex flex-col shadow-2xl animate-fade-in"
              style={{ minWidth: 240 }}
            >
              {/* Close Button */}
              <button onClick={() => setOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white rounded-full p-2 z-50">
                <XMarkIcon className="h-8 w-8" />
              </button>
              {/* User Name at Top */}
              {user && (
                <>
                  <div className="flex items-center gap-3 px-4 pt-8 pb-2">
                    {user.photoURL ? (
                      <Image src={user.photoURL} alt="avatar" width={36} height={36} className="rounded-full border border-blue-500" />
                    ) : (
                      <svg className="w-9 h-9 text-blue-400 bg-[#23272f] rounded-full p-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    )}
                    <span className="text-white font-bold text-lg truncate">{user.displayName || user.email}</span>
                  </div>
                  <hr className="border-t border-[#505050] mx-4 my-2" />
                </>
              )}
              {/* Nav Links */}
              <div className="flex flex-col gap-2 px-4 mt-2 w-full">
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold text-base hover:bg-[#23272f] transition-all duration-150 ${pathname === link.href ? 'bg-[#23272f]' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    {link.icon === "gems" && (
                      <Image src="/gems.png" width={20} height={20} className="h-5 w-5" alt="Gems" />
                    )}
                    {link.icon === "resources" && (
                      <Image src="/rss.png" width={20} height={20} className="h-5 w-5" alt="Resources" />
                    )}
                    {link.icon === "contact" && (
                      <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    )}
                    {link.icon === "social" && (
                      <UserGroupIcon className="h-5 w-5" />
                    )}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
              {/* My Orders and Logout at Bottom */}
              {user && (
                <div className="mt-auto mb-8 flex flex-col gap-4 w-full px-4">
                  <Link
                    href="/account"
                    className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-base shadow transition-all justify-center"
                    onClick={() => setOpen(false)}
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    My Orders
                  </Link>
                  <button
                    onClick={async () => { await signOut(auth); setOpen(false); router.replace('/login'); }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-base shadow transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </motion.div>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
              onClick={() => setOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
} 
