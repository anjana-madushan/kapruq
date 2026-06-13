'use client';

import { Gift, ShoppingBasket, Cpu, Home, Shirt, Star } from 'lucide-react';
import type { ProductCategory } from '@/types/product';

interface CategoryItem {
  label: string;
  category: ProductCategory;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryItem[] = [
  { label: 'Gifts', category: 'gifts', icon: <Gift className="h-4 w-4" /> },
  { label: 'Groceries', category: 'groceries', icon: <ShoppingBasket className="h-4 w-4" /> },
  { label: 'Electronics', category: 'electronics', icon: <Cpu className="h-4 w-4" /> },
  { label: 'Home', category: 'home', icon: <Home className="h-4 w-4" /> },
  { label: 'Fashion', category: 'fashion', icon: <Shirt className="h-4 w-4" /> },
  { label: 'Everyday', category: 'everyday', icon: <Star className="h-4 w-4" /> },
];

interface SidebarProps {
  activeCategory?: ProductCategory;
  onSelectCategory?: (category: ProductCategory) => void;
}

export default function Sidebar({ activeCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside className="hidden w-48 shrink-0 flex-col gap-1 border-r border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900 md:flex">
      <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
        Browse
      </p>
      {CATEGORIES.map(({ label, category, icon }) => (
        <button
          key={category}
          onClick={() => onSelectCategory?.(category)}
          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
            activeCategory === category
              ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </aside>
  );
}
