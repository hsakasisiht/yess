"use client";
import { FaWhatsapp, FaLine, FaTelegramPlane } from "react-icons/fa";

const SOCIALS = [
  {
    name: "WhatsApp",
    url: "https://wa.me/message/MELAKEM7S4MRO1",
    icon: <FaWhatsapp className="w-8 h-8" />,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    name: "Line App",
    url: "https://line.me/ti/p/i8bWEMStVS",
    icon: <FaLine className="w-8 h-8" />,
    color: "bg-[#00c300] hover:bg-[#00b200]",
  },
  {
    name: "Telegram",
    url: "http://t.me/blackfurry0505",
    icon: <FaTelegramPlane className="w-8 h-8" />,
    color: "bg-blue-500 hover:bg-blue-600",
  },
];

export default function SocialPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10111a] via-[#181c24] to-[#0a0a0a] text-white p-4 animate-fade-in">
      <div className="w-full max-w-lg mx-auto bg-[#18181b] border border-[#23232b] rounded-2xl shadow-2xl p-8 flex flex-col gap-8 items-center">
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent social-mobile-title">Connect With Us</h1>
        <p className="text-lg text-white/70 text-center mb-6 social-mobile-desc">Reach out for support, orders, or questions. Choose your favorite app below:</p>
        <div className="flex flex-col gap-6 w-full">
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-4 justify-center py-4 rounded-xl font-bold text-xl shadow-lg transition-all duration-200 social-mobile-btn ${s.color}`}
            >
              {s.icon}
              <span>{s.name}</span>
            </a>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .social-mobile-title {
            font-size: 1.5rem !important;
          }
          .social-mobile-desc {
            font-size: 1rem !important;
          }
          .social-mobile-btn {
            font-size: 1rem !important;
            padding: 0.7rem 0.5rem !important;
          }
          .social-mobile-btn span {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
} 