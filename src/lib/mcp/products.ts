import { mcpRequest } from './client';
import type { Product, ProductSearchResult } from '@/types/product';
import type { SearchProductsRequest } from '@/types/api';

export async function searchProducts(params: SearchProductsRequest): Promise<ProductSearchResult> {
  return mcpRequest<ProductSearchResult>('search_products', params as unknown as Record<string, unknown>);
}

export async function getProductById(productId: string): Promise<Product> {
  return mcpRequest<Product>('get_product', { productId });
}
