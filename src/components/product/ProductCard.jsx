import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Heart } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWished = isInWishlist(product?.id);

  if (!product) return null;

  const imageUrl =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';

  const subtitle = product.material
    ? product.material.split('&')[0]
    : product.tagline || product.brand || '';

  if (layout === 'editorial-large') {
    return (
      <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#EAE4DA]/30 rounded-3xl p-6 sm:p-10 border border-[#E2DBD0]/60 relative">
        {/* Large Dominant Image */}
        <Link
          to={`/products/${product.slug}`}
          className="lg:col-span-7 aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-[#EAE4DA] relative block"
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-1000 ease-out"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {product.badge && (
            <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-[0.16em] px-3 py-1 bg-[#24221F] text-[#F5F2EC] rounded-full">
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
                ? 'bg-[#A66A4C] text-white'
                : 'bg-[#F5F2EC]/80 backdrop-blur-xs text-[#24221F] hover:bg-white'
            }`}
            title="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
          </button>
        </Link>

        {/* Editorial Text */}
        <div className="lg:col-span-5 space-y-4 lg:pl-4">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A66A4C]">
            {product.categoryName}
          </span>
          <h3 className="text-2xl sm:text-4xl font-serif text-[#24221F] tracking-tight leading-tight group-hover:text-[#A66A4C] transition-colors">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed font-light line-clamp-3">
            {product.description}
          </p>
          {subtitle && (
            <div className="pt-2 text-sm text-[#77716A]">
              <span className="font-medium text-[#24221F]">{subtitle}</span>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-[#E2DBD0]/80">
            <span className="text-xl font-bold font-serif text-[#24221F]">
              {formatCurrency(product.price)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => addToCart(product)}
                className="px-4 py-2 rounded-full border border-[#24221F] text-[#24221F] hover:bg-[#24221F] hover:text-[#F5F2EC] text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer"
              >
                Add to Cart
              </button>
              <Link
                to={`/products/${product.slug}`}
                className="p-2 rounded-full bg-[#24221F] text-white hover:bg-[#A66A4C] transition-colors"
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

  // Standard Minimal Editorial Card
  return (
    <div className="group flex flex-col space-y-3.5">
      {/* Product Image Dominance */}
      <Link
        to={`/products/${product.slug}`}
        className="relative aspect-4/3 sm:aspect-5/4 rounded-2xl overflow-hidden bg-[#EAE4DA]/50 block"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {product.badge && (
          <span className="absolute top-3 left-3 text-[9px] uppercase font-semibold tracking-[0.14em] px-2.5 py-0.5 bg-[#24221F]/90 backdrop-blur-xs text-[#F5F2EC] rounded-full">
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
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
            isWished
              ? 'bg-[#A66A4C] text-white opacity-100'
              : 'bg-[#F5F2EC]/80 backdrop-blur-xs text-[#24221F] hover:bg-white opacity-0 group-hover:opacity-100'
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
          }}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#F5F2EC]/90 text-[#24221F] hover:bg-[#24221F] hover:text-white flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
          title="Quick add to cart"
          aria-label="Add to cart"
        >
          <Plus className="w-4 h-4" />
        </button>
      </Link>

      {/* Catalogue Details */}
      <div className="flex justify-between items-start pt-1">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[#77716A] font-medium block">
            {product.categoryName}
          </span>
          <h3 className="text-base sm:text-lg font-serif text-[#24221F] group-hover:text-[#A66A4C] transition-colors leading-snug">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          {subtitle && (
            <p className="text-[11px] text-[#77716A] line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        <span className="text-sm font-semibold text-[#24221F] font-serif shrink-0 ml-2">
          {formatCurrency(product.price)}
        </span>
      </div>
    </div>
  );
}
