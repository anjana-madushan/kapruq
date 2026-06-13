import { mcpRequest } from './client';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  TrackOrderResponse,
} from '@/types/api';

export async function createOrder(params: CreateOrderRequest): Promise<CreateOrderResponse> {
  return mcpRequest<CreateOrderResponse>('create_order', params as unknown as Record<string, unknown>);
}

export async function trackOrder(orderId: string): Promise<TrackOrderResponse> {
  return mcpRequest<TrackOrderResponse>('track_order', { orderId });
}
