export type ProductCategory =
  | 'gifts'
  | 'groceries'
  | 'electronics'
  | 'home'
  | 'fashion'
  | 'everyday';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'LKR';
  imageUrl: string;
  category: ProductCategory;
  inStock: boolean;
  deliveryDays?: number;
  rating?: number;
  reviewCount?: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  query: string;
}
