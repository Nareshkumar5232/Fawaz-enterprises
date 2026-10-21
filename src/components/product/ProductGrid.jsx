import React from 'react';
import ProductCard from './ProductCard';
import { RotateCcw } from 'lucide-react';

export function ProductSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="aspect-4/3 sm:aspect-5/4 bg-neutral-100 rounded-2xl" />
      <div className="space-y-1.5 pt-1">
        <div className="h-3 w-16 bg-neutral-200 rounded" />
        <div className="h-4 w-3/4 bg-neutral-200 rounded" />
        <div className="h-3 w-20 bg-neutral-200 rounded" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  products = [],
  loading = false,
  onResetFilters,
  onReset,
  columns = 3,
  emptyMessage = 'No products available yet.',
}) {
  const handleResetAction = onResetFilters || onReset;

  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        } gap-x-8 gap-y-12`}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <h3 className="text-2xl font-serif text-neutral-900">{emptyMessage}</h3>
        {handleResetAction && (
          <button
            onClick={handleResetAction}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-900 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      } gap-x-8 gap-y-12`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
