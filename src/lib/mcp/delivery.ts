import { mcpRequest } from './client';
import type { DeliveryQuoteRequest, DeliveryQuoteResponse } from '@/types/api';

export async function getDeliveryQuote(
  params: DeliveryQuoteRequest
): Promise<DeliveryQuoteResponse> {
  return mcpRequest<DeliveryQuoteResponse>('get_delivery_quote', params as unknown as Record<string, unknown>);
}
