import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ArrowUpRight,
  Package,
  MapPin,
  LogOut,
  ChevronDown,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSearch } from '../../context/SearchContext';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { name: 'Shop', path: '/products' },
  { name: 'Collections', path: '/categories' },
  { name: 'Explore', path: '/products?featured=true' },
  { name: 'Contact', path: '/contact' },
  { name: 'About', path: '/about' },
];

const ANNOUNCEMENTS = [
  'Save up to 50% with code TECHFAWAZ',
  'Free Express Delivery Across India on Orders Above ₹2,999',
  'Authorized Hardware & Enterprise Tech Solutions • GST Invoice Included',
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const dropdownRef = useRef(null);

  const { totalItemsCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { openSearch } = useSearch();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Announcement auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close account dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setAccountDropdownOpen(false);
    navigate('/');
  };

  const nextAnnouncement = () => {
    setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const prevAnnouncement = () => {
    setAnnouncementIdx((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  return (
    <>
      {/* 1. SLIM TOP ANNOUNCEMENT BAR (Matching Reference Image) */}
      <div className="bg-[#0A0A0C] text-neutral-300 text-[11px] py-2 px-4 sm:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Social Icons */}
          <div className="hidden md:flex items-center gap-3 text-neutral-400">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

          {/* Center Announcement Ticker */}
          <div className="flex items-center justify-center gap-2 mx-auto sm:mx-0">
            <button
              onClick={prevAnnouncement}
              className="text-neutral-400 hover:text-white transition-colors p-0.5 cursor-pointer"
              aria-label="Previous announcement"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-medium tracking-wide text-neutral-200 text-center select-none text-[11px] sm:text-xs min-w-[240px] sm:min-w-[320px]">
              {ANNOUNCEMENTS[announcementIdx]}
            </span>
            <button
              onClick={nextAnnouncement}
              className="text-neutral-400 hover:text-white transition-colors p-0.5 cursor-pointer"
              aria-label="Next announcement"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Language & Currency */}
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-neutral-400">
            <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <span>English</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <span>India (INR ₹)</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Minimal White, Clean Typography) */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 border-b ${
          scrolled ? 'border-neutral-200 shadow-xs py-3' : 'border-neutral-100 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Brand Logo */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Center Navigation Links (Matching Reference: Shop, Collections, Explore, Contact, About) */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[13px] font-medium tracking-normal transition-colors relative py-1 ${
                      isActive
                        ? 'text-neutral-900 font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-neutral-900'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Trigger */}
              <button
                onClick={openSearch}
                className="p-2 rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Search technology items"
                aria-label="Search"
              >
                <Search className="w-4 h-4 stroke-[1.9]" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 stroke-[1.9]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-neutral-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative p-2 rounded-full text-neutral-900 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Shopping Cart"
                title="Cart"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.9]" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-neutral-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 text-xs font-medium transition-colors cursor-pointer"
                    aria-label="User Account"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline max-w-[90px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-neutral-500" />
                  </button>

                  <AnimatePresence>
                    {accountDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2.5 border-b border-neutral-100 bg-neutral-50">
                          <p className="text-xs font-bold text-neutral-900 truncate">{user?.name}</p>
                          <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
                        </div>

                        <div className="py-1">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                              <span>Admin Console</span>
                            </Link>
                          )}
                          <Link
                            to="/account"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-neutral-400" />
                            <span>My Account</span>
                          </Link>
                          <Link
                            to="/my-orders"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                          >
                            <Package className="w-3.5 h-3.5 text-neutral-400" />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                          >
                            <Heart className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Wishlist</span>
                          </Link>
                          <Link
                            to="/account/addresses"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Saved Addresses</span>
                          </Link>
                        </div>

                        <div className="border-t border-neutral-100 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Sign In / Account"
                  aria-label="User Account"
                >
                  <User className="w-4 h-4 stroke-[1.9]" />
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-neutral-800 hover:text-black transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 stroke-[1.9]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col justify-between p-7 z-10 border-l border-neutral-200"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                  <Logo />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-neutral-500 hover:text-black transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openSearch();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-100 text-neutral-600 text-xs font-medium"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search laptops, audio, accessories...</span>
                  </button>
                </div>

                <nav className="mt-8 flex flex-col space-y-4">
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-2 text-lg font-medium transition-colors ${
                          isActive ? 'text-neutral-900 font-bold' : 'text-neutral-600'
                        }`
                      }
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-40" />
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-neutral-100 space-y-2.5">
                  <Link
                    to="/wishlist"
                    className="flex items-center justify-between py-2 text-xs font-semibold text-neutral-800"
                  >
                    <span>Wishlist ({wishlistCount})</span>
                    <Heart className="w-4 h-4 text-neutral-600" />
                  </Link>

                  {isAuthenticated ? (
                    <>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center justify-between py-2 text-xs font-semibold text-blue-600"
                        >
                          <span>Admin Console</span>
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                        </Link>
                      )}
                      <Link
                        to="/my-orders"
                        className="flex items-center justify-between py-2 text-xs font-semibold text-neutral-800"
                      >
                        <span>My Orders</span>
                        <Package className="w-4 h-4 text-neutral-500" />
                      </Link>
                      <Link
                        to="/account"
                        className="flex items-center justify-between py-2 text-xs font-semibold text-neutral-800"
                      >
                        <span>My Account ({user?.name})</span>
                        <User className="w-4 h-4 text-neutral-500" />
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full text-center py-3 rounded-full bg-neutral-900 text-white text-xs font-semibold mt-4 hover:bg-neutral-800 transition-colors"
                    >
                      Sign In / Register
                    </Link>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 text-xs text-neutral-500">
                <p className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                  FAWAZ ENTERPRISES
                </p>
                <p>Support: 9976895663 / 6369421249</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">GSTIN: 33AEYPF9750J1ZV</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
