import type { Cart, CartItem } from '@/types/cart';
import type { Product } from '@/types/product';

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function formatCartSummary(cart: Cart): string {
  if (cart.itemCount === 0) return 'Your cart is empty.';
  return `${cart.itemCount} item${cart.itemCount !== 1 ? 's' : ''} — LKR ${cart.total.toLocaleString()}`;
}
