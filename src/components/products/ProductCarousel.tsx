import type { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {products.map((p) => (
        <div key={p.id} className="shrink-0">
          <ProductCard product={p} compact />
        </div>
      ))}
    </div>
  );
}
