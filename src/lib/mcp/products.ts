import { callTool } from './client';

export interface KaprukaSearchResult {
  results: KaprukaProduct[];
  next_cursor: string | null;
  applied_filters: Record<string, unknown>;
}

export interface KaprukaProduct {
  id: string;
  name: string;
  summary: string;
  price: { amount: number | null; currency: string };
  compare_at_price: { amount: number; currency: string } | null;
  in_stock: boolean;
  stock_level: string;
  image_url: string | null;
  category: { id: string; name: string; slug: string };
  rating: null;
  ships_internationally: boolean;
  url: string;
}

export interface KaprukaProductDetail extends KaprukaProduct {
  description: string;
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    price: { amount: number; currency: string };
    in_stock: boolean;
    attributes: Record<string, unknown>;
  }>;
  images: string[];
  attributes: Record<string, string>;
  shipping: { ships_from: string; ships_internationally: boolean };
}

export async function searchProducts(
  q: string,
  options: {
    category?: string;
    limit?: number;
    min_price?: number;
    max_price?: number;
    in_stock_only?: boolean;
    sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'bestseller';
  } = {}
): Promise<KaprukaSearchResult> {
  const raw = await callTool('kapruka_search_products', {
    params: { q, ...options, limit: options.limit ?? 6, response_format: 'json' },
  });
  return JSON.parse(raw) as KaprukaSearchResult;
}

export async function getProduct(productId: string): Promise<KaprukaProductDetail> {
  const raw = await callTool('kapruka_get_product', {
    params: { product_id: productId, response_format: 'json' },
  });
  return JSON.parse(raw) as KaprukaProductDetail;
}
