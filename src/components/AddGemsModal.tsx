"use client";
import React, { useState } from "react";
import Image from 'next/image';

export default function AddGemsModal({ open, onClose, onAdd, gem }: {
  open: boolean;
  onClose: () => void;
  onAdd: (quantity: number) => void;
  gem: unknown;
}) {
  const [mode, setMode] = useState<"" | "stack">("");
  const [qty, setQty] = useState(1);
  if (!open || !gem) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      <div className="bg-black/70 rounded-lg shadow-2xl p-6 w-full max-w-xs relative animate-fade-in-up backdrop-blur-xl">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl">&times;</button>
        <div className="flex flex-col items-center gap-2">
          {gem.imageUrl && <Image src={gem.imageUrl} alt={gem.name} width={64} height={64} className="w-16 h-16 object-contain" />}
          <div className="text-lg font-bold text-white text-center">{gem.name}</div>
          <div className="text-blue-400 font-semibold mb-2">{gem.gemCost} Gems</div>
          {mode === "" && (
            <div className="flex gap-3 mt-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                onClick={() => { onAdd(1); onClose(); }}
              >
                Add Single
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded font-semibold"
                onClick={() => setMode("stack")}
              >
                Add Stack
              </button>
            </div>
          )}
          {mode === "stack" && (
            <form
              className="flex flex-col items-center gap-3 mt-2 w-full"
              onSubmit={e => { e.preventDefault(); onAdd(qty); onClose(); }}
            >
              <input
                type="number"
                min={1}
                value={qty}
                onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                className="w-24 p-2 rounded bg-[#222] text-white border border-[#333] text-center"
                placeholder="Quantity"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
              >
                Add {qty} to Cart
              </button>
              <button
                type="button"
                className="w-full bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded font-semibold mt-1"
                onClick={() => setMode("")}
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 