import { apiRequest } from './api';
import { productsData } from '../data/productsData';
import { categoriesData as defaultCategories } from '../data/categoriesData';

function getAdminFallbackProducts(params = {}) {
  let list = [...productsData];
  try {
    const custom = JSON.parse(localStorage.getItem('bytecart_custom_products') || '[]');
    if (Array.isArray(custom) && custom.length > 0) {
      const customIds = new Set(custom.map(p => p.id));
      list = [...custom, ...list.filter(p => !customIds.has(p.id))];
    }
  } catch {}

  let results = [...list];
  if (params.category && params.category !== 'all') {
    results = results.filter(p => p.categorySlug === params.category || p.category === params.category);
  }
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    results = results.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.tagline?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
    );
  }
  return results;
}

function notifyProductsUpdated() {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bytecart_products_updated'));
    }
  } catch {}
}

function saveCustomProductFallback(product) {
  try {
    const custom = JSON.parse(localStorage.getItem('bytecart_custom_products') || '[]');
    const index = custom.findIndex(p => p.id === product.id || p.slug === product.slug);
    if (index >= 0) {
      custom[index] = { ...custom[index], ...product };
    } else {
      custom.unshift(product);
    }
    localStorage.setItem('bytecart_custom_products', JSON.stringify(custom));
    notifyProductsUpdated();
  } catch {}
}

function deleteCustomProductFallback(id) {
  try {
    const custom = JSON.parse(localStorage.getItem('bytecart_custom_products') || '[]');
    const filtered = custom.filter(p => p.id !== id && p.slug !== id);
    localStorage.setItem('bytecart_custom_products', JSON.stringify(filtered));
    notifyProductsUpdated();
  } catch {}
}

