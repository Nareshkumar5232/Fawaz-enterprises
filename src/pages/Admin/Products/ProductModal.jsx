import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useToast } from '../../../context/ToastContext';
import { productsData } from '../../../data/productsData';
import { X, Save, Sparkles } from 'lucide-react';

export default function ProductModal({ product, categories, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: '',
    categorySlug: categories[0]?.slug || 'laptops',
    categoryName: categories[0]?.name || 'Laptops',
    brand: '',
    price: '',
    originalPrice: '',
    stock: 10,
    inStock: true,
    sku: '',
    tagline: '',
    description: '',
    images: '',
    processor: '',
    ram: '',
    storage: '',
    gpu: '',
    display: '',
    os: '',
    weight: '',
    warranty: '1 Year Official Warranty'
  });

  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        categorySlug: product.categorySlug || categories[0]?.slug || 'laptops',
        categoryName: product.categoryName || categories[0]?.name || 'Laptops',
        brand: product.brand || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        stock: product.stock !== undefined ? product.stock : 10,
        inStock: product.inStock !== false,
        sku: product.sku || '',
        tagline: product.tagline || '',
        description: product.description || '',
        images: Array.isArray(product.images) ? product.images.join(', ') : (product.images || ''),
        processor: product.specs?.processor || '',
        ram: product.specs?.ram || '',
        storage: product.specs?.storage || '',
        gpu: product.specs?.gpu || '',
        display: product.specs?.display || '',
        os: product.specs?.os || '',
        weight: product.weight || '',
        warranty: product.warranty || '1 Year Official Warranty'
      });
    }
  }, [product, categories]);

  const handleFillDemoPreset = (presetIndex = 0) => {
    const preset = productsData[presetIndex] || productsData[0];
    if (!preset) return;
    const catMatch = categories.find(c => c.slug === preset.categorySlug);
    const randSuffix = Math.floor(100 + Math.random() * 900);
    setFormData({
      name: `${preset.name} (Unit ${randSuffix})`,
      categorySlug: preset.categorySlug,
      categoryName: catMatch?.name || preset.categoryName,
      brand: preset.brand,
      price: preset.price,
      originalPrice: preset.originalPrice,
      stock: preset.stock,
      inStock: preset.inStock,
      sku: `${preset.sku}-${randSuffix}`,
      tagline: preset.tagline,
      description: preset.description,
      images: Array.isArray(preset.images) ? preset.images.join(', ') : preset.images,
      processor: preset.specs?.processor || '',
      ram: preset.specs?.ram || '',
      storage: preset.specs?.storage || '',
      gpu: preset.specs?.gpu || '',
      display: preset.specs?.display || '',
      os: preset.specs?.os || '',
      weight: preset.weight || '',
      warranty: preset.warranty || '1 Year Official Warranty'
    });
    addToast(`Loaded demo specs from "${preset.name}"`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categorySlug) {
      addToast('Name, price, and category are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const categoryObj = categories.find(c => c.slug === formData.categorySlug);
      const imagesArray = formData.images
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        categorySlug: formData.categorySlug,
        categoryName: categoryObj?.name || formData.categorySlug,
        brand: formData.brand || 'Bytecart',
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        stock: Number(formData.stock),
        inStock: Boolean(formData.inStock),
        sku: formData.sku,
        tagline: formData.tagline,
        description: formData.description,
        images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80'],
        weight: formData.weight,
        warranty: formData.warranty,
        specs: {
          processor: formData.processor,
          ram: formData.ram,
          storage: formData.storage,
          gpu: formData.gpu,
          display: formData.display,
          os: formData.os,
        }
      };

      if (product) {
        await adminService.updateProduct(product.id, payload);
        addToast('Hardware product updated successfully.', 'success');
      } else {
        await adminService.createProduct(payload);
        addToast('New hardware product created and live in catalog.', 'success');
      }

      onSaved();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to save product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E2DBD0] p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#24221F]">
              {product ? 'Edit Hardware Product' : 'Add New Hardware Product'}
            </h2>
            <p className="text-[11px] text-[#77716A]">Enter specifications for the storefront catalog</p>
          </div>
          <button onClick={onClose} className="p-1 text-[#77716A] hover:text-[#24221F]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Fill Presets */}
        {!product && (
          <div className="p-3.5 bg-[#EAE4DA]/50 rounded-2xl border border-[#E2DBD0] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#A66A4C]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Fill From Flagship Hardware Preset:</span>
              </div>
              <span className="text-[10px] text-[#77716A]">19 Spec Templates Available</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value !== '') {
                    handleFillDemoPreset(Number(e.target.value));
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E2DBD0] text-[#24221F] focus:outline-none focus:border-[#A66A4C] cursor-pointer"
              >
                <option value="" disabled>Select a Hardware Demo Template to auto-populate form...</option>
                {productsData.map((p, idx) => (
                  <option key={p.id} value={idx}>
                    [{p.categoryName}] {p.name} — ₹{p.price.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[0, 3, 4, 7, 9, 11, 13, 15].map(idx => {
                const p = productsData[idx];
                if (!p) return null;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleFillDemoPreset(idx)}
                    className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-white hover:bg-[#24221F] hover:text-white border border-[#E2DBD0] text-[#24221F] transition-colors cursor-pointer"
                  >
                    + {p.name.split(' ').slice(0, 3).join(' ')}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. ProDesk Extreme 32"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Category *</label>
              <select
                value={formData.categorySlug}
                onChange={e => setFormData({ ...formData, categorySlug: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              >
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Brand / Manufacturer</label>
              <input
                type="text"
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Bytecart Performance, ASUS, Intel"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">SKU Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="SKU-89217"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="49900"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Original / MRP Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="54900"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Inventory Units (Stock)</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Warranty Duration</label>
              <input
                type="text"
                value={formData.warranty}
                onChange={e => setFormData({ ...formData, warranty: e.target.value })}
                placeholder="1 Year Official Warranty"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold uppercase tracking-wider text-[#77716A]">Marketing Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Next-generation computing architecture for enterprise"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold uppercase tracking-wider text-[#77716A]">Detailed Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full hardware description, thermal architecture, engineering highlights..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold uppercase tracking-wider text-[#77716A]">Image URLs (comma separated)</label>
            <input
              type="text"
              value={formData.images}
              onChange={e => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://images.unsplash.com/..., https://..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
            />
          </div>

          {/* Detailed Technical Specs */}
          <div className="p-3 bg-white rounded-2xl border border-[#E2DBD0] space-y-2">
            <p className="font-semibold uppercase tracking-wider text-[10px] text-[#A66A4C]">Hardware Specifications</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={formData.processor}
                onChange={e => setFormData({ ...formData, processor: e.target.value })}
                placeholder="CPU: Core i7 14700 or Apple M3 Max"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
              <input
                type="text"
                value={formData.ram}
                onChange={e => setFormData({ ...formData, ram: e.target.value })}
                placeholder="RAM: 32GB DDR5"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
              <input
                type="text"
                value={formData.storage}
                onChange={e => setFormData({ ...formData, storage: e.target.value })}
                placeholder="Storage: 1TB NVMe"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
              <input
                type="text"
                value={formData.gpu}
                onChange={e => setFormData({ ...formData, gpu: e.target.value })}
                placeholder="GPU: RTX 4070 12GB"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
              <input
                type="text"
                value={formData.display}
                onChange={e => setFormData({ ...formData, display: e.target.value })}
                placeholder="Display: 16-inch 165Hz OLED"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
              <input
                type="text"
                value={formData.os}
                onChange={e => setFormData({ ...formData, os: e.target.value })}
                placeholder="OS: Windows 11 Pro / macOS"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2DBD0]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#E2DBD0] text-xs font-semibold uppercase tracking-wider text-[#77716A] hover:text-[#24221F] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving Product...' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
