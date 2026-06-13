import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { trackOrder } from '@/lib/mcp/orders';

const Schema = z.object({ orderId: z.string().min(1) });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const status = await trackOrder(parsed.data.orderId);
  return NextResponse.json(status);
}
