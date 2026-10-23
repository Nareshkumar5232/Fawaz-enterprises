import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Layers,
  FolderTree,
  Boxes,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Tag,
  ShieldCheck
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/products', label: 'Products', icon: Layers },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/brands', label: 'Brands', icon: Tag },
    { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2EC] flex text-[#24221F] font-sans antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#24221F]/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#24221F] text-[#F5F2EC] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-20 px-6 border-b border-[#3D3A36] flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3 group">
              <img
                src="/logo-mark.png"
                alt="Fawaz"
                className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div>
                <span className="font-black text-base tracking-tight text-white uppercase">
                  FAWAZ
                </span>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-blue-400 font-semibold">
                  Administration
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-[#9E9890] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-[#A66A4C] text-white shadow-xs'
                        : 'text-[#9E9890] hover:bg-[#3D3A36]/60 hover:text-[#F5F2EC]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#3D3A36] space-y-3">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#3D3A36]/40 hover:bg-[#3D3A36] text-[11px] text-[#D8D2C7] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#A66A4C]" />
              <span>Customer Storefront</span>
            </span>
            <span className="text-[10px] text-[#9E9890]">Live ↗</span>
          </Link>

          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#A66A4C]/30 text-[#A66A4C] border border-[#A66A4C]/40 flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-[#9E9890] truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#9E9890] hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Topbar */}
        <header className="h-16 sticky top-0 z-30 bg-[#F5F2EC]/90 backdrop-blur-md border-b border-[#E2DBD0] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-[#24221F] lg:hidden hover:bg-[#EAE4DA] rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden sm:inline">
                Fawaz Enterprises Management Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-[#EAE4DA] border border-[#E2DBD0] text-[11px] font-semibold text-[#24221F] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Production Live</span>
            </div>
            <Link
              to="/admin/settings"
              className="p-2 rounded-full text-[#77716A] hover:text-[#24221F] hover:bg-[#EAE4DA] transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
