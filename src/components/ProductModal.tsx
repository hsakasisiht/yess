"use client";
import React from "react";
import Image from 'next/image';

export default function ProductModal({ open, onClose, product, size = "large" }: {
  open: boolean;
  onClose: () => void;
  product: unknown;
  size?: "small" | "large";
}) {
  if (!open || !product) return null;
  const imageStyle = size === "small" ? { maxWidth: '4rem', maxHeight: '4rem' } : undefined;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      <div
        className={`bg-black/70 rounded-lg shadow-2xl relative animate-fade-in-up flex flex-col items-center justify-center backdrop-blur-xl
          ${size === "small"
            ? "w-16 h-16 p-1"
            : "max-w-md w-full p-8"}
        `}
        style={imageStyle}
      >
        <button onClick={onClose} className="absolute top-0.5 right-1 text-gray-400 hover:text-white text-xs">&times;</button>
        {product.imageUrl && <Image src={product.imageUrl} alt={product.name} width={24} height={24} className="w-6 h-6 object-contain mx-auto mb-1" />}
        <div className="text-blue-400 font-bold mb-0.5 text-center text-[10px]">
          {product.gemCost ? `${product.gemCost} Gems` : product.price ? `${product.price} Gems` : null}
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-0.5 rounded transition mt-1 text-[10px]">Add</button>
      </div>
    </div>
  );
} 