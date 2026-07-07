'use client';

import { useState } from 'react';
import { ShoppingContext } from './ShoppingContext';
import { useChat } from '@/hooks/useChat';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { useSession } from '@/hooks/useSession';

export function ShoppingProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const sessionId = session?.id ?? '';

  const { products, isSearching, setProducts } = useProducts();
  const { messages, isLoading, sendMessage } = useChat(sessionId, setProducts);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    <ShoppingContext.Provider
      value={{
        sessionId,
        messages,
        isLoading,
        sendMessage,
        products,
        isSearching,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setCartOpen,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
}
