import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ExternalLink,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

// Hero Slider Data (Inspired by Reference Image & Technology Catalog)
const HERO_SLIDES = [
  {
    id: 'audio-elegance',
    tag: 'Flagship Acoustics',
    titleLine1: 'EXPERIENCE',
    titleLine2: 'UNPARALLELED AUDIO',
    titleLine3: 'ELEGANCE',
    ctaText: 'Shop Headphones',
    ctaLink: '/products?category=audio',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=2200&q=90',
    alt: 'Audiophile wearing luxury headphones in executive vehicle',
  },
  {
    id: 'computing-power',
    tag: 'Next-Gen Performance',
    titleLine1: 'ENGINEERED FOR',
    titleLine2: 'UNCOMPROMISING',
    titleLine3: 'PRODUCTIVITY',
    ctaText: 'Explore Laptops',
    ctaLink: '/products?category=laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=2200&q=90',
    alt: 'High-performance pro laptop and workstation',
  },
  {
    id: 'custom-hardware',
    tag: 'Enterprise Workstations',
    titleLine1: 'PRECISION CRAFTED',
    titleLine2: 'HARDWARE & GEAR',
    titleLine3: 'ECOSYSTEM',
    ctaText: 'Discover Hardware',
    ctaLink: '/products',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2200&q=90',
    alt: 'Advanced workstation hardware and peripherals',
  },
];

// Horizontal Category Cards matching Reference
const CATEGORY_CARDS = [
  {
    title: 'All products',
    count: '42',
    subtitle: 'Check out all our products',
    link: '/products',
    isDark: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Headphones',
    count: '18',
    subtitle: 'Surround yourself in sound',
    link: '/products?category=audio',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Earphones',
    count: '8',
    subtitle: 'Small design, great sound',
    link: '/products?category=audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Speakers',
    count: '11',
    subtitle: 'The world\'s most immersive sound',
    link: '/products?category=audio',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Laptops',
    count: '15',
    subtitle: 'Unrivaled compute speed & battery',
    link: '/products?category=laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Monitors',
    count: '12',
    subtitle: '4K color accuracy & ultra-wide',
    link: '/products?category=monitors',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Peripherals',
    count: '24',
    subtitle: 'Tactile mechanical precision',
    link: '/products?category=keyboards-mouse',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Components',
    count: '16',
    subtitle: 'Extreme power for custom rigs',
    link: '/products?category=pc-components',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
  },
];

