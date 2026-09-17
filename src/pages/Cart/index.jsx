import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
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
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Your Cart
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#24221F]">
            Your cart is empty.
          </h1>
        </div>

        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-[#F4F0E8] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2DBD0] pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Order Review
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#24221F] tracking-tight mt-1">
            Shopping Cart ({items.length} {items.length === 1 ? 'Item' : 'Items'})
          </h1>
        </div>
        <Link
          to="/products"
          className="text-xs font-semibold uppercase tracking-wider text-[#77716A] hover:text-[#24221F] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="divide-y divide-[#E2DBD0] border-b border-[#E2DBD0]">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group"
              >
                {/* Image & Title */}
                <div className="flex items-center gap-5 min-w-0">
                  <Link
                    to={`/products/${product.slug}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#EAE4DA] shrink-0"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                  </Link>

                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A66A4C]">
                      {product.categoryName}
                    </span>
                    <h3 className="text-base sm:text-lg font-serif text-[#24221F] truncate font-medium">
                      <Link to={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <p className="text-xs text-[#77716A]">{product.material?.split('&')[0]}</p>
                    <span className="text-xs font-semibold font-serif text-[#24221F] block sm:hidden pt-1">
                      {formatCurrency(product.price)} each
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-[#E2DBD0] rounded-full bg-[#EAE4DA]/40 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1 text-[#77716A] hover:text-[#24221F]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#24221F] min-w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1 text-[#77716A] hover:text-[#24221F]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="text-sm sm:text-base font-serif font-bold text-[#24221F]">
                      {formatCurrency(product.price * quantity)}
                    </span>
                    <span className="text-[10px] text-[#77716A] block">
                      {formatCurrency(product.price)} each
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1.5 text-[#9E9890] hover:text-[#A66A4C] transition-colors"
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
            <div className="p-4 rounded-2xl bg-[#EAE4DA]/30 border border-[#E2DBD0]/60 flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#A66A4C] shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-[#24221F]">Insured Delivery</p>
                <p className="text-[#77716A] text-[11px]">Complimentary secure packaging</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAE4DA]/30 border border-[#E2DBD0]/60 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#A66A4C] shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-[#24221F]">Official Brand Warranty</p>
                <p className="text-[#77716A] text-[11px]">Up to 2 years manufacturer coverage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-[#EAE4DA]/40 rounded-3xl p-8 sm:p-10 border border-[#E2DBD0] space-y-6">
          <h2 className="text-xl font-serif text-[#24221F]">Order Summary</h2>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code (try WELCOME10)"
                className="flex-1 px-4 py-2.5 rounded-full bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:outline-none focus:border-[#A66A4C]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full border border-[#24221F] text-[#24221F] hover:bg-[#24221F] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>

            {appliedPromo && (
              <div className="flex items-center justify-between text-xs text-[#A66A4C] bg-[#F5F2EC] px-3 py-1.5 rounded-xl border border-[#E2DBD0]">
                <span>Code <strong>{appliedPromo.code}</strong> applied ({appliedPromo.percentage}% off)</span>
                <button
                  type="button"
                  onClick={removePromoCode}
                  className="text-[#77716A] hover:text-[#24221F] text-[11px]"
                >
                  Remove
                </button>
              </div>
            )}
          </form>

          {/* Calculations */}
          <div className="space-y-3 pt-2 border-t border-[#E2DBD0] text-xs">
            <div className="flex justify-between text-[#77716A]">
              <span>Subtotal</span>
              <span className="font-serif font-bold text-[#24221F]">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-[#77716A]">
              <span>Delivery & Assembly</span>
              <span className="text-[#A66A4C] font-semibold">Complimentary</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-[#A66A4C]">
                <span>Special Promo Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#77716A]">
              <span>Tax / GST</span>
              <span>{tax > 0 ? formatCurrency(tax) : '₹0'}</span>
            </div>

            <div className="flex justify-between text-base sm:text-lg font-serif font-bold text-[#24221F] pt-3 border-t border-[#E2DBD0]">
              <span>Total Amount</span>
              <span className="text-xl text-[#24221F]">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 rounded-full bg-[#24221F] hover:bg-[#A66A4C] active:scale-[0.99] text-[#F5F2EC] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-[#77716A] leading-relaxed">
            Secure multi-step checkout • Direct coordination from our Chennai office.
          </p>
        </div>
      </div>
    </div>
  );
}
