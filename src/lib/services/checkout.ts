import { createOrder, type CreateOrderParams, type CreateOrderResult } from '@/lib/mcp/orders';

export async function initiateCheckout(params: CreateOrderParams): Promise<CreateOrderResult> {
  return createOrder(params);
}
