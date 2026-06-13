import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDeliveryQuote } from '@/lib/mcp/delivery';

const Schema = z.object({
  productIds: z.array(z.string()).min(1),
  address: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const quote = await getDeliveryQuote(parsed.data);
  return NextResponse.json(quote);
}
