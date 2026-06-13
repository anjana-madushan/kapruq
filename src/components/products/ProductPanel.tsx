'use client';

import { Package } from 'lucide-react';
import { useShoppingContext } from '@/context/ShoppingContext';
import ProductGrid from './ProductGrid';

export default function ProductPanel() {
  const { products, isSearching } = useShoppingContext();

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-3 overflow-y-auto border-l border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
      <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Products</h2>

      {isSearching && (
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      {!isSearching && products.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <Package className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
          <p className="text-xs text-zinc-400">Products will appear here as you chat.</p>
        </div>
      )}

      {!isSearching && products.length > 0 && <ProductGrid products={products} />}
    </aside>
  );
}
