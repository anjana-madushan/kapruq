'use client';

import { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import ChatPanel from '@/components/chat/ChatPanel';
import ProductPanel from '@/components/products/ProductPanel';
import CartPanel from '@/components/cart/CartPanel';
import type { ProductCategory } from '@/types/product';

export default function AppShell() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | undefined>();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white dark:bg-zinc-950">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

        <main className="flex flex-1 overflow-hidden">
          <ChatPanel />
          <ProductPanel />
        </main>
      </div>

      <CartPanel />
    </div>
  );
}
