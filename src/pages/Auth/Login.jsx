import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ChevronLeft, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const rawFrom = location.state?.from;
  const from = (typeof rawFrom === 'string' ? rawFrom : rawFrom?.pathname) || location.state?.redirect || '/account';
  const isFromCheckout = from === '/checkout';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      // Toast handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex items-center justify-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-[2.5rem] overflow-hidden border border-neutral-200 bg-white shadow-xl">
        {/* Left Column: Technology Visual & Brand (Span 6) */}
        <div className="hidden lg:flex lg:col-span-6 relative bg-neutral-950 text-white p-12 flex-col justify-between overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
            alt="Technology workspace setup"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors mb-6">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-400 block">
              Customer Portal
            </span>
            <h2 className="text-3xl xl:text-4xl font-black text-white mt-2 leading-tight">
              Welcome to Fawaz Enterprises.
            </h2>
          </div>

          <div className="relative z-10 space-y-3 border-t border-neutral-800 pt-6">
            <p className="text-xs text-neutral-400 font-normal leading-relaxed">
              “Enterprise computing, precision acoustics, and certified hardware solutions.”
            </p>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
              Fawaz Enterprises • Support: 9976895663 / 6369421249
            </span>
          </div>
        </div>

        {/* Right Column: Clean Minimal Login Form (Span 6) */}
        <div className="lg:col-span-6 p-8 sm:p-14 lg:p-16 flex flex-col justify-center space-y-7 bg-white">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Logo />
              <Link
                to="/register"
                state={{ from }}
                className="text-xs text-neutral-900 hover:text-blue-600 uppercase font-bold tracking-wider"
              >
                Sign Up / Register →
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 pt-2">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Access your order timeline, saved delivery addresses, and curated hardware wishlist.
            </p>
          </div>

          {/* Checkout Notification Callout if redirected from buying */}
          {isFromCheckout && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-950">
                <p className="font-bold">Almost there!</p>
                <p className="text-blue-800 mt-0.5">
                  Sign in or create an account below. You will be seamlessly redirected back to your checkout page to complete your purchase.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 block">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-neutral-500 hover:text-black transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900 accent-neutral-900"
                />
                <span>Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-2"
            >
              {submitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* New to Fawaz Enterprises Sign Up Button */}
          <div className="pt-2 border-t border-neutral-100 text-center space-y-3">
            <p className="text-xs text-neutral-500">
              Don't have an account yet?
            </p>
            <Link
              to="/register"
              state={{ from }}
              className="inline-flex items-center justify-center w-full py-3 px-6 rounded-full border border-neutral-300 hover:border-neutral-900 text-neutral-900 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Create a New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
