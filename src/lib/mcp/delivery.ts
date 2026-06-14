import { callTool } from './client';

export interface DeliveryCity {
  name: string;
  aliases: string[];
}

export interface DeliveryCheck {
  city: string;
  now: string;
  checked_date: string;
  available: boolean;
  rate: number;
  currency: 'LKR';
  reason: string | null;
  next_available_date: string | null;
  perishable_warning: string | null;
}

export async function listDeliveryCities(
  query?: string,
  limit = 10
): Promise<{ cities: DeliveryCity[]; total_matched: number }> {
  const raw = await callTool('kapruka_list_delivery_cities', {
    params: { query, limit, response_format: 'json' },
  });
  return JSON.parse(raw);
}

export async function checkDelivery(
  city: string,
  deliveryDate?: string,
  productId?: string
): Promise<DeliveryCheck> {
  const raw = await callTool('kapruka_check_delivery', {
    params: {
      city,
      delivery_date: deliveryDate,
      product_id: productId,
      response_format: 'json',
    },
  });
  return JSON.parse(raw);
}
