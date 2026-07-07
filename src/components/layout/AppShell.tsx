'use client';

import { useState, useCallback } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import ChatPanel from '@/components/chat/ChatPanel';
import ProductPanel from '@/components/products/ProductPanel';
import CartPanel from '@/components/cart/CartPanel';
import { useShoppingContext } from '@/context/ShoppingContext';
import type { ProductCategory } from '@/types/product';

const CATEGORY_QUERIES: Record<ProductCategory, string> = {
  gifts: 'Show me popular gifts',
  groceries: 'Show me groceries',
  electronics: 'Show me electronics',
  home: 'Show me home products',
  fashion: 'Show me fashion items',
  everyday: 'Show me everyday essentials',
};

export default function AppShell() {
  const { sendMessage } = useShoppingContext();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | undefined>();

  const handleSelectCategory = useCallback(
    (category: ProductCategory) => {
      setActiveCategory(category);
      sendMessage(CATEGORY_QUERIES[category]);
    },
    [sendMessage]
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white dark:bg-zinc-950">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />

        <main className="flex flex-1 overflow-hidden">
          <ChatPanel />
          <ProductPanel />
        </main>
      </div>

      <CartPanel />
    </div>
  );
}
