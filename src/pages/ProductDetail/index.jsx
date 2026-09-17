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
  Sparkles,
  Compass
} from 'lucide-react';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import ProductCard from '../../components/product/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setDirectBuyItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

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
    }
  };

  const handleBuyNow = () => {
    if (product) {
      setDirectBuyItem({ product, quantity });
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-7 aspect-4/3 bg-[#E8E0D5] rounded-3xl" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 w-24 bg-[#E8E0D5] rounded" />
            <div className="h-10 w-3/4 bg-[#E8E0D5] rounded" />
            <div className="h-6 w-32 bg-[#E8E0D5] rounded" />
            <div className="h-24 bg-[#E8E0D5] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-36 pb-24 max-w-md mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-serif text-[#24221F]">Product Not Found</h2>
        <p className="text-xs text-[#77716A]">
          The requested product could not be found in our current catalogue.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#24221F] text-white text-xs font-semibold uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Collection</span>
        </Link>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-20">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-[#77716A] border-b border-[#E2DBD0] pb-4">
        <div className="flex items-center gap-2">
          <Link to="/products" className="hover:text-[#24221F] flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Collection</span>
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.categorySlug}`}
            className="hover:text-[#24221F]"
          >
            {product.categoryName}
          </Link>
          <span className="hidden sm:inline">/</span>
          <span className="hidden sm:inline text-[#24221F] font-medium truncate max-w-xs">
            {product.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleWishlist(product)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              isWished
                ? 'border-[#A66A4C] bg-[#A66A4C] text-white'
                : 'border-[#E2DBD0] text-[#77716A] hover:text-[#24221F] hover:border-[#24221F]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-current' : ''}`} />
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              {isWished ? 'Saved' : 'Wishlist'}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 p-1.5 text-[#77716A] hover:text-[#24221F] transition-colors"
            title="Share product"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Large Dominant Gallery (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-4/3 sm:aspect-16/11 rounded-3xl overflow-hidden bg-[#E8E0D5] relative border border-[#E2DBD0]">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700"
            />
            {product.badge && (
              <span className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-[0.16em] px-3.5 py-1 rounded-full bg-[#24221F] text-[#F4F0E8]">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden bg-[#E8E0D5] transition-all cursor-pointer border ${
                    selectedImageIndex === idx
                      ? 'border-[#24221F] ring-2 ring-[#24221F] opacity-100'
                      : 'border-[#E2DBD0] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Architectural Information (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A66A4C]">
              {product.categoryName}
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-[#24221F] leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-serif text-[#24221F] pt-1">
              {formatCurrency(product.price)}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed font-light">
            {product.description}
          </p>

          {/* Material & Dimensions Summary */}
          <div className="border-y border-[#E2DBD0] py-4 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#77716A]">Build Quality / Processor</span>
              <span className="text-[#24221F] font-medium">{product.material || product.specs?.processor || product.brand || 'Flagship Grade'}</span>
            </div>
            {product.finish && (
              <div className="flex justify-between">
                <span className="text-[#77716A]">Finish / Shade</span>
                <span className="text-[#24221F] font-medium">{product.finish}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between">
                <span className="text-[#77716A]">Dimensions</span>
                <span className="text-[#24221F] font-medium">{product.dimensions}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#77716A]">Availability</span>
              <span className="text-[#A66A4C] font-semibold">{product.inStock !== false ? 'In Stock (Ready to Ship)' : (product.availability || 'Out of Stock')}</span>
            </div>
          </div>

          {/* Key Design Highlights */}
          {product.highlights && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#24221F]">
                Design Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-[#77716A]">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A66A4C] mt-1.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions: Quantity, Add to Cart & Direct Buy Now */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#E2DBD0] rounded-full bg-[#E8E0D5]/40 px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-[#77716A] hover:text-[#24221F]"
                  aria-label="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-semibold text-[#24221F] min-w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-[#77716A] hover:text-[#24221F]"
                  aria-label="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-full border border-[#24221F] text-[#24221F] hover:bg-[#24221F] hover:text-[#F4F0E8] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Add to Cart
              </button>
            </div>

            {/* Direct Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-4 px-6 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-[#F4F0E8] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <span>Buy Now • {formatCurrency(product.price * quantity)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#77716A]">
            <span>{product.warranty}</span>
            <span>•</span>
            <span>Secured Insured Shipping</span>
          </div>
        </div>
      </div>

      {/* Full Specifications Section */}
      <div className="border-t border-[#E2DBD0] pt-12 space-y-6">
        <h3 className="text-2xl sm:text-3xl font-serif text-[#24221F]">
          Specifications & Build Quality
        </h3>
        <div className="divide-y divide-[#E2DBD0] border-y border-[#E2DBD0]">
          {Object.entries(product.specs || {}).map(([specKey, specVal]) => (
            <div key={specKey} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="text-xs font-medium text-[#24221F]">{specKey}</span>
              <span className="sm:col-span-2 text-xs text-[#77716A] leading-relaxed">
                {specVal}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Product Recommendations */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-8 border-t border-[#E2DBD0]">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#24221F]">
              You May Also Like
            </h3>
            <Link
              to="/products"
              className="text-xs font-semibold uppercase tracking-wider text-[#A66A4C] hover:text-[#24221F]"
            >
              View Full Collection →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
