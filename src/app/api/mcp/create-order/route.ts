import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createOrder } from '@/lib/mcp/orders';

const CartItemSchema = z.object({
  product_id: z.string(),
  quantity: z.number().int().min(1).max(99).optional(),
  icing_text: z.string().max(120).optional(),
});

const Schema = z.object({
  cart: z.array(CartItemSchema).min(1).max(30),
  recipient: z.object({ name: z.string(), phone: z.string() }),
  delivery: z.object({
    address: z.string(),
    city: z.string(),
    date: z.string(),
    location_type: z.enum(['house', 'apartment', 'office', 'other']).optional(),
    instructions: z.string().optional(),
  }),
  sender: z.object({ name: z.string(), anonymous: z.boolean().optional() }),
  gift_message: z.string().max(300).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const result = await createOrder(parsed.data);
  return NextResponse.json(result, { status: 201 });
}
