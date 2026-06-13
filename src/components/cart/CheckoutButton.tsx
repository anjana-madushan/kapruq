'use client';

import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { useShoppingContext } from '@/context/ShoppingContext';

export default function CheckoutButton() {
  const { cart, clearCart } = useShoppingContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (cart.itemCount === 0 || isProcessing) return;
    setIsProcessing(true);
    // Placeholder: wire up initiateCheckout() in Phase 2
    await new Promise((r) => setTimeout(r, 1000));
    setIsProcessing(false);
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={cart.itemCount === 0 || isProcessing}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      {isProcessing ? 'Processing…' : `Checkout · LKR ${cart.total.toLocaleString()}`}
    </button>
  );
}
