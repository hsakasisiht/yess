"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'USD' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (usdValue: number) => number;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  // On mount, read currency from localStorage
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('currency') : null;
    if (saved === 'INR' || saved === 'USD') {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', c);
    }
  };

  const convert = (usdValue: number) =>
    currency === 'INR' ? usdValue * 92 : usdValue;

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, currencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}; 