export const adminService = {
  // Dashboard stats
  async getDashboardStats() {
    try {
      const res = await apiRequest('/admin/dashboard', { silent: true });
      if (res && res.kpis) {
        return res;
      }
    } catch {
      // Backend not running /admin/dashboard or running in static cloud mode
    }

    const fallbackProds = getAdminFallbackProducts();
    const lowStock = fallbackProds.filter(p => p.stock !== undefined && p.stock <= 5).length;

    return {
      kpis: {
        totalOrders: 2,
        pendingOrders: 0,
        completedOrders: 2,
        cancelledOrders: 0,
        totalRevenue: 699800,
        pendingPayments: 0,
        successfulPayments: 2,
        failedPayments: 0,
        totalProducts: fallbackProds.length,
        lowStockProducts: lowStock,
        totalCustomers: 2,
        unreadFeedback: 2,
      },
      recentOrders: [
        {
          id: 'BC85606',
          customerName: 'Naresh Kumar',
          customerEmail: 'customer_1787902678226@example.com',
          total: 349900,
          paymentStatus: 'Paid',
          orderStatus: 'Shipped',
          createdAt: '2026-08-28T07:37:58.325Z',
          items: [{ name: 'MacBook Pro 16 M3 Max Ultra Spec' }]
        },
        {
          id: 'BC65038',
          customerName: 'Naresh Kumar',
          customerEmail: 'customer_1787902523128@example.com',
          total: 349900,
          paymentStatus: 'Paid',
          orderStatus: 'Shipped',
          createdAt: '2026-08-28T07:35:23.223Z',
          items: [{ name: 'MacBook Pro 16 M3 Max Ultra Spec' }]
        }
      ],
      settings: {},
    };
  },

  async getOrders(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'ALL') query.set('status', params.status);
      if (params.paymentStatus && params.paymentStatus !== 'ALL') query.set('paymentStatus', params.paymentStatus);
      if (params.search) query.set('search', params.search);
      const qs = query.toString();
      const res = await apiRequest(qs ? `/admin/orders?${qs}` : '/admin/orders');
      return Array.isArray(res) ? res : (res?.orders || []);
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const res = await apiRequest('/order');
          return Array.isArray(res) ? res : (res?.orders || []);
        } catch {
          return [];
        }
      }
      return [];
    }
  },

  async getOrderById(id) {
    return await apiRequest(`/orders/${id}`);
  },

  async updateOrderStatus(orderId, { orderStatus, paymentStatus }) {
    return await apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { orderStatus, paymentStatus }
    });
  },

  async getPayments() {
    try {
      const res = await apiRequest('/admin/payments');
      return Array.isArray(res) ? res : (res?.payments || []);
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const res = await apiRequest('/payment');
          return Array.isArray(res) ? res : [];
        } catch {
          return [];
        }
      }
      return [];
    }
  },

  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.set('category', params.category);
      if (params.search) query.set('search', params.search);
      const qs = query.toString();
      const res = await apiRequest(qs ? `/products?${qs}` : '/products');
      const items = Array.isArray(res) ? res : (res?.products || []);
      if (items.length > 0) return items;
      return getAdminFallbackProducts(params);
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const res = await apiRequest('/product');
          const items = Array.isArray(res) ? res : (res?.products || []);
          if (items.length > 0) return items;
        } catch {}
      }
      return getAdminFallbackProducts(params);
    }
  },

  async createProduct(productData) {
    try {
      const res = await apiRequest('/products', {
        method: 'POST',
        body: productData
      });
      if (res && res.id) {
        saveCustomProductFallback(res);
        return res;
      }
    } catch (err) {
      console.warn('API call failed creating product, saving locally as fallback:', err);
    }

    const newProd = {
      ...productData,
      id: 'prod_' + Date.now(),
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.8,
      reviewsCount: 0
    };
    saveCustomProductFallback(newProd);
    return newProd;
  },

  async updateProduct(id, productData) {
    try {
      const res = await apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: productData
      });
      if (res) {
        saveCustomProductFallback(res);
        return res;
      }
    } catch (err) {
      console.warn('API call failed updating product, updating locally:', err);
    }

    const updated = { ...productData, id, updatedAt: new Date().toISOString() };
    saveCustomProductFallback(updated);
    return updated;
  },

  async deleteProduct(id) {
    try {
      await apiRequest(`/products/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('API call failed deleting product, deleting locally:', err);
    }
    deleteCustomProductFallback(id);
    return { success: true };
  },

  async seedDemoProducts() {
    try {
      const res = await apiRequest('/products/seed-demo', { method: 'POST' });
      if (res && res.products) {
        notifyProductsUpdated();
        return res;
      }
    } catch (e) {
      console.warn('Backend seed-demo endpoint failed, seeding locally:', e);
    }
    for (const demo of productsData) {
      saveCustomProductFallback(demo);
    }
    notifyProductsUpdated();
    return { addedCount: productsData.length };
  },

  async getCategories() {
    try {
      const res = await apiRequest('/categories');
      const items = Array.isArray(res) ? res : (res?.categories || []);
      if (items.length > 0) return items;
      return defaultCategories || [];
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const res = await apiRequest('/admin/categories');
          const items = Array.isArray(res) ? res : (res?.categories || []);
          if (items.length > 0) return items;
        } catch {}
      }
      return defaultCategories || [];
    }
  },

  async createCategory(categoryData) {
    return await apiRequest('/categories', {
      method: 'POST',
      body: categoryData
    });
  },

  async deleteCategory(id) {
    return await apiRequest(`/categories/${id}`, {
      method: 'DELETE'
    });
  },

  async getBrands() {
    try {
      return await apiRequest('/admin/brands');
    } catch {
      return [];
    }
  },

  async createBrand(brandData) {
    return await apiRequest('/admin/brands', {
      method: 'POST',
      body: brandData
    });
  },

  async deleteBrand(id) {
    return await apiRequest(`/admin/brands/${id}`, {
      method: 'DELETE'
    });
  },

  async getInventory() {
    try {
      return await apiRequest('/admin/inventory');
    } catch {
      return [];
    }
  },

  async updateInventory(productId, { stock, inStock }) {
    return await apiRequest(`/admin/inventory/${productId}`, {
      method: 'PUT',
      body: { stock, inStock }
    });
  },

  async getCustomers() {
    try {
      return await apiRequest('/admin/customers');
    } catch {
      return [];
    }
  },

  async getCustomerDetails(id) {
    return await apiRequest(`/admin/customers/${id}`);
  },

  async getFeedback() {
    try {
      return await apiRequest('/admin/feedback');
    } catch {
      return [];
    }
  },

  async updateFeedbackStatus(id, { read }) {
    return await apiRequest(`/admin/feedback/${id}/status`, {
      method: 'PATCH',
      body: { read }
    });
  },

  async deleteFeedback(id) {
    return await apiRequest(`/admin/feedback/${id}`, {
      method: 'DELETE'
    });
  },

  async getSettings() {
    try {
      return await apiRequest('/admin/settings');
    } catch {
      return {};
    }
  },

  async updateSettings(settingsData) {
    return await apiRequest('/admin/settings', {
      method: 'PUT',
      body: settingsData
    });
  }
};
