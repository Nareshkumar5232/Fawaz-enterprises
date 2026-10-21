import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItemsCount,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    closeCart();
    if (!isAuthenticated) {
      addToast('Please sign in or create an account to proceed to checkout.', 'info');
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const handleViewCartClick = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md bg-white shadow-2xl border-l border-neutral-200 flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-neutral-900" />
                  <span className="text-base font-bold text-neutral-900 tracking-tight">
                    Shopping Cart ({totalItemsCount})
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100 cursor-pointer"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                      <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-neutral-900">
                        Your cart is empty.
                      </p>
                      <p className="text-xs text-neutral-500">
                        Explore high-performance laptops and hardware gear.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        closeCart();
                        navigate('/products');
                      }}
                      className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer shadow-sm"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 divide-y divide-neutral-100">
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="pt-6 first:pt-0 flex items-center gap-4 group"
                      >
                        {/* Image */}
                        <Link
                          to={`/products/${product.slug || product.id}`}
                          onClick={closeCart}
                          className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 p-1 flex items-center justify-center border border-neutral-100"
                        >
                          <img
                            src={product.images?.[0] || product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            {product.categoryName || product.category || 'Hardware'}
                          </span>
                          <h4 className="text-xs font-bold text-neutral-900 truncate">
                            <Link
                              to={`/products/${product.slug || product.id}`}
                              onClick={closeCart}
                            >
                              {product.name}
                            </Link>
                          </h4>
                          <p className="text-xs font-bold text-neutral-900">
                            {formatCurrency(product.price)}
                          </p>

                          {/* Quantity selector */}
                          <div className="flex items-center gap-3 pt-1">
                            <div className="flex items-center border border-neutral-200 rounded-full bg-neutral-50 px-1.5 py-0.5">
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity - 1)
                                }
                                className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-neutral-900 min-w-4 text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity + 1)
                                }
                                className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-neutral-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-neutral-100 bg-neutral-50 space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-neutral-900 text-sm">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>Express Shipping</span>
                      <span className="text-emerald-600 font-semibold">Free Pan-India</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCheckoutClick}
                      className="w-full py-3.5 px-4 rounded-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleViewCartClick}
                      className="w-full py-2.5 px-4 rounded-full border border-neutral-300 text-neutral-900 hover:bg-neutral-200/60 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      View Cart Page
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-neutral-400">
                    Fawaz Enterprises • GSTIN 33AEYPF9750J1ZV • 100% Genuine Hardware
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
