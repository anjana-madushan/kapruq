'use client';

import { ShoppingCart, Sparkles } from 'lucide-react';
import { useShoppingContext } from '@/context/ShoppingContext';

export default function TopBar() {
  const { cart, setCartOpen, isCartOpen } = useShoppingContext();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-500" />
        <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          KapruQ
        </span>
        <span className="hidden text-xs text-zinc-400 sm:inline">
          Your Sri Lankan shopping concierge
        </span>
      </div>

      <button
        onClick={() => setCartOpen(!isCartOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
        {cart.itemCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-white">
            {cart.itemCount > 9 ? '9+' : cart.itemCount}
          </span>
        )}
      </button>
    </header>
  );
}
