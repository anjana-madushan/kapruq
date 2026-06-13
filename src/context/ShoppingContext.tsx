'use client';

import { createContext, useContext } from 'react';
import type { Message } from '@/types/chat';
import type { Product } from '@/types/product';
import type { Cart } from '@/types/cart';

export interface ShoppingContextValue {
  sessionId: string;

  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;

  products: Product[];
  isSearching: boolean;
  setProducts: (products: Product[]) => void;

  cart: Cart;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const ShoppingContext = createContext<ShoppingContextValue | null>(null);

export function useShoppingContext(): ShoppingContextValue {
  const ctx = useContext(ShoppingContext);
  if (!ctx) throw new Error('useShoppingContext must be used inside ShoppingProvider');
  return ctx;
}
