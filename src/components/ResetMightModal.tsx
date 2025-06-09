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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      <div className="bg-black/70 text-white p-8 rounded-xl min-w-[320px] max-w-[400px] w-full backdrop-blur-xl">
        <h2 className="text-2xl mb-3 font-bold">Reset Might Range</h2>
        <p className="mb-6">Are you sure you want to reset your might range{mightLabel ? ` (${mightLabel})` : ''}?<br />This will remove your current selection.</p>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded font-semibold transition"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black/30 hover:bg-black/50 text-white rounded font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 