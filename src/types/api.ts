import type { Product } from './product';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface ChatApiResponse {
  message: string;
  products?: Product[];
  intent?: string;
}

export interface SearchProductsRequest {
  query: string;
  category?: string;
  limit?: number;
}

export interface DeliveryQuoteRequest {
  productIds: string[];
  address: string;
}

export interface DeliveryQuoteResponse {
  estimate: string;
  cost: number;
  currency: 'LKR';
}

export interface CreateOrderRequest {
  items: Array<{ productId: string; quantity: number }>;
  address: string;
  sessionId: string;
}

export interface CreateOrderResponse {
  orderId: string;
  status: string;
}

export interface TrackOrderRequest {
  orderId: string;
}

export interface TrackOrderResponse {
  orderId: string;
  status: string;
  estimatedDelivery?: string;
  updates: Array<{ timestamp: string; message: string }>;
}
