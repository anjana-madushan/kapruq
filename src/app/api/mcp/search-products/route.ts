import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchProducts } from '@/lib/mcp/products';

const Schema = z.object({
  query: z.string().min(1),
  category: z.string().optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const result = await searchProducts(parsed.data);
  return NextResponse.json(result);
}
