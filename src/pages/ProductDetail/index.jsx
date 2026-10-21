import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Share2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import ProductCard from '../../components/product/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setDirectBuyItem, openCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const item = await productService.getProductBySlug(slug);
        if (!item) {
          setProduct(null);
          setLoading(false);
          return;
        }
        setProduct(item);
        setSelectedImageIndex(0);
        setQuantity(1);

        const related = await productService.getRelatedProducts(item.slug, item.categorySlug, 3);
        setRelatedProducts(related);
      } catch (e) {
        console.error('Error loading product details', e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard', 'info');
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, true);
      openCart();
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      if (!isAuthenticated) {
        addToast('Please sign in or create an account to complete your purchase.', 'info');
        navigate('/login', { state: { from: '/checkout' } });
      } else {
        navigate('/checkout');
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-7 aspect-4/3 bg-neutral-100 rounded-3xl" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 w-24 bg-neutral-100 rounded" />
            <div className="h-10 w-3/4 bg-neutral-100 rounded" />
            <div className="h-6 w-32 bg-neutral-100 rounded" />
            <div className="h-24 bg-neutral-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-36 pb-24 max-w-md mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-black text-neutral-900">Product Not Found</h2>
        <p className="text-xs text-neutral-500">
          The requested product could not be found in our current hardware catalogue.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-2">
          <Link to="/products" className="hover:text-neutral-900 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Collection</span>
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.categorySlug}`}
            className="hover:text-neutral-900"
          >
            {product.categoryName || product.category}
          </Link>
          <span className="hidden sm:inline">/</span>
          <span className="hidden sm:inline text-neutral-900 font-medium truncate max-w-xs">
            {product.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleWishlist(product)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              isWished
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-neutral-200 text-neutral-600 hover:text-black hover:border-black'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-current text-red-500' : ''}`} />
            <span className="text-[10px] uppercase tracking-wider font-bold">
              {isWished ? 'Saved' : 'Wishlist'}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors"
            title="Share product"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square sm:aspect-16/11 rounded-3xl overflow-hidden bg-neutral-100 relative border border-neutral-200 flex items-center justify-center p-6">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-contain transition-all duration-500 drop-shadow-md"
            />
            {product.badge && (
              <span className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-[0.16em] px-3.5 py-1 rounded-full bg-neutral-900 text-white">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden bg-neutral-50 transition-all cursor-pointer border-2 p-1 ${
                    selectedImageIndex === idx
                      ? 'border-neutral-900 ring-2 ring-neutral-300 opacity-100 scale-105'
                      : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View angle ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Architectural Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              {product.brand || product.categoryName}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 leading-tight">
              {product.name}
            </h1>
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-neutral-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Key Specs Highlights */}
          <div className="border-y border-neutral-200 py-4 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Processor / Platform</span>
              <span className="text-neutral-900 font-semibold">{product.specs?.processor || product.material || 'Enterprise Standard'}</span>
            </div>
            {product.specs?.ram && (
              <div className="flex justify-between">
                <span className="text-neutral-500">System Memory</span>
                <span className="text-neutral-900 font-semibold">{product.specs?.ram}</span>
              </div>
            )}
            {product.specs?.storage && (
              <div className="flex justify-between">
                <span className="text-neutral-500">High-Speed Storage</span>
                <span className="text-neutral-900 font-semibold">{product.specs?.storage}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">Stock Status</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{product.inStock !== false ? 'In Stock (Ready to Dispatch)' : 'Pre-order Available'}</span>
              </span>
            </div>
          </div>

          {/* Actions: Quantity, Add to Cart & Direct Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-neutral-300 rounded-full bg-neutral-50 px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-neutral-600 hover:text-black cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-neutral-900 min-w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-neutral-600 hover:text-black cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-full border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                Add to Cart
              </button>
            </div>

            {/* Direct Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-4 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Buy Now • {formatCurrency(product.price * quantity)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500">
            <span>{product.warranty || '2 Years Official Warranty'}</span>
            <span>•</span>
            <span>GST Tax Invoice with Input Credit</span>
          </div>
        </div>
      </div>

      {/* Full Specifications Section */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="border-t border-neutral-200 pt-12 space-y-6">
          <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
            Technical Specifications & Details
          </h3>
          <div className="divide-y divide-neutral-200 border-y border-neutral-200 bg-neutral-50/50 rounded-2xl p-6">
            {Object.entries(product.specs).map(([specKey, specVal]) => (
              <div key={specKey} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">{specKey}</span>
                <span className="sm:col-span-2 text-xs text-neutral-600 leading-relaxed font-mono">
                  {specVal}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Product Recommendations */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-8 border-t border-neutral-200">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Similar Hardware</span>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
                You May Also Consider
              </h3>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-blue-600"
            >
              View Full Collection →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
