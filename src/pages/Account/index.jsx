import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ArrowRight,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { addressService } from '../../services/addressService';
import { formatCurrency } from '../../utils/formatters';

export default function Account() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [recentOrders, setRecentOrders] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { redirect: '/account' }, replace: true });
      return;
    }

    async function loadAccountData() {
      if (!user) return;
      setLoading(true);
      try {
        const [ordersList, addressesList] = await Promise.all([
          orderService.getOrders(user.id),
          addressService.getAddresses(user.id),
        ]);
        setRecentOrders((ordersList || []).slice(0, 2));
        setDefaultAddress((addressesList || []).find((a) => a.isDefault) || addressesList?.[0] || null);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadAccountData();
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <div className="pt-36 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse">
        <div className="h-20 bg-neutral-100 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-neutral-100 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Account Management
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-neutral-900 tracking-tight">
            Hello, {user?.name || 'Customer'}
          </h1>
          <p className="text-xs text-neutral-500">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-full border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-900 text-xs font-semibold uppercase tracking-wider transition-colors self-start sm:self-auto cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Account Navigation Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/my-orders"
          className="p-6 rounded-3xl bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-all space-y-3 block group shadow-xs"
        >
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-neutral-900 group-hover:text-neutral-700 transition-colors">
            My Orders
          </h3>
          <p className="text-xs text-neutral-500">Track current dispatches and previous product orders.</p>
        </Link>

        <Link
          to="/account/addresses"
          className="p-6 rounded-3xl bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-all space-y-3 block group shadow-xs"
        >
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-neutral-900 group-hover:text-neutral-700 transition-colors">
            Delivery Addresses
          </h3>
          <p className="text-xs text-neutral-500">Manage saved residential and workplace destinations.</p>
        </Link>

        <Link
          to="/account/profile"
          className="p-6 rounded-3xl bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-all space-y-3 block group shadow-xs"
        >
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-neutral-900 group-hover:text-neutral-700 transition-colors">
            Profile & Security
          </h3>
          <p className="text-xs text-neutral-500">Update personal details, contact number, and password.</p>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-serif text-neutral-900">Recent Orders</h2>
          {recentOrders.length > 0 && (
            <Link
              to="/my-orders"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:underline"
            >
              View All ({recentOrders.length}) →
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-center text-xs text-neutral-500">
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-neutral-900">#{order.id}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-950 text-white">
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {order.items?.length} {order.items?.length === 1 ? 'Item' : 'Items'} • {formatCurrency(order.total)}
                  </p>
                </div>

                <Link
                  to={`/my-orders/${order.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600"
                >
                  <span>Order Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Default Address Snapshot */}
      <div className="space-y-3">
        <h2 className="text-xl font-serif text-neutral-900">Delivery Address</h2>
        {defaultAddress ? (
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Default Delivery Destination
              </span>
              <Link
                to="/account/addresses"
                className="text-xs text-neutral-500 hover:text-neutral-900 underline"
              >
                Manage
              </Link>
            </div>
            <p className="font-serif font-bold text-sm text-neutral-900">{defaultAddress.name} ({defaultAddress.tag})</p>
            <p className="text-xs text-neutral-500">
              {defaultAddress.house}, {defaultAddress.street}, {defaultAddress.area}, {defaultAddress.city} – {defaultAddress.pincode}
            </p>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-center space-y-3">
            <p className="text-xs text-neutral-500">No saved addresses.</p>
            <Link
              to="/account/addresses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-950 text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Add Address</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
