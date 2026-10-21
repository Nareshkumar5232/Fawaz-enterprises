import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  Plus,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Banknote,
  MapPin,
  Lock,
  User,
  AlertCircle,
  Package,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { addressService } from '../../services/addressService';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { formatCurrency } from '../../utils/formatters';

export default function Checkout() {
  const {
    checkoutItems,
    subtotal,
    deliveryCharge,
    discount,
    tax,
    total,
    clearCart,
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      addToast('Please sign in or create an account to proceed to checkout.', 'info');
      navigate('/login', { state: { from: '/checkout' }, replace: true });
    }
  }, [isAuthenticated, navigate, addToast]);

  // Multi-step: 1 = Address, 2 = Payment & Review
  const [currentStep, setCurrentStep] = useState(1);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);

  // New address form
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    tag: 'HOME',
    house: '',
    street: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('ONLINE'); // 'ONLINE' or 'COD'
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load addresses
  useEffect(() => {
    async function loadAddresses() {
      if (!user) return;
      setAddressLoading(true);
      try {
        const list = await addressService.getAddresses(user?.id);
        setAddresses(list || []);
        if (list && list.length > 0) {
          const def = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(def.id);
        } else {
          setIsAddingNewAddress(true);
        }
      } finally {
        setAddressLoading(false);
      }
    }
    loadAddresses();
  }, [user]);

  // Sync user info into new address
  useEffect(() => {
    if (user) {
      setNewAddress((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="pt-36 pb-28 max-w-md mx-auto px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-neutral-900">Redirecting to Sign In...</h2>
        <p className="text-xs text-neutral-500">Please sign in or create an account to proceed with checkout.</p>
      </div>
    );
  }

  // If no items in checkout
  if (checkoutItems.length === 0) {
    return (
      <div className="pt-36 pb-28 max-w-md mx-auto px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900">No items to checkout</h2>
        <p className="text-xs text-neutral-500">Your cart is empty. Please select products from our catalog to proceed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
        >
          <span>Explore Hardware Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Handle saving new address
  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.phone || !newAddress.house || !newAddress.street || !newAddress.city || !newAddress.pincode) {
      addToast('Please fill all required address fields.', 'error');
      return;
    }

    try {
      const created = await addressService.addAddress({
        ...newAddress,
        userId: user?.id || 'usr-guest',
      });
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setIsAddingNewAddress(false);
      addToast('Delivery address saved successfully.', 'success');
    } catch {
      addToast('Failed to save address.', 'error');
    }
  };

  // Step 1 to Step 2
  const handleProceedToPayment = () => {
    if (isAddingNewAddress) {
      addToast('Please save or select a delivery address.', 'error');
      return;
    }
    if (!selectedAddressId) {
      addToast('Please select a delivery address.', 'error');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Place Order
  const handlePlaceOrder = async () => {
    setErrorMsg('');
    setIsProcessingOrder(true);

    const activeAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!activeAddress) {
      setErrorMsg('Please select a valid delivery address.');
      setIsProcessingOrder(false);
      return;
    }

    try {
      let transactionId = null;

      if (paymentMethod === 'ONLINE') {
        // Step 1: Initialize session
        const session = await paymentService.initializePaymentSession({
          amount: total,
          customerEmail: user?.email || 'customer@fawazenterprises.com',
          customerPhone: activeAddress.phone,
          customerName: activeAddress.name,
        });

        // Step 2: Simulate secure gateway callback & signature verification
        const verification = await paymentService.verifyPaymentSignature({
          paymentId: 'PAY_' + Date.now(),
          orderId: session.sessionId,
          signature: 'sig_verified_mock',
        });

        transactionId = verification.transactionId;
      }

      // Step 3: Create Order in database/orderService
      const createdOrder = await orderService.createOrder({
        userId: user?.id || 'usr-fawaz',
        items: checkoutItems,
        shippingAddress: activeAddress,
        subtotal,
        deliveryCharge,
        discount,
        tax,
        total,
        paymentMethod,
        transactionId,
      });

      // Step 4: Clear cart
      clearCart();

      // Step 5: Navigate to order confirmation
      navigate(`/order-success/${createdOrder.id}`);
    } catch (err) {
      setErrorMsg(err.message || 'Payment or order processing failed. Please try again.');
      addToast('Unable to complete order. Please retry.', 'error');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Checkout Progress Header */}
      <div className="border-b border-neutral-200 pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              Fawaz Enterprises Dispatch & Invoicing
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Secure Checkout
            </h1>
          </div>

          {/* Step Badges */}
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 pb-1 border-b-2 transition-colors cursor-pointer ${
                currentStep === 1
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Delivery Address</span>
            </button>

            <span className="text-neutral-300">→</span>

            <button
              onClick={() => {
                if (selectedAddressId) setCurrentStep(2);
              }}
              className={`flex items-center gap-2 pb-1 border-b-2 transition-colors cursor-pointer ${
                currentStep === 2
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'
              }`}>
                2
              </span>
              <span>Payment & Review</span>
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Multi-Step Forms */}
        <div className="lg:col-span-7 space-y-8">
          {/* STEP 1: DELIVERY ADDRESS */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-neutral-900">
                  Select Delivery Address
                </h2>
                {!isAddingNewAddress && (
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {/* Saved Address Cards */}
              {!isAddingNewAddress && (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        selectedAddressId === addr.id
                          ? 'bg-neutral-50 border-neutral-900 shadow-sm ring-1 ring-neutral-900'
                          : 'bg-white border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center border ${
                              selectedAddressId === addr.id
                                ? 'border-neutral-900 bg-neutral-900'
                                : 'border-neutral-400'
                            }`}
                          >
                            {selectedAddressId === addr.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-neutral-900">{addr.name}</span>
                              <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-neutral-900 text-white">
                                {addr.tag || 'HOME'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] text-blue-600 font-bold">Default</span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                              {addr.house}, {addr.street}, {addr.area}
                              <br />
                              {addr.city}, {addr.state} – {addr.pincode}
                            </p>
                            <p className="text-xs text-neutral-900 font-semibold mt-1">Phone: {addr.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Address Form */}
              {isAddingNewAddress && (
                <form onSubmit={handleSaveNewAddress} className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                    <h3 className="text-base font-bold text-neutral-900">Add New Delivery Address</h3>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="text-xs text-neutral-500 hover:text-neutral-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        placeholder="Recipient full name"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="+91 99768 95663"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">Building / Flat / Premise *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.house}
                      onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                      placeholder="e.g. Flat 4B, Signature Tower"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">Street / Road *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="e.g. Main High Road"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">Area / Locality *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.area}
                        onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                        placeholder="e.g. Tech Park Zone"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">City *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">State *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="600001"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
                    >
                      Save & Use This Address
                    </button>
                  </div>
                </form>
              )}

              {/* Proceed Button */}
              {!isAddingNewAddress && (
                <button
                  onClick={handleProceedToPayment}
                  className="w-full py-4 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD & REVIEW */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {/* Selected Address Summary */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                    Delivering to
                  </span>
                  <p className="text-sm font-bold text-neutral-900">{selectedAddress?.name}</p>
                  <p className="text-xs text-neutral-600">
                    {selectedAddress?.house}, {selectedAddress?.street}, {selectedAddress?.area}, {selectedAddress?.city} – {selectedAddress?.pincode}
                  </p>
                  <p className="text-xs text-neutral-500">Contact: {selectedAddress?.phone}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-neutral-900 hover:text-blue-600 underline font-bold uppercase tracking-wider cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4">
                <h2 className="text-xl font-black text-neutral-900">
                  Select Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Option 1: Online Payment */}
                  <label
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-5 rounded-2xl border flex items-start justify-between cursor-pointer transition-all ${
                      paymentMethod === 'ONLINE'
                        ? 'bg-neutral-50 border-neutral-900 shadow-sm ring-1 ring-neutral-900'
                        : 'bg-white border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center border ${
                          paymentMethod === 'ONLINE'
                            ? 'border-neutral-900 bg-neutral-900'
                            : 'border-neutral-400'
                        }`}
                      >
                        {paymentMethod === 'ONLINE' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-sm text-neutral-900">
                            Online Payment (UPI, Credit/Debit Cards, NetBanking)
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          Instant verified payment via UPI, Google Pay, NetBanking, or Credit/Debit Cards with 256-bit SSL encryption.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-5 rounded-2xl border flex items-start justify-between cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'bg-neutral-50 border-neutral-900 shadow-sm ring-1 ring-neutral-900'
                        : 'bg-white border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center border ${
                          paymentMethod === 'COD'
                            ? 'border-neutral-900 bg-neutral-900'
                            : 'border-neutral-400'
                        }`}
                      >
                        {paymentMethod === 'COD' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-sm text-neutral-900">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          Pay in cash or UPI QR scan when your hardware is inspected and delivered by our team.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Final Place Order CTA */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessingOrder}
                  className="w-full py-4 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {isProcessingOrder ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{paymentMethod === 'ONLINE' ? 'Complete Secure Payment' : 'Confirm & Place Order'} • {formatCurrency(total)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full py-2 text-center text-xs text-neutral-500 hover:text-black cursor-pointer font-medium"
                >
                  ← Back to Delivery Address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Items & Pricing Summary */}
        <div className="lg:col-span-5 bg-neutral-50 rounded-3xl p-8 border border-neutral-200/90 space-y-6">
          <div className="flex justify-between items-baseline border-b border-neutral-200 pb-4">
            <h3 className="text-lg font-black text-neutral-900">Order Summary</h3>
            <span className="text-xs text-neutral-500">{checkoutItems.length} {checkoutItems.length === 1 ? 'Item' : 'Items'}</span>
          </div>

          {/* Items Preview */}
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {checkoutItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-4 text-xs">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 p-1 border border-neutral-200 flex items-center justify-center">
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-neutral-900 truncate">{product.name}</p>
                  <p className="text-[11px] text-neutral-500">Qty: {quantity}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-neutral-900">{formatCurrency(product.price * quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="border-t border-neutral-200 pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-bold text-neutral-900">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>Express Delivery</span>
              <span className="text-emerald-600 font-semibold">Free Pan-India</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promotional Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-600">
              <span>Tax / GST (Invoice Included)</span>
              <span>{tax > 0 ? formatCurrency(tax) : '₹0'}</span>
            </div>

            <div className="flex justify-between text-base font-black text-neutral-900 pt-3 border-t border-neutral-200">
              <span>Total Amount</span>
              <span className="text-lg text-neutral-900">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-neutral-500 space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Fawaz Enterprises Direct Fulfillment & Warranty Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-neutral-700" />
              <span>256-bit Encrypted Checkout • GST Tax Invoice Included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
