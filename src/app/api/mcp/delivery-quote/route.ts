import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkDelivery } from '@/lib/mcp/delivery';

const Schema = z.object({
  city: z.string().min(1),
  delivery_date: z.string().optional(),
  product_id: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { city, delivery_date, product_id } = parsed.data;
  const result = await checkDelivery(city, delivery_date, product_id);
  return NextResponse.json(result);
}
