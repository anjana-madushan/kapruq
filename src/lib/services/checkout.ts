import { createOrder } from '@/lib/mcp/orders';
import type { Cart } from '@/types/cart';
import type { CreateOrderResponse } from '@/types/api';

export async function initiateCheckout(
  cart: Cart,
  address: string,
  sessionId: string
): Promise<CreateOrderResponse> {
  return createOrder({
    items: cart.items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
    address,
    sessionId,
  });
}
