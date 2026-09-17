import { apiRequest } from './api';
import { productsData } from '../data/productsData';

function getFallbackCatalog(params = {}) {
  let list = [...productsData];
  try {
    const custom = JSON.parse(localStorage.getItem('bytecart_custom_products') || '[]');
    if (Array.isArray(custom) && custom.length > 0) {
      // Merge unique by id
      const customIds = new Set(custom.map(p => p.id));
      list = [...custom, ...list.filter(p => !customIds.has(p.id))];
    }
  } catch {}

  let results = [...list];

  if (params.category && params.category !== 'all') {
    results = results.filter(
      (p) =>
        p.categorySlug === params.category ||
        p.category === params.category ||
        (p.categorySlug === 'pc-components' && params.category === 'components') ||
        (p.categorySlug === 'components' && params.category === 'pc-components')
    );
  }

  if (params.brand) {
    results = results.filter(
      (p) => p.brand?.toLowerCase() === params.brand.toLowerCase()
    );
  }

  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.tagline?.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
    );
  }

  if (params.availability === 'in-stock') {
    results = results.filter((p) => p.inStock && (p.stock === undefined || p.stock > 0));
  }

  if (params.priceRange?.max) {
    results = results.filter((p) => p.price <= Number(params.priceRange.max));
  }

  switch (params.sortBy) {
    case 'price-low':
      results.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-high':
      results.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'rating':
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'newest':
      results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      break;
    default:
      break;
  }

  return results;
}

export const productService = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.availability) query.set('availability', params.availability);
    if (params.brand) query.set('brand', params.brand);
    if (params.priceRange?.max) query.set('maxPrice', params.priceRange.max);

    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    try {
      const res = await apiRequest(endpoint);
      let items = Array.isArray(res) ? res : (res?.products || []);
      
      // Seamlessly merge any local custom demo products saved in localStorage
      try {
        const custom = JSON.parse(localStorage.getItem('bytecart_custom_products') || '[]');
        if (Array.isArray(custom) && custom.length > 0) {
          const serverIds = new Set(items.map(p => p.id));
          const serverSlugs = new Set(items.map(p => p.slug));
          let missing = custom.filter(c => !serverIds.has(c.id) && !serverSlugs.has(c.slug));
          if (params.category && params.category !== 'all') {
            missing = missing.filter(p => p.categorySlug === params.category || p.category === params.category);
          }
          if (missing.length > 0) {
            items = [...missing, ...items];
          }
        }
      } catch {}

      if (items.length > 0) return items;
      return getFallbackCatalog(params);
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const fallbackEndpoint = queryString ? `/product?${queryString}` : '/product';
          const res = await apiRequest(fallbackEndpoint);
          const items = Array.isArray(res) ? res : (res?.products || []);
          if (items.length > 0) return items;
        } catch {}
      }
      return getFallbackCatalog(params);
    }
  },

  async getProductBySlug(slug) {
    try {
      const res = await apiRequest(`/products/${slug}`);
      if (res && res.id) return res;
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const res = await apiRequest(`/product/${slug}`);
          if (res && res.id) return res;
        } catch {}
      }
    }
    // Fallback search
    const all = getFallbackCatalog();
    return all.find((p) => p.slug === slug || p.id === slug) || null;
  },

  async getFeaturedProducts(limit = 4) {
    const products = await this.getProducts();
    const featured = products.filter((p) => p.featured);
    return (featured.length > 0 ? featured : products).slice(0, limit);
  },

  async getRelatedProducts(currentSlug, categorySlug, limit = 3) {
    const products = await this.getProducts({ category: categorySlug });
    return products.filter((p) => p.slug !== currentSlug).slice(0, limit);
  }
};
