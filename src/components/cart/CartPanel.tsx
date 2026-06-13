'use client';

import { X, ShoppingCart } from 'lucide-react';
import { useShoppingContext } from '@/context/ShoppingContext';
import CartItem from './CartItem';
import CheckoutButton from './CheckoutButton';

export default function CartPanel() {
  const { cart, isCartOpen, setCartOpen, clearCart } = useShoppingContext();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />
      <aside className="fixed bottom-0 right-0 top-0 z-30 flex w-80 flex-col border-l border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              Cart ({cart.itemCount})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {cart.itemCount > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-zinc-400 hover:text-red-500"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setCartOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Close cart"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <ShoppingCart className="h-8 w-8 text-zinc-200 dark:text-zinc-700" />
              <p className="text-sm text-zinc-400">Your cart is empty.</p>
              <p className="text-xs text-zinc-300 dark:text-zinc-600">
                Ask KapruQ to find something for you.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-zinc-500">Total</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                LKR {cart.total.toLocaleString()}
              </span>
            </div>
            <CheckoutButton />
          </div>
        )}
      </aside>
    </>
  );
}
