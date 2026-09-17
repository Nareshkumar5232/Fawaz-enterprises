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
  AlertCircle
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
    directBuyItem,
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

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
      setAddressLoading(true);
      try {
        const list = await addressService.getAddresses(user?.id);
        setAddresses(list);
        if (list.length > 0) {
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

  // If no items in checkout
  if (checkoutItems.length === 0) {
    return (
      <div className="pt-36 pb-28 max-w-md mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-serif text-[#24221F]">No items to checkout</h2>
        <p className="text-xs text-[#77716A]">Your cart is empty. Please select product items to proceed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#24221F] text-white text-xs font-semibold uppercase tracking-wider"
        >
          <span>Explore Collection</span>
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
      addToast('Delivery address saved.', 'success');
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
          customerEmail: user?.email || 'guest@bytecart.in',
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
        userId: user?.id || 'usr-guest',
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
      <div className="border-b border-[#E2DBD0] pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
              Direct Brand Fulfillment
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#24221F] tracking-tight">
              Secure Checkout
            </h1>
          </div>

          {/* Step Badges */}
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 pb-1 border-b-2 transition-colors ${
                currentStep === 1
                  ? 'border-[#24221F] text-[#24221F]'
                  : 'border-transparent text-[#77716A]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#EAE4DA] text-[#24221F] flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Delivery Address</span>
            </button>

            <span className="text-[#9E9890]">→</span>

            <button
              onClick={() => {
                if (selectedAddressId) setCurrentStep(2);
              }}
              className={`flex items-center gap-2 pb-1 border-b-2 transition-colors ${
                currentStep === 2
                  ? 'border-[#24221F] text-[#24221F]'
                  : 'border-transparent text-[#77716A]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#EAE4DA] text-[#24221F] flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Payment & Place Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guest Notice if not authenticated */}
      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-[#EAE4DA]/50 border border-[#E2DBD0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#24221F]">
            <User className="w-4 h-4 text-[#A66A4C]" />
            <span>Checking out as Guest. Have an account?</span>
          </div>
          <Link
            to="/login"
            state={{ redirect: '/checkout' }}
            className="px-4 py-1.5 rounded-full border border-[#24221F] text-[#24221F] hover:bg-[#24221F] hover:text-white font-semibold uppercase tracking-wider text-[10px] transition-colors"
          >
            Sign In to Account
          </Link>
        </div>
      )}

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
                <h2 className="text-xl font-serif text-[#24221F]">
                  Select Delivery Address
                </h2>
                {!isAddingNewAddress && (
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A66A4C] hover:text-[#24221F]"
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
                      className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                        selectedAddressId === addr.id
                          ? 'bg-[#EAE4DA]/60 border-[#24221F] shadow-xs'
                          : 'bg-[#F5F2EC] border-[#E2DBD0] hover:border-[#77716A]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border ${
                              selectedAddressId === addr.id
                                ? 'border-[#24221F] bg-[#24221F]'
                                : 'border-[#9E9890]'
                            }`}
                          >
                            {selectedAddressId === addr.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-sm text-[#24221F]">{addr.name}</span>
                              <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#24221F] text-[#F5F2EC]">
                                {addr.tag || 'HOME'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[9px] text-[#A66A4C] font-semibold">Default</span>
                              )}
                            </div>
                            <p className="text-xs text-[#77716A] mt-1 leading-relaxed">
                              {addr.house}, {addr.street}, {addr.area}
                              <br />
                              {addr.city}, {addr.state} – {addr.pincode}
                            </p>
                            <p className="text-xs text-[#24221F] font-medium mt-1">Phone: {addr.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Address Form */}
              {isAddingNewAddress && (
                <form onSubmit={handleSaveNewAddress} className="bg-[#EAE4DA]/40 rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E2DBD0]">
                    <h3 className="text-base font-serif text-[#24221F]">New Delivery Address</h3>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="text-xs text-[#77716A] hover:text-[#24221F]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77716A]">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        placeholder="Recipient name"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:outline-none focus:border-[#A66A4C]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77716A]">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="+91 98400 12345"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:outline-none focus:border-[#A66A4C]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77716A]">House / Flat / Building *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.house}
                      onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                      placeholder="e.g. Flat No. 2, Plot No. 1051, I Block"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:outline-none focus:border-[#A66A4C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77716A]">Street / Road *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="e.g. 35th Street, 18th Main Road"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:outline-none focus:border-[#A66A4C]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77716A]">Area / Locality *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.area}
                        onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                        placeholder="e.g. Anna Nagar"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:outline-none focus:border-[#A66A4C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77716A]">City *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:outline-none focus:border-[#A66A4C]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77716A]">State *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:outline-none focus:border-[#A66A4C]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77716A]">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="600040"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:outline-none focus:border-[#A66A4C]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#24221F] text-[#F5F2EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#A66A4C] transition-colors"
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
                  className="w-full py-4 px-6 rounded-full bg-[#24221F] hover:bg-[#A66A4C] active:scale-[0.99] text-[#F5F2EC] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
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
              <div className="p-5 rounded-3xl bg-[#EAE4DA]/40 border border-[#E2DBD0] flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A4C]">
                    Delivering to
                  </span>
                  <p className="text-sm font-serif font-bold text-[#24221F]">{selectedAddress?.name}</p>
                  <p className="text-xs text-[#77716A]">
                    {selectedAddress?.house}, {selectedAddress?.street}, {selectedAddress?.area}, {selectedAddress?.city} – {selectedAddress?.pincode}
                  </p>
                  <p className="text-xs text-[#77716A]">Phone: {selectedAddress?.phone}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#A66A4C] hover:text-[#24221F] underline uppercase tracking-wider"
                >
                  Change
                </button>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4">
                <h2 className="text-xl font-serif text-[#24221F]">
                  Select Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Option 1: Online Payment */}
                  <label
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-5 rounded-3xl border flex items-start justify-between cursor-pointer transition-all ${
                      paymentMethod === 'ONLINE'
                        ? 'bg-[#EAE4DA]/60 border-[#24221F] shadow-xs'
                        : 'bg-[#F5F2EC] border-[#E2DBD0] hover:border-[#77716A]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center border ${
                          paymentMethod === 'ONLINE'
                            ? 'border-[#24221F] bg-[#24221F]'
                            : 'border-[#9E9890]'
                        }`}
                      >
                        {paymentMethod === 'ONLINE' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#A66A4C]" />
                          <span className="font-serif font-bold text-sm text-[#24221F]">
                            Online Payment (UPI, Cards, NetBanking)
                          </span>
                        </div>
                        <p className="text-xs text-[#77716A]">
                          Instant payment via UPI, Google Pay, NetBanking, or Credit/Debit Cards with 256-bit SSL encryption.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-5 rounded-3xl border flex items-start justify-between cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'bg-[#EAE4DA]/60 border-[#24221F] shadow-xs'
                        : 'bg-[#F5F2EC] border-[#E2DBD0] hover:border-[#77716A]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center border ${
                          paymentMethod === 'COD'
                            ? 'border-[#24221F] bg-[#24221F]'
                            : 'border-[#9E9890]'
                        }`}
                      >
                        {paymentMethod === 'COD' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-[#A66A4C]" />
                          <span className="font-serif font-bold text-sm text-[#24221F]">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <p className="text-xs text-[#77716A]">
                          Pay in cash or UPI QR scan when your order is delivered by our secure delivery team.
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
                  className="w-full py-4 px-6 rounded-full bg-[#24221F] hover:bg-[#A66A4C] active:scale-[0.99] disabled:opacity-50 text-[#F5F2EC] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
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
                  className="w-full py-2 text-center text-xs text-[#77716A] hover:text-[#24221F]"
                >
                  ← Back to Delivery Address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Items & Pricing Summary */}
        <div className="lg:col-span-5 bg-[#EAE4DA]/40 rounded-3xl p-8 border border-[#E2DBD0] space-y-6">
          <div className="flex justify-between items-baseline border-b border-[#E2DBD0] pb-4">
            <h3 className="text-lg font-serif text-[#24221F]">Order Summary</h3>
            <span className="text-xs text-[#77716A]">{checkoutItems.length} {checkoutItems.length === 1 ? 'Item' : 'Items'}</span>
          </div>

          {/* Items Preview */}
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {checkoutItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-4 text-xs">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-bold text-[#24221F] truncate">{product.name}</p>
                  <p className="text-[11px] text-[#77716A]">Qty: {quantity}</p>
                </div>
                <span className="font-serif font-semibold text-[#24221F] text-right">
                  {formatCurrency(product.price * quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-[#E2DBD0] text-xs">
            <div className="flex justify-between text-[#77716A]">
              <span>Subtotal</span>
              <span className="font-serif font-semibold text-[#24221F]">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-[#77716A]">
              <span>Delivery & Assembly</span>
              <span className="text-[#A66A4C] font-semibold">Complimentary</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-[#A66A4C]">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#77716A]">
              <span>Tax / GST</span>
              <span>{tax > 0 ? formatCurrency(tax) : '₹0'}</span>
            </div>

            <div className="flex justify-between text-base font-serif font-bold text-[#24221F] pt-3 border-t border-[#E2DBD0]">
              <span>Total Amount</span>
              <span className="text-lg text-[#24221F]">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#77716A] space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A66A4C]" />
              <span>Bytecart Direct Fulfillment Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#A66A4C]" />
              <span>256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
