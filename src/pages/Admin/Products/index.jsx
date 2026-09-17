import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { productsData } from '../../../data/productsData';
import { formatCurrency } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import ProductModal from './ProductModal';
import { Layers, Plus, Search, Edit2, Trash2, RefreshCw, Sparkles } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { addToast } = useToast();

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        adminService.getProducts({ category: categoryFilter, search }),
        adminService.getCategories()
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [categoryFilter]);

  const handleAddDemoProducts = async () => {
    try {
      setSeeding(true);
      try {
        const seedResult = await adminService.seedDemoProducts();
        if (seedResult?.addedCount > 0) {
          addToast(`Successfully added ${seedResult.addedCount} flagship demo products! They are live on the storefront and main page.`, 'success');
          await fetchCatalog();
          return;
        }
      } catch {}

      const allCurrent = await adminService.getProducts();
      let count = 0;
      for (const demo of productsData) {
        const exists = (allCurrent || []).some(
          p => p.slug === demo.slug || p.name?.toLowerCase() === demo.name?.toLowerCase()
        );
        if (!exists) {
          await adminService.createProduct(demo);
          count++;
        }
      }

      if (count > 0) {
        addToast(`Successfully added ${count} demo products! They are live on the storefront.`, 'success');
      } else {
        const targetCategory = categoryFilter !== 'all' ? categoryFilter : null;
        const candidates = targetCategory
          ? productsData.filter(p => p.categorySlug === targetCategory)
          : productsData;
        const base = candidates[Math.floor(Math.random() * candidates.length)] || productsData[0];
        const randId = Math.floor(100 + Math.random() * 900);
        const newDemo = {
          ...base,
          id: undefined,
          name: `${base.name} (Demo Unit #${randId})`,
          slug: `${base.slug}-unit-${randId}`,
          sku: `SKU-DEMO-${randId}`,
        };
        await adminService.createProduct(newDemo);
        addToast(`Added new demo product "${newDemo.name}" in ${newDemo.categoryName}!`, 'success');
      }

      await fetchCatalog();
    } catch (err) {
      addToast(err.message || 'Failed to add demo products', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the product catalog?`)) {
      return;
    }
    try {
      await adminService.deleteProduct(id);
      addToast(`Product "${name}" removed successfully.`, 'info');
      fetchCatalog();
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
              Hardware Inventory & Catalog
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#EAE4DA] text-[#77716A] text-[10px] font-semibold">
              {products.length} Items Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] font-bold">
            Products Catalog
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchCatalog}
            className="p-2.5 rounded-full border border-[#E2DBD0] bg-white hover:bg-[#EAE4DA] text-[#77716A] hover:text-[#24221F] transition-colors cursor-pointer"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleAddDemoProducts}
            disabled={seeding}
            className="px-4 py-2.5 rounded-full border border-[#A66A4C]/30 bg-[#F4EBE1] hover:bg-[#A66A4C] text-[#A66A4C] hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
            title="Seed high-spec demo products for main page"
          >
            <Sparkles className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'Seeding...' : 'Add Demo Products'}</span>
          </button>

          <button
            onClick={() => { setEditingProduct(null); setModalOpen(true); }}
            className="px-5 py-2.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#EAE4DA]/40 border border-[#E2DBD0] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCatalog()}
            placeholder="Search products by title, SKU, brand..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E2DBD0] text-xs text-[#24221F] focus:outline-none focus:border-[#A66A4C]"
          />
          <Search className="w-3.5 h-3.5 text-[#77716A] absolute left-3 top-2.5" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-[#E2DBD0] text-xs text-[#24221F] w-full sm:w-auto"
        >
          <option value="all">All Hardware Categories</option>
          {categories.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E2DBD0] overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#24221F] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-serif text-[#77716A] uppercase tracking-wider">Loading Product Catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <Layers className="w-8 h-8 text-[#9E9890] mx-auto" />
            <div>
              <p className="text-base font-serif text-[#24221F] font-bold">No products in catalog yet.</p>
              <p className="text-xs text-[#77716A] max-w-sm mx-auto mt-1">
                Add realistic demo flagship products with one click so they immediately show on the storefront, or create custom items.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleAddDemoProducts}
                disabled={seeding}
                className="px-5 py-2.5 rounded-full bg-[#A66A4C] hover:bg-[#8e583d] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add Demo Products</span>
              </button>
              <button
                onClick={() => { setEditingProduct(null); setModalOpen(true); }}
                className="px-5 py-2.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Custom Product</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EAE4DA]/30 border-b border-[#E2DBD0] text-[#77716A] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Brand</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Stock</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DBD0]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F5F2EC]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-[#EAE4DA] shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-serif font-bold text-[#24221F] truncate">{p.name}</p>
                            {p.featured && (
                              <span className="px-1.5 py-0.2 bg-[#A66A4C] text-white text-[9px] rounded font-sans uppercase font-bold tracking-wider">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#77716A] truncate">{p.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#77716A]">{p.categoryName}</td>
                    <td className="py-3 px-4 font-medium text-[#24221F]">{p.brand}</td>
                    <td className="py-3 px-4 font-serif font-bold text-[#24221F]">{formatCurrency(p.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : p.stock <= 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#77716A]">{p.sku}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setEditingProduct(p); setModalOpen(true); }}
                          className="p-1.5 text-[#77716A] hover:text-[#24221F] hover:bg-[#EAE4DA] rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-[#77716A] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSaved={fetchCatalog}
        />
      )}
    </div>
  );
}
