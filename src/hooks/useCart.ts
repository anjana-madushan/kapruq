'use client';

import { useState, useCallback } from 'react';
import type { Cart, CartItem } from '@/types/cart';
import type { Product } from '@/types/product';

const EMPTY_CART: Cart = { items: [], total: 0, itemCount: 0 };

function computeCart(items: CartItem[]): Cart {
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return { items, total, itemCount };
}

export function useCart() {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.product.id === product.id);
      const updated = existing
        ? prev.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev.items, { product, quantity: 1 }];
      return computeCart(updated);
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => computeCart(prev.items.filter((i) => i.product.id !== productId)));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      const updated =
        quantity <= 0
          ? prev.items.filter((i) => i.product.id !== productId)
          : prev.items.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
      return computeCart(updated);
    });
  }, []);

  const clearCart = useCallback(() => setCart(EMPTY_CART), []);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart };
}
