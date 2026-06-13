'use client';

import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { useShoppingContext } from '@/context/ShoppingContext';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCart } = useShoppingContext();

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${
        compact ? 'w-36' : 'w-full'
      }`}
    >
      <div className={`relative bg-zinc-100 dark:bg-zinc-800 ${compact ? 'h-24' : 'h-40'}`}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes={compact ? '144px' : '(max-width: 768px) 100vw, 300px'}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl text-zinc-300">🛍️</div>
        )}
        {!product.inStock && (
          <span className="absolute left-2 top-2 rounded bg-zinc-800/70 px-1.5 py-0.5 text-[10px] text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2">
        <p className={`font-medium leading-snug text-zinc-800 dark:text-zinc-100 ${compact ? 'line-clamp-2 text-xs' : 'text-sm'}`}>
          {product.name}
        </p>

        {product.rating && !compact && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-zinc-500">{product.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-1 pt-1">
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            LKR {product.price.toLocaleString()}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
