import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'bytecart_customer_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [directBuyItem, setDirectBuyItem] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [items]);

  const addToCart = (product, quantity = 1, openDrawer = true) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    addToast(`Added "${product.name}" to cart.`, 'success');
    if (openDrawer) {
      setIsOpen(true);
    }
  };

  const removeFromCart = (productId) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        addToast(`Removed "${item.product.name}".`, 'info');
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setDirectBuyItem(null);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'TECHFAWAZ' || clean === 'FAWAZ15') {
      setAppliedPromo({ code: clean, percentage: 15 });
      addToast('Promo code applied: 15% discount on order.', 'success');
      return true;
    } else if (clean === 'WELCOME10' || clean === 'FAWAZ10' || clean === 'BYTECART10') {
      setAppliedPromo({ code: clean, percentage: 10 });
      addToast('Promo code applied: 10% discount on order.', 'success');
      return true;
    } else if (clean === 'FIRST5') {
      setAppliedPromo({ code: clean, percentage: 5 });
      addToast('Promo code applied: 5% discount on order.', 'success');
      return true;
    } else {
      addToast('Invalid promo code.', 'error');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    addToast('Promo code removed.', 'info');
  };

  // Active items: if in direct buy mode, only direct item is checked out
  const checkoutItems = directBuyItem ? [directBuyItem] : items;

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotal = checkoutItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const deliveryCharge = 0; // Complimentary secured delivery
  const discount = appliedPromo ? Math.round((subtotal * appliedPromo.percentage) / 100) : 0;
  const tax = 0; // Default TAX: GST is 0 unless explicitly configured
  const total = Math.max(0, subtotal + deliveryCharge - discount + tax);

  return (
    <CartContext.Provider
      value={{
        items,
        checkoutItems,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((prev) => !prev),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        directBuyItem,
        setDirectBuyItem,
        totalItemsCount,
        subtotal,
        deliveryCharge,
        discount,
        tax,
        total,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
