import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, MapPin, Truck, Calendar } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const found = await orderService.getOrderById(orderId);
        setOrder(found);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="pt-36 pb-28 max-w-md mx-auto px-4 text-center space-y-4">
        <div className="w-12 h-12 border-2 border-[#24221F] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#77716A] font-serif">Loading order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
      {/* Confirmation Icon & Title */}
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#EAE4DA] text-[#A66A4C] mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-8 h-8 stroke-[1.8]" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 block">
          Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
          Thank you for choosing Fawaz Enterprises.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Your order has been recorded. Our team has begun hardware inspection and express courier dispatch. For any queries, reach us at +91 9976895663 / 6369421249.
        </p>
      </div>

      {/* Order Info Card */}
      {order && (
        <div className="bg-[#EAE4DA]/40 rounded-3xl p-8 sm:p-10 border border-[#E2DBD0] text-left space-y-8">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-[#E2DBD0] gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#77716A]">Order Reference</span>
              <p className="text-xl font-serif font-bold text-[#24221F]">#{order.id}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#77716A]">Total Amount</span>
              <p className="text-xl font-serif font-bold text-[#24221F]">{formatCurrency(order.total)}</p>
            </div>
          </div>

          {/* Delivery & Payment details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A66A4C]">Delivery Destination</span>
              <p className="font-semibold text-[#24221F]">{order.shippingAddress?.name}</p>
              <p className="text-[#77716A] leading-relaxed">
                {order.shippingAddress?.house}, {order.shippingAddress?.street}, {order.shippingAddress?.area}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A66A4C]">Payment Information</span>
              <p className="font-semibold text-[#24221F]">
                {order.paymentMethod === 'ONLINE' ? 'Online Payment (Verified)' : 'Cash on Delivery'}
              </p>
              <p className="text-[#77716A]">Status: <span className="font-medium text-[#24221F]">{order.paymentStatus}</span></p>
              {order.transactionId && (
                <p className="text-[11px] text-[#9E9890]">Txn: {order.transactionId}</p>
              )}
            </div>
          </div>

          {/* Items Purchased */}
          <div className="space-y-3 pt-2 border-t border-[#E2DBD0]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#77716A]">Selected Products</span>
            <div className="divide-y divide-[#E2DBD0]/60">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-white" />
                    <div>
                      <p className="font-serif font-bold text-[#24221F]">{item.name}</p>
                      <p className="text-[11px] text-[#77716A]">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-[#24221F]">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          to={`/my-orders/${orderId}`}
          className="px-8 py-3.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-[#F5F2EC] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          Track & View Order
        </Link>
        <Link
          to="/products"
          className="px-8 py-3.5 rounded-full border border-[#24221F] text-[#24221F] hover:bg-[#24221F] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
