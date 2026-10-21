import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import ProductGrid from '../../components/product/ProductGrid';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state sync
  const categoryFromUrl = searchParams.get('category') || 'all';
  const searchFromUrl = searchParams.get('search') || '';
  const sortFromUrl = searchParams.get('sortBy') || 'featured';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [sortBy, setSortBy] = useState(sortFromUrl);
  const [priceRange, setPriceRange] = useState('all');

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

  // Sync state if URL changes externally
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('search') || '');
    setSortBy(searchParams.get('sortBy') || 'featured');
  }, [searchParams]);

  // Load Categories once
  useEffect(() => {
    categoryService.getCategories().then((res) => {
      setCategories(res || []);
    });
  }, []);

  // Fetch filtered products with debounce
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const params = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined,
          sortBy,
        };

        if (priceRange === 'under-30k') params.priceRange = { max: 30000 };
        else if (priceRange === '30k-60k') params.priceRange = { max: 60000 };

        const data = await productService.getProducts(params);

        if (isMounted) {
          let list = data || [];
          if (priceRange === '30k-60k') {
            list = list.filter((p) => p.price >= 30000 && p.price <= 60000);
          } else if (priceRange === 'above-60k') {
            list = list.filter((p) => p.price > 60000);
          }
          setProducts(list);
        }
      } catch (err) {
        console.error('Error fetching filtered products', err);
      } finally {
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
    <div className="pt-28 md:pt-36 pb-28 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            Fawaz Enterprises Hardware Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            Certified Hardware & Gear
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            Explore laptops, desktops, monitors, PC components, studio audio, and accessories designed for peak performance and everyday reliability.
          </p>
        </div>

        <div className="text-xs text-neutral-500 shrink-0 font-medium">
          Showing <span className="text-neutral-900 font-bold">{products.length}</span> Products
        </div>
      </div>

      {/* Clean Technology Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-neutral-200 pb-6">
        {/* Category Filter Links */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 text-xs">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-2 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80'
              }`}
            >
              {cat.shortName}
            </button>
          ))}
        </div>

        {/* Right Controls: Search, Price, Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search hardware..."
              className="pl-8 pr-3 py-2 rounded-full bg-neutral-100 text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none border border-neutral-200 focus:border-neutral-900 transition-all"
            />
          </div>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="text-xs text-neutral-800 bg-neutral-100 rounded-full px-3 py-2 border border-neutral-200 outline-none cursor-pointer hover:bg-neutral-200/60 transition-colors"
          >
            <option value="all">All Prices</option>
            <option value="under-30k">Under ₹30,000</option>
            <option value="30k-60k">₹30,000 – ₹60,000</option>
            <option value="above-60k">Above ₹60,000</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs text-neutral-800 font-medium bg-neutral-100 rounded-full px-3 py-2 border border-neutral-200 outline-none cursor-pointer hover:bg-neutral-200/60 transition-colors"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">New Releases</option>
          </select>

          {(selectedCategory !== 'all' || searchQuery || priceRange !== 'all') && (
            <button
              onClick={handleReset}
              className="p-2 text-neutral-500 hover:text-black transition-colors rounded-full hover:bg-neutral-100 cursor-pointer"
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
