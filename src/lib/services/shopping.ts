import { searchProducts } from '@/lib/mcp/products';
import type { ProductSearchResult } from '@/types/product';
import type { SearchProductsRequest } from '@/types/api';

export async function findProducts(params: SearchProductsRequest): Promise<ProductSearchResult> {
  return searchProducts(params);
}
