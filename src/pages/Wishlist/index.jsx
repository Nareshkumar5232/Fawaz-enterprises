import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="pt-36 pb-28 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-800 mx-auto flex items-center justify-center border border-neutral-200">
          <Heart className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Saved Products
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-neutral-900 tracking-tight">
            Your wishlist is empty.
          </h1>
        </div>

        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Curated Favorites
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-neutral-900 tracking-tight mt-1">
            My Wishlist ({wishlistItems.length})
          </h1>
        </div>
        <Link
          to="/products"
          className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collection</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl p-5 border border-neutral-200 hover:border-neutral-400 space-y-4 flex flex-col justify-between group shadow-xs transition-all"
          >
            <div>
              {/* Product Image */}
              <Link
                to={`/products/${product.slug}`}
                className="relative aspect-4/3 rounded-2xl overflow-hidden bg-neutral-100 block"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-neutral-500 hover:text-red-600 flex items-center justify-center transition-colors shadow-xs"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Link>

              {/* Info */}
              <div className="pt-3 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  {product.categoryName}
                </span>
                <h3 className="text-lg font-serif font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors leading-snug">
                  <Link to={`/products/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-1">{product.material?.split('&')[0]}</p>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="font-serif font-bold text-base text-neutral-900">
                {formatCurrency(product.price)}
              </span>

              <button
                onClick={() => addToCart(product, 1, true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
