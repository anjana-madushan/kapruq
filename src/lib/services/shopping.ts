import { searchProducts, type KaprukaSearchResult } from '@/lib/mcp/products';

export async function findProducts(
  q: string,
  options?: { category?: string; limit?: number }
): Promise<KaprukaSearchResult> {
  return searchProducts(q, options);
}