// Featured Flagship Product Section Images
const FEATURED_FLAGSHIP = {
  id: 'flow-harmony-wireless',
  slug: 'flow-harmony-pro-wireless-anc',
  brand: 'SonicPulse Pro',
  name: 'Flow Harmony',
  price: 89100,
  originalPrice: 99000,
  rating: 5.0,
  reviewsCount: 38,
  description:
    'Experience a harmonious blend of premium sound quality and ergonomic design that allows for all-day comfortable listening.',
  specs: [
    'Custom 40mm Beryllium Acoustic Drivers',
    'Hybrid Active Noise Cancellation with Transparency Mode',
    'Up to 45 Hours of Continuous Wireless Playback',
    'Lossless LDAC & Bluetooth 5.3 Low-Latency Audio',
    'Official 2 Years Fawaz Enterprises Warranty Coverage',
  ],
  colors: [
    { name: 'Silver White', hex: '#E5E7EB' },
    { name: 'Space Black', hex: '#18181B' },
    { name: 'Champagne Gold', hex: '#D4AF37' },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=85',
  ],
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(FEATURED_FLAGSHIP.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [ambientAudioPlaying, setAmbientAudioPlaying] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const categoryScrollRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  // Slide autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Fetch catalog products
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingCatalog(true);
        const products = await productService.getProducts();
        setCatalogProducts(products || []);
      } catch (err) {
        console.error('Failed to load products for home showcase', err);
      } finally {
        setLoadingCatalog(false);
      }
    }
    loadProducts();
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleFeaturedAddToCart = () => {
    const item = {
      id: FEATURED_FLAGSHIP.id,
      slug: FEATURED_FLAGSHIP.slug,
      name: `${FEATURED_FLAGSHIP.name} (${selectedColor})`,
      price: FEATURED_FLAGSHIP.price,
      image: FEATURED_FLAGSHIP.gallery[activeGalleryIdx],
      category: 'Audio',
      brand: FEATURED_FLAGSHIP.brand,
    };
    addToCart(item, quantity);
    openCart();
  };

  const handleFeaturedBuyNow = () => {
    const item = {
      id: FEATURED_FLAGSHIP.id,
      slug: FEATURED_FLAGSHIP.slug,
      name: `${FEATURED_FLAGSHIP.name} (${selectedColor})`,
      price: FEATURED_FLAGSHIP.price,
      image: FEATURED_FLAGSHIP.gallery[activeGalleryIdx],
      category: 'Audio',
      brand: FEATURED_FLAGSHIP.brand,
    };
    addToCart(item, quantity);
    if (!isAuthenticated) {
      addToast('Please sign in or create an account to complete your purchase.', 'info');
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const copyPromoCode = () => {
    navigator.clipboard?.writeText('TECHFAWAZ');
    addToast('Coupon code TECHFAWAZ copied to clipboard! Save up to 50% on checkout.', 'success');
  };

  return (
    <div className="bg-white text-neutral-900 pb-20 selection:bg-neutral-900 selection:text-white">
      {/* =========================================================================
          1. CINEMATIC HERO BANNER (Directly Inspired by Reference Image)
          ========================================================================= */}
      <section className="relative px-3 sm:px-6 lg:px-10 pt-3 pb-8">
        <div className="relative max-w-7xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9] min-h-[520px] bg-neutral-900 shadow-xl group">
          {/* Background Images with Crossfade */}
          {HERO_SLIDES.map((slide, idx) => (
            <motion.div
              key={slide.id}
              initial={false}
              animate={{
                opacity: currentSlide === idx ? 1 : 0,
                scale: currentSlide === idx ? 1 : 1.05,
              }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-0 pointer-events-none"
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle cinematic gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </motion.div>
          ))}

          {/* FLOATING VERTICAL PILL ON THE LEFT EDGE (Exact Signature from Reference) */}
          <div className="absolute left-4 sm:left-6 top-8 sm:top-12 z-20 hidden sm:flex flex-col items-center bg-white/95 backdrop-blur-md rounded-full py-4 px-2.5 shadow-lg border border-neutral-200/80 gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-600 hover:text-black transition-colors"
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
              className="text-neutral-600 hover:text-black transition-colors"
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
              className="text-neutral-600 hover:text-black transition-colors"
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
              className="text-neutral-600 hover:text-black transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Rotated "GET 15% OFF" Pill Button */}
            <button
              onClick={copyPromoCode}
              title="Click to copy promo code TECHFAWAZ"
              className="pt-2 text-[9px] font-bold tracking-widest text-neutral-800 uppercase [writing-mode:vertical-lr] rotate-180 hover:text-sky-600 transition-colors cursor-pointer select-none"
            >
              GET 15% OFF
            </button>
          </div>

          {/* Left Hero Content: Bold Uppercase Typography */}
          <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-12 lg:p-16 max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 sm:space-y-8"
              >
                {/* Bold Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.05]">
                  <span>{HERO_SLIDES[currentSlide].titleLine1}</span>
                  <br />
                  <span>{HERO_SLIDES[currentSlide].titleLine2}</span>
                  <br />
                  <span>{HERO_SLIDES[currentSlide].titleLine3}</span>
                </h1>

                {/* White Rounded CTA Button (Exact match from Reference) */}
                <div>
                  <Link
                    to={HERO_SLIDES[currentSlide].ctaLink}
                    className="inline-flex items-center gap-2 px-8 py-3.5 sm:py-4 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-lg cursor-pointer"
                  >
                    <span>{HERO_SLIDES[currentSlide].ctaText}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls (Bottom Center/Right Dots & Arrows) */}
            <div className="flex items-center justify-between pt-8 sm:pt-12 text-white">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevSlide}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="flex items-center gap-2">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextSlide}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. BRAND INTRODUCTION SECTION (Clean Two-Column Editorial Layout)
          ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Headline with subtle underline + "Our Story" CTA */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-[1.15]">
              We believe in the
              <br />
              <span className="relative inline-block">
                power of sound
                {/* Reference subtle accent curved brush line */}
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-sky-500/80"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9C50 3 150 2 198 8"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-xs font-semibold tracking-wider transition-colors duration-200"
              >
                <span>Our Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Concise Business Copy for Fawaz Enterprises */}
          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <p>
              <strong className="text-neutral-900 font-semibold">Fawaz Enterprises</strong> is more than just an audio and technology equipment retailer. We represent the pinnacle of computing performance, professional workstations, studio acoustic gear, and everyday digital reliability. Our mission is to cater to audiophiles, engineers, developers, and businesses who simply appreciate superior build quality and uncompromising hardware.
            </p>
            <p>
              We offer everything from audiophile acoustics and high-speed laptops to custom liquid workstations and enterprise networking equipment, ensuring every frequency and computational workflow delivers immaculate results.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HORIZONTALLY ARRANGED CATEGORY CARDS (Exact match to Reference)
          ========================================================================= */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              Browse Hardware
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-0.5">
              Categories
            </h3>
          </div>

          {/* Arrow navigation for horizontal scroll */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCategories('left')}
              className="p-2 rounded-full border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCategories('right')}
              className="p-2 rounded-full border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Category Cards Track */}
        <div
          ref={categoryScrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {CATEGORY_CARDS.map((cat, idx) => (
            <Link
              key={cat.title}
              to={cat.link}
              className={`shrink-0 w-[240px] sm:w-[270px] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md group snap-start ${
                cat.isDark ? 'bg-neutral-900 text-white' : 'bg-neutral-100/80 text-neutral-900'
              }`}
            >
              {/* Product Category Visual */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Title & Count Superscript */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold tracking-tight">
                    {cat.title}
                    <sup className="text-[10px] ml-1 font-semibold opacity-70">{cat.count}</sup>
                  </h4>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
                      cat.isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  />
                </div>
                <p
                  className={`text-[11px] mt-1 leading-snug line-clamp-1 ${
                    cat.isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  {cat.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. WIDE PROMOTIONAL BANNER WITH DARK OVERLAY (Reference: "Sound. Sculpted.")
          ========================================================================= */}
      <section className="py-12 px-3 sm:px-6 lg:px-10">
        <div className="relative max-w-7xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[16/8] lg:aspect-[21/8] min-h-[440px] shadow-2xl flex items-center justify-center text-center p-8">
          {/* Background Ambient Imagery */}
          <img
            src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=2000&q=85"
            alt="Sound Sculpted Speaker Hardware"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

          {/* Centered Content */}
          <div className="relative z-10 max-w-xl mx-auto space-y-4 text-white">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Sound. Sculpted.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-md mx-auto leading-relaxed">
              A flagship acoustic speaker and workstation series that excites the eye and ear from every angle.
            </p>

            <div className="pt-3">
              <Link
                to="/products?category=audio"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
              >
                <span>Shop Echo Elegance</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Bottom Right Interactive Ambient Pause/Play Button (Exact from Reference) */}
          <button
            onClick={() => setAmbientAudioPlaying(!ambientAudioPlaying)}
            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label={ambientAudioPlaying ? 'Pause ambient preview' : 'Play ambient preview'}
            title={ambientAudioPlaying ? 'Pause Ambient sound' : 'Preview Ambient sound'}
          >
            {ambientAudioPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>
        </div>
      </section>

      {/* =========================================================================
          5. PREMIUM FEATURED PRODUCT SECTION (Direct match to reference bottom section)
          ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ROTATING CIRCULAR BADGE (Exact match from Reference: "• PRODUCT • FEATURED •") */}
        <div className="flex flex-col items-center justify-center pb-8 sm:pb-12">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Spinning Circular SVG Text */}
            <div className="absolute inset-0 animate-spin-slow">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[9.5px] font-bold tracking-[0.24em] uppercase fill-neutral-800">
                  <textPath href="#circlePath" startOffset="0%">
                    • PRODUCT • FEATURED • FAWAZ •
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Central Icon */}
            <div className="relative z-10 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shadow-xs">
              <Star className="w-4 h-4 fill-neutral-800" />
            </div>
          </div>
        </div>

        {/* 3-Column Interactive Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Col 1: Vertical Clickable Thumbnail Column */}
          <div className="lg:col-span-1 flex lg:flex-col gap-3 justify-center order-2 lg:order-1">
            {FEATURED_FLAGSHIP.gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveGalleryIdx(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer p-1 bg-neutral-50 ${
                  activeGalleryIdx === idx
                    ? 'border-neutral-900 shadow-md scale-105'
                    : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                }`}
                aria-label={`View product image ${idx + 1}`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </button>
            ))}
          </div>

          {/* Col 2: Dominant Product Visual */}
          <div className="lg:col-span-6 flex items-center justify-center order-1 lg:order-2">
            <div className="relative aspect-square w-full max-w-md rounded-3xl bg-neutral-50 p-6 flex items-center justify-center border border-neutral-100 shadow-xs">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeGalleryIdx}
                  src={FEATURED_FLAGSHIP.gallery[activeGalleryIdx]}
                  alt={FEATURED_FLAGSHIP.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Col 3: Specifications, Pricing, Variant & Purchase Action */}
          <div className="lg:col-span-5 space-y-6 order-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {FEATURED_FLAGSHIP.brand}
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight mt-1">
                {FEATURED_FLAGSHIP.name}
              </h3>

              {/* Price & Rating (Matching Reference: Rs. 89,100.00) */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-neutral-800">
                    5.0 <span className="text-neutral-400 font-normal">({FEATURED_FLAGSHIP.reviewsCount} reviews)</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-neutral-900">
                    Rs. {FEATURED_FLAGSHIP.price.toLocaleString('en-IN')}.00
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {FEATURED_FLAGSHIP.description}
            </p>

            {/* Spec Bullet points */}
            <div className="space-y-1.5 pt-1">
              {FEATURED_FLAGSHIP.specs.slice(0, 3).map((spec, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>

            {/* Color Swatches */}
            <div className="pt-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                Color: <span className="text-neutral-900 font-semibold">{selectedColor}</span>
              </span>
              <div className="flex items-center gap-2.5">
                {FEATURED_FLAGSHIP.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                      selectedColor === c.name
                        ? 'border-neutral-900 ring-2 ring-neutral-300 ring-offset-2'
                        : 'border-neutral-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={`Select ${c.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Selector + Add to Cart + Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-neutral-300 rounded-full px-3 py-2 bg-neutral-50 text-xs font-semibold">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2 text-neutral-500 hover:text-black cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2 text-neutral-500 hover:text-black cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleFeaturedAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleFeaturedBuyNow}
                className="w-full py-3.5 px-6 rounded-full border border-neutral-900 hover:bg-neutral-100 active:scale-98 text-neutral-900 text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buy Now with Express Delivery</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. LIVE TECHNOLOGY HARDWARE SHOWCASE (Laptops, Desktops, Components)
          ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              Curated Computing & Hardware
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
              Enterprise Workstations & Gear
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-900 hover:text-blue-600 transition-colors uppercase tracking-wider"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {catalogProducts.slice(0, 8).map((product) => {
            const inWishlist = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="group rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-400/80 p-4 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center mb-4">
                  <Link to={`/products/${product.slug || product.id}`} className="w-full h-full">
                    <img
                      src={product.image || product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-neutral-700 shadow-sm transition-transform active:scale-90 cursor-pointer"
                    aria-label="Toggle Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        inWishlist ? 'fill-red-500 text-red-500' : 'text-neutral-700'
                      }`}
                    />
                  </button>

                  {product.tag && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-neutral-900/90 text-white text-[10px] font-semibold uppercase tracking-wider">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="uppercase font-medium tracking-wider">{product.brand || 'Fawaz'}</span>
                    <span className="capitalize">{product.categoryName || product.category}</span>
                  </div>

                  <Link to={`/products/${product.slug || product.id}`} className="block">
                    <h4 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-2 leading-snug">
                      {product.name}
                    </h4>
                  </Link>

                  <p className="text-[11px] text-neutral-500 line-clamp-1">
                    {product.tagline || product.description}
                  </p>
                </div>

                {/* Price & Quick Add */}
                <div className="pt-4 mt-2 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm sm:text-base font-extrabold text-neutral-900">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[11px] text-neutral-400 line-through ml-1.5">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      openCart();
                    }}
                    className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white transition-colors cursor-pointer"
                    title="Add to Cart"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          7. TRUST & ENTERPRISE CLIENT SUPPORT PILLARS
          ========================================================================= */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-neutral-50 border border-neutral-200/80">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white shadow-xs text-neutral-900 border border-neutral-200">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Pan-India Express Dispatch
              </h4>
              <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                Free standard shipping on orders above ₹2,999 with verified courier tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white shadow-xs text-neutral-900 border border-neutral-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                GST Tax Invoicing
              </h4>
              <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                Official B2B & B2C tax invoices with GST input credit support (GSTIN: 33AEYPF9750J1ZV).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white shadow-xs text-neutral-900 border border-neutral-200">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                100% Genuine Hardware
              </h4>
              <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                Factory sealed laptops, computing parts, and audio gear with authorized warranty.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white shadow-xs text-neutral-900 border border-neutral-200">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Direct Client Support
              </h4>
              <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                Talk to hardware specialists at 9976895663 / 6369421249 for bulk procurement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
