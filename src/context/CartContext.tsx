"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from './AuthContext';
import { getIdToken } from 'firebase/auth';

export interface CartItem {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  gemCost?: number;
  quantity: number;
  category: string; // 'GEMS' | 'RESOURCES' | 'BOTS'
  mightRange?: string; // for gems
  pricePer100k?: number; // for gems pricing
  mightRangeLabel?: string; // for gems
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number, options?: Partial<Omit<CartItem, 'id' | 'name' | 'imageUrl' | 'price' | 'quantity' | 'category'>>) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, options?: Partial<Omit<CartItem, 'id' | 'name' | 'imageUrl' | 'price' | 'quantity' | 'category'>>) => Promise<void>;
  totalCount: number;
  loading: boolean;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to get token
  const getToken = async () => (user ? await getIdToken(user) : null);

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      setCart(
        (data.items || []).map((item: unknown) => ({
          id: item.productId,
          name: item.product.name,
          imageUrl: item.product.imageUrl,
          price: item.product.price,
          gemCost: item.gemCost,
          quantity: item.quantity,
          category: item.product.category,
          mightRange: item.mightRange,
          pricePer100k: item.pricePer100k,
          mightRangeLabel: item.mightRangeLabel,
        }))
      );
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Add or update item in cart
  const addToCart = async (productId: string, quantity = 1, options: Partial<Omit<CartItem, 'id' | 'name' | 'imageUrl' | 'price' | 'quantity' | 'category'>> = undefined) => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity, ...options }),
      });
      if (!res.ok) throw new Error('Failed to add to cart');
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error('Failed to remove from cart');
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (productId: string, quantity: number, options: Partial<Omit<CartItem, 'id' | 'name' | 'imageUrl' | 'price' | 'quantity' | 'category'>> = undefined) => {
    await addToCart(productId, quantity, options);
  };

  // Real-time polling (every 5s) and on tab focus
  useEffect(() => {
    if (!user) return;
    fetchCart();
    const interval = setInterval(fetchCart, 5000);
    const onFocus = () => fetchCart();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
    // eslint-disable-next-line
  }, [user]);

  const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalCount, loading, refetch: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}; 