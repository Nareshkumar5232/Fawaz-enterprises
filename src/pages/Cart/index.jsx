import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryCharge,
    discount,
    tax,
    total,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-36 pb-28 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            Shopping Cart
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Your cart is empty.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Explore our curated selection of laptops, displays, and high-performance computing hardware.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
          >
            <span>Explore Hardware Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            Order Review
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight mt-1">
            Shopping Cart ({items.length} {items.length === 1 ? 'Item' : 'Items'})
          </h1>
        </div>
        <Link
          to="/products"
          className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="divide-y divide-neutral-200 border-b border-neutral-200">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group"
              >
                {/* Image & Title */}
                <div className="flex items-center gap-5 min-w-0">
                  <Link
                    to={`/products/${product.slug || product.id}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 p-2 border border-neutral-200/80 flex items-center justify-center"
                  >
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      {product.brand || product.categoryName}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 truncate">
                      <Link to={`/products/${product.slug || product.id}`}>{product.name}</Link>
                    </h3>
                    <p className="text-xs text-neutral-500">{product.tagline || product.specs?.processor}</p>
                    <span className="text-xs font-bold text-neutral-900 block sm:hidden pt-1">
                      {formatCurrency(product.price)} each
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-neutral-300 rounded-full bg-neutral-50 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-neutral-900 min-w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="text-sm sm:text-base font-black text-neutral-900">
                      {formatCurrency(product.price * quantity)}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">
                      {formatCurrency(product.price)} each
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Reassurance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3">
              <Truck className="w-4 h-4 text-neutral-800 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-neutral-900">Insured Pan-India Express Delivery</p>
                <p className="text-neutral-500 text-[11px]">Free delivery on orders above ₹2,999</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-neutral-900">100% Genuine with GST Invoicing</p>
                <p className="text-neutral-500 text-[11px]">Official manufacturer warranty coverage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-neutral-50 rounded-3xl p-8 sm:p-10 border border-neutral-200/90 space-y-6">
          <h2 className="text-xl font-black text-neutral-900">Order Summary</h2>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Coupon code (e.g. TECHFAWAZ)"
                className="flex-1 px-4 py-2.5 rounded-full bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>

            {appliedPromo && (
              <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <span>Code <strong>{appliedPromo.code}</strong> applied ({appliedPromo.percentage}% off)</span>
                <button
                  type="button"
                  onClick={removePromoCode}
                  className="text-neutral-600 hover:text-black text-[11px] font-semibold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </form>

          {/* Calculations */}
          <div className="space-y-3 pt-2 border-t border-neutral-200 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-bold text-neutral-900">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>Express Delivery</span>
              <span className="text-emerald-600 font-semibold">Complimentary</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Special Promo Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-600">
              <span>Applicable GST (Tax Invoice Included)</span>
              <span>{tax > 0 ? formatCurrency(tax) : '₹0'}</span>
            </div>

            <div className="flex justify-between text-base sm:text-lg font-black text-neutral-900 pt-3 border-t border-neutral-200">
              <span>Total Amount</span>
              <span className="text-xl text-neutral-900">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                addToast('Please sign in or create an account to proceed to checkout.', 'info');
                navigate('/login', { state: { from: '/checkout' } });
              } else {
                navigate('/checkout');
              }
            }}
            className="w-full py-4 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-neutral-500 leading-relaxed">
            Fawaz Enterprises • Support: 9976895663 / 6369421249 • GSTIN 33AEYPF9750J1ZV
          </p>
        </div>
      </div>
    </div>
  );
}
