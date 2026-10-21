import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { categoryService } from '../../services/categoryService';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await categoryService.getCategories();
        setCategories(list || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3 border-b border-neutral-200 pb-8">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
          Hardware Collections
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
          Technology & Gear Categories
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
          Explore specialized computing hardware, professional laptops, displays, studio acoustics, and high-performance components backed by Fawaz Enterprises.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-4/3 bg-neutral-100 rounded-2xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-500 mx-auto flex items-center justify-center">
            <Package className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900">No categories found.</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Categories configured in the catalogue will be displayed here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id || idx}
              to={`/products?category=${cat.slug}`}
              className="group rounded-3xl p-5 bg-white hover:bg-neutral-50 border border-neutral-200/90 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-neutral-100">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <Package className="w-8 h-8 stroke-[1.2]" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {cat.description || cat.tagline}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-900 group-hover:text-blue-600">
                <span>View Products</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
