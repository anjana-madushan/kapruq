import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchProducts } from '@/lib/mcp/products';

const Schema = z.object({
  q: z.string().min(1),
  category: z.string().optional(),
  limit: z.number().int().min(1).max(50).optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  in_stock_only: z.boolean().optional(),
  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest', 'bestseller']).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { q, ...options } = parsed.data;
  const result = await searchProducts(q, options);
  return NextResponse.json(result);
}
