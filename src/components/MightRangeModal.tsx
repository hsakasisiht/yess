import React from 'react';

interface MightRange {
  key: string;
  label: string;
  price: number;
}

interface MightRangeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (range: MightRange) => void;
}

const MIGHT_RANGES: MightRange[] = [
  { key: '0-399', label: '0-399m', price: 4.35 },
  { key: '400-799', label: '400m - 799m', price: 4.45 },
  { key: '800-1099', label: '800m - 1099m', price: 4.6 },
  { key: '1100-1499', label: '1100m - 1499m', price: 4.8 },
  { key: '1500-2399', label: '1500m - 2399m', price: 4.9 },
];

export default function MightRangeModal({ open, onClose, onSelect }: MightRangeModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      <div className="bg-black/70 text-white p-8 rounded-xl min-w-[320px] max-w-[400px] w-full backdrop-blur-xl">
        <h2 className="text-2xl mb-4 font-bold">Select Might Range</h2>
        <ul className="list-none p-0 mb-6">
          {MIGHT_RANGES.map(range => (
            <li key={range.key} className="mb-2">
              <button
                onClick={() => onSelect(range)}
                className="w-full py-2 bg-white/10 hover:bg-white/30 text-white font-bold rounded font-medium text-base transition"
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="px-5 py-2 bg-black/30 hover:bg-black/50 text-white rounded font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 