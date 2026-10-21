import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart, openCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWished = isInWishlist(product?.id);

  if (!product) return null;

  const imageUrl =
    product.images?.[0] ||
    product.image ||
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';

  const subtitle = product.tagline || product.brand || '';

  if (layout === 'editorial-large') {
    return (
      <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 relative shadow-sm hover:shadow-md transition-shadow">
        {/* Large Dominant Image */}
        <Link
          to={`/products/${product.slug}`}
          className="lg:col-span-7 aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-neutral-100 relative block"
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {product.badge && (
            <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-[0.16em] px-3 py-1 bg-neutral-900 text-white rounded-full">
              {product.badge}
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isWished
                ? 'bg-red-500 text-white'
                : 'bg-white/90 backdrop-blur-xs text-neutral-800 hover:bg-white shadow-xs'
            }`}
            title="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
          </button>
        </Link>

        {/* Editorial Text */}
        <div className="lg:col-span-5 space-y-4 lg:pl-4">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-neutral-500">
            {product.categoryName || product.category}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal line-clamp-3">
            {product.description}
          </p>
          {subtitle && (
            <div className="pt-1 text-xs text-neutral-500 font-medium">
              <span>{subtitle}</span>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-neutral-200">
            <span className="text-xl font-black text-neutral-900">
              {formatCurrency(product.price)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  addToCart(product);
                  openCart();
                }}
                className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer shadow-sm"
              >
                Add to Cart
              </button>
              <Link
                to={`/products/${product.slug}`}
                className="p-2.5 rounded-full border border-neutral-300 hover:border-neutral-900 text-neutral-900 transition-colors"
                title="View product"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Minimal Technology Card
  return (
    <div className="group flex flex-col space-y-3 bg-white p-3 rounded-2xl border border-neutral-200/80 hover:border-neutral-400 transition-all duration-300 hover:shadow-md">
      {/* Product Image Dominance */}
      <Link
        to={`/products/${product.slug}`}
        className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 block"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 text-[9px] uppercase font-bold tracking-[0.14em] px-2.5 py-0.5 bg-neutral-900 text-white rounded-md">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
            isWished
              ? 'bg-red-500 text-white opacity-100'
              : 'bg-white/90 backdrop-blur-xs text-neutral-800 hover:bg-white opacity-80 sm:opacity-0 group-hover:opacity-100'
          }`}
          title="Save to wishlist"
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
            openCart();
          }}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 flex items-center justify-center shadow-md opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
          title="Quick add to cart"
          aria-label="Add to cart"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </Link>

      {/* Product Details */}
      <div className="flex flex-col space-y-1 pt-1 flex-grow justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[10px] text-neutral-500">
            <span className="uppercase tracking-wider font-semibold">
              {product.brand || product.categoryName || 'Fawaz'}
            </span>
          </div>

          <h3 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors leading-snug line-clamp-2">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          {subtitle && (
            <p className="text-[11px] text-neutral-500 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="pt-2 mt-1 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-sm font-black text-neutral-900">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-neutral-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
