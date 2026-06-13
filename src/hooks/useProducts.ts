'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import type { Product } from '@/types/product';
import type { SearchProductsRequest } from '@/types/api';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchProducts = useCallback(async (params: SearchProductsRequest) => {
    setIsSearching(true);
    try {
      const { data } = await axios.post<{ products: Product[] }>(
        '/api/mcp/search-products',
        params
      );
      setProducts(data.products);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearProducts = useCallback(() => setProducts([]), []);

  return { products, isSearching, setProducts, searchProducts, clearProducts };
}
