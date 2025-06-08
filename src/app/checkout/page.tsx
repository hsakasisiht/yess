"use client";
import ProtectedRoute from '../../components/ProtectedRoute';

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <h1 className="text-3xl font-bold">Checkout (Protected)</h1>
      </div>
    </ProtectedRoute>
  );
} 