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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#222', color: '#fff', padding: 32, borderRadius: 8, minWidth: 320, maxWidth: 400 }}>
        <h2 style={{ fontSize: 22, marginBottom: 16 }}>Select Might Range</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
          {MIGHT_RANGES.map(range => (
            <li key={range.key} style={{ marginBottom: 10 }}>
              <button
                onClick={() => onSelect(range)}
                style={{ width: '100%', padding: '10px 0', background: '#333', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 500, cursor: 'pointer', fontSize: 16 }}
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          style={{ padding: '8px 20px', background: '#444', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 