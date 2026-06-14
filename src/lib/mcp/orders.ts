import { callTool } from './client';

export interface CreateOrderParams {
  cart: Array<{ product_id: string; quantity?: number; icing_text?: string }>;
  recipient: { name: string; phone: string };
  delivery: {
    address: string;
    city: string;
    date: string;
    location_type?: 'house' | 'apartment' | 'office' | 'other';
    instructions?: string;
  };
  sender: { name: string; anonymous?: boolean };
  gift_message?: string;
}

export interface CreateOrderResult {
  checkout_url: string;
  order_ref: string;
  summary: {
    items_total: number;
    delivery_fee: number;
    addons_total: number;
    grand_total: number;
    currency: string;
  };
  expires_at: string;
}

export interface TrackOrderResult {
  order_number: string;
  status: string;
  status_display: string;
  order_date: string;
  delivery_date: string;
  amount: string;
  recipient: { name: string; phone: string; address: string; city: string };
  progress: Array<{ step: string; timestamp: string }>;
  has_delivery_video: boolean;
  has_delivery_photo: boolean;
  items: Array<{ product_id: string; name: string; quantity: number; selling_price: number }>;
}

export async function createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
  const raw = await callTool('kapruka_create_order', {
    params: { ...params, response_format: 'json' },
  });
  return JSON.parse(raw);
}

export async function trackOrder(orderNumber: string): Promise<TrackOrderResult> {
  const raw = await callTool('kapruka_track_order', {
    params: { order_number: orderNumber, response_format: 'json' },
  });
  return JSON.parse(raw);
}
