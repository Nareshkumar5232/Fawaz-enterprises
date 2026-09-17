import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import ProductGrid from '../../components/product/ProductGrid';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const s = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchQuery(s);
  }, [searchParams]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const catData = await categoryService.getCategories();
        setCategories(catData);
      } catch (e) {
        console.error('Error fetching categories', e);
      }
    }
    loadCategories();
  }, []);

  const [updateTick, setUpdateTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setUpdateTick((t) => t + 1);
    window.addEventListener('bytecart_products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('bytecart_products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        let results = await productService.getProducts({
          category: selectedCategory,
          search: searchQuery,
          sortBy: sortBy,
        });

        // Optional price filter
        if (priceRange === 'under-30k') {
          results = results.filter((p) => p.price < 30000);
        } else if (priceRange === '30k-60k') {
          results = results.filter((p) => p.price >= 30000 && p.price <= 60000);
        } else if (priceRange === 'above-60k') {
          results = results.filter((p) => p.price > 60000);
        }

        if (isMounted) {
          setProducts(results);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery, sortBy, priceRange, updateTick]);

  const handleCategorySelect = (catSlug) => {
    setSelectedCategory(catSlug);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (catSlug === 'all') next.delete('category');
      else next.set('category', catSlug);
      return next;
    });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!val) next.delete('search');
      else next.set('search', val);
      return next;
    });
  };

  const handleReset = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange('all');
    setSearchParams({});
  };

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E2DBD0] pb-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            The Catalogue
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#24221F] tracking-tight">
            Our Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed font-light">
            Explore our curated selection of laptops, desktops, monitors, and accessories designed for modern computing.
          </p>
        </div>

        <div className="text-xs text-[#77716A] shrink-0 font-medium">
          Showing <span className="text-[#24221F] font-bold">{products.length}</span> Products
        </div>
      </div>

      {/* Minimal Subdued Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#E2DBD0] pb-6">
        {/* Category Filter Links */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-1 text-xs">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`font-semibold uppercase tracking-[0.14em] transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'text-[#24221F] underline underline-offset-8 decoration-[#A66A4C]'
                : 'text-[#77716A] hover:text-[#24221F]'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`font-semibold uppercase tracking-[0.14em] transition-colors shrink-0 ${
                selectedCategory === cat.slug
                  ? 'text-[#24221F] underline underline-offset-8 decoration-[#A66A4C]'
                  : 'text-[#77716A] hover:text-[#24221F]'
              }`}
            >
              {cat.shortName}
            </button>
          ))}
        </div>

        {/* Right Controls: Search, Price, Sort */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#77716A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="pl-8 pr-3 py-2 rounded-full bg-[#E8E0D5]/40 text-xs text-[#24221F] placeholder-[#9E9890] focus:bg-white focus:outline-none border border-transparent focus:border-[#E2DBD0]"
            />
          </div>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="text-xs text-[#24221F] bg-[#E8E0D5]/40 rounded-full px-3 py-2 border-none outline-none cursor-pointer"
          >
            <option value="all">All Prices</option>
            <option value="under-30k">Under ₹30,000</option>
            <option value="30k-60k">₹30,000 – ₹60,000</option>
            <option value="above-60k">Above ₹60,000</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs text-[#24221F] font-medium bg-[#E8E0D5]/40 rounded-full px-3 py-2 border-none outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">New Releases</option>
          </select>

          {(selectedCategory !== 'all' || searchQuery || priceRange !== 'all') && (
            <button
              onClick={handleReset}
              className="p-2 text-[#77716A] hover:text-[#24221F] transition-colors rounded-full hover:bg-[#E8E0D5]"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Grid Layout */}
      <ProductGrid
        products={products}
        loading={loading}
        onReset={handleReset}
      />
    </div>
  );
}
