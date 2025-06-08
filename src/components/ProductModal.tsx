"use client";
import React from "react";

export default function ProductModal({ open, onClose, product, size = "large" }: {
  open: boolean;
  onClose: () => void;
  product: any;
  size?: "small" | "large";
}) {
  if (!open || !product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in">
      <div
        className={`bg-[#171717] rounded-lg shadow-2xl relative animate-fade-in-up flex flex-col items-center justify-center
          ${size === "small"
            ? "w-16 h-16 p-1"
            : "max-w-md w-full p-8"}
        `}
        style={size === "small" ? { width: '4rem', height: '4rem', minWidth: '4rem', minHeight: '4rem', maxWidth: '4rem', maxHeight: '4rem' } : {}}
      >
        <button onClick={onClose} className="absolute top-0.5 right-1 text-gray-400 hover:text-white text-xs">&times;</button>
        {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-6 h-6 object-contain mx-auto mb-1" />}
        <div className="text-blue-400 font-bold mb-0.5 text-center text-[10px]">
          {product.gemCost ? `${product.gemCost} Gems` : product.price ? `${product.price} Gems` : null}
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-0.5 rounded transition mt-1 text-[10px]">Add</button>
      </div>
    </div>
  );
} 