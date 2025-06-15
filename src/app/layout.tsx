import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Konoha Bazar",
  description: "Konoha Bazar - Your trusted shop for gems, resources, and more!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Konoha Bazar</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/logoico.ico" />
        <meta name="description" content="Konoha Bazar - The ultimate online shop for Lords Mobile Gems, Resources, and Bots. Fast, secure, and trusted by gamers." />
        <link rel="canonical" href="https://konohabazar.store/" />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Konoha Bazar" />
        <meta property="og:description" content="The ultimate online shop for Lords Mobile Gems, Resources, and Bots. Fast, secure, and trusted by gamers." />
        <meta property="og:image" content="https://konohabazar.store/logo.png" />
        <meta property="og:url" content="https://konohabazar.store/" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Konoha Bazar" />
        <meta name="twitter:description" content="The ultimate online shop for Lords Mobile Gems, Resources, and Bots. Fast, secure, and trusted by gamers." />
        <meta name="twitter:image" content="https://konohabazar.store/logo.png" />
        {/* Organization Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Konoha Bazar",
          "url": "https://konohabazar.store/",
          "logo": "https://konohabazar.store/logo.png",
          "sameAs": [
            "https://www.facebook.com/konohabazar", // update with your real social links
            "https://www.instagram.com/konohabazar"
          ]
        }) }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen overflow-x-hidden`}
      >
        {/* Global background gradient and glow */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a]" />
        <div className="fixed left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-radial from-blue-700/40 via-purple-600/30 to-transparent rounded-full blur-3xl opacity-70 -z-10" />
        <AuthProvider>
          <CurrencyProvider>
          <CartProvider>
            <div className="hidden sm:block"><Navbar /></div>
            <div className="sm:hidden"><MobileNavbar pageName="Konoha Shop" /></div>
        {children}
          </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}