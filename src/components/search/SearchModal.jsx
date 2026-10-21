import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { formatCurrency } from '../../utils/formatters';

export default function SearchModal() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useSearch();
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      categoryService.getCategories().then((cats) => setCategories(cats || []));
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await productService.getProducts({ search: searchQuery });
        if (isMounted) {
          setResults(data || []);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSelectProduct = (slug) => {
    closeSearch();
    setSearchQuery('');
    navigate(`/products/${slug}`);
  };

  const handleApplyCategory = (catSlug) => {
    closeSearch();
    setSearchQuery('');
    navigate(`/products?category=${catSlug}`);
  };

  const handleViewAllResults = () => {
    closeSearch();
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeSearch}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden z-10 flex flex-col max-h-[80vh]"
        >
          {/* Header & Input */}
          <div className="flex items-center px-6 py-5 border-b border-neutral-100 gap-3">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleViewAllResults();
                }
              }}
              placeholder="Search laptops, audio, monitors, components..."
              className="flex-1 text-base sm:text-lg text-neutral-900 placeholder-neutral-400 bg-transparent border-none outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-neutral-500 bg-neutral-100 rounded border border-neutral-200">
              ESC
            </kbd>
          </div>

          {/* Body content */}
          <div className="overflow-y-auto p-6 space-y-4 flex-1">
            {/* Categories when query is empty */}
            {!searchQuery.trim() && categories.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Popular Categories
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleApplyCategory(cat.slug)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="py-12 flex flex-col items-center justify-center text-neutral-400 space-y-2">
                <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs">Searching Fawaz Enterprises catalog...</p>
              </div>
            )}

            {/* Results List */}
            {!loading && searchQuery.trim() !== '' && results.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Matching Hardware ({results.length})
                </p>
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug || product.id)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200/80 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0 p-1 flex items-center justify-center">
                        {product.images?.[0] || product.image ? (
                          <img
                            src={product.images?.[0] || product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-[11px] text-neutral-500">{product.categoryName || product.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <span className="text-xs font-black text-neutral-900">
                        {formatCurrency(product.price)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && searchQuery.trim() !== '' && results.length === 0 && (
              <div className="py-12 text-center space-y-2">
                <p className="text-base font-bold text-neutral-900">No hardware found</p>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  We couldn’t find any matches for "{searchQuery}". Try searching for laptops, keyboards, monitors, or audio.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
