'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useShoppingContext } from '@/context/ShoppingContext';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useShoppingContext();
  const { product, quantity } = item;

  return (
    <div className="flex gap-3">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="56px" />
        ) : (
          <div className="flex h-full items-center justify-center text-lg">🛍️</div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="line-clamp-2 text-xs font-medium text-zinc-800 dark:text-zinc-100">
          {product.name}
        </p>
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          LKR {(product.price * quantity).toLocaleString()}
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="flex h-5 w-5 items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-700"
            aria-label="Decrease quantity"
          >
            <Minus className="h-2.5 w-2.5" />
          </button>
          <span className="w-5 text-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="flex h-5 w-5 items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-700"
            aria-label="Increase quantity"
          >
            <Plus className="h-2.5 w-2.5" />
          </button>
          <button
            onClick={() => removeFromCart(product.id)}
            className="ml-auto flex h-5 w-5 items-center justify-center rounded text-zinc-400 hover:text-red-500"
            aria-label="Remove item"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
