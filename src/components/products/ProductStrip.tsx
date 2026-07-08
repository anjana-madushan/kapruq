'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useShoppingContext } from '@/context/ShoppingContext';

const PAGE_SIZE = 3;

export default function ProductStrip() {
  const { products, addToCart } = useShoppingContext();
  const [offset, setOffset] = useState(0);

  if (products.length === 0) return null;

  const canPrev = offset > 0;
  const canNext = offset + PAGE_SIZE < products.length;
  const visible = products.slice(offset, offset + PAGE_SIZE);

  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-zinc-200 bg-zinc-50 px-3 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Left arrow */}
      <button
        onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
        disabled={!canPrev}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        aria-label="Previous products"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Cards */}
      <div className="flex flex-1 gap-3 overflow-hidden">
        {visible.map((product) => (
          <div
            key={product.id}
            className="flex flex-1 min-w-0 gap-3 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800"
          >
            {/* Image */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-700">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xl">🛍️</div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                  <span className="text-[9px] font-medium text-white">Out of stock</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {product.name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-zinc-500 dark:text-zinc-400">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  LKR {product.price.toLocaleString()}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => setOffset((o) => Math.min(products.length - PAGE_SIZE, o + PAGE_SIZE))}
        disabled={!canNext}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        aria-label="Next products"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
