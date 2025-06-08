import React from 'react';

interface ResetMightModalProps {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
  mightLabel?: string;
}

export default function ResetMightModal({ open, onClose, onReset, mightLabel }: ResetMightModalProps) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#222', color: '#fff', padding: 32, borderRadius: 8, minWidth: 320, maxWidth: 400 }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Reset Might Range</h2>
        <p style={{ marginBottom: 24 }}>
          Are you sure you want to reset your might range{mightLabel ? ` (${mightLabel})` : ''}?<br />This will remove your current selection.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onReset}
            style={{ padding: '8px 20px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}
          >
            Reset
          </button>
          <button
            onClick={onClose}
            style={{ padding: '8px 20px', background: '#444', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 