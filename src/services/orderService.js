import { apiRequest } from './api';

const LOCAL_ORDERS_KEY = 'bytecart_orders_history_v1';

function getStoredOrders() {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistOrderLocally(order) {
  try {
    const list = getStoredOrders();
    const normalized = {
      ...order,
      id: order.id || order._id,
      _id: order._id || order.id
    };
    const existingIndex = list.findIndex(o => (o.id || o._id) === normalized.id);
    if (existingIndex >= 0) {
      list[existingIndex] = normalized;
    } else {
      list.unshift(normalized);
    }
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(list));
    return normalized;
  } catch (e) {
    console.error('Failed to store order locally', e);
    return order;
  }
}

export const orderService = {
  async calculateTotals({ items, promoCode }) {
    try {
      return await apiRequest('/orders/calculate', {
        method: 'POST',
        body: { items, promoCode }
      });
    } catch {
      const subtotal = items.reduce((acc, i) => acc + (i.product?.price || 0) * (i.quantity || 1), 0);
      return {
        subtotal,
        discount: 0,
        tax: 0,
        deliveryCharge: 0,
        total: subtotal
      };
    }
  },

  async createOrder({ items, shippingAddress, paymentMethod = 'COD', promoCode, transactionId, notes, subtotal, deliveryCharge, discount, tax, total, userId }) {
    const calculatedSubtotal = subtotal !== undefined ? subtotal : items.reduce((acc, i) => acc + (i.product?.price || 0) * (i.quantity || 1), 0);
    const calculatedTotal = total !== undefined ? total : calculatedSubtotal;
    const orderId = 'ORD-' + Date.now();

    try {
      let res;
      try {
        res = await apiRequest('/orders', {
          method: 'POST',
          body: {
            items,
            shippingAddress,
            paymentMethod,
            promoCode,
            transactionId,
            notes,
            subtotal: calculatedSubtotal,
            total: calculatedTotal
          }
        });
      } catch (postErr) {
        // Fallback to singular /order if backend route is singular
        res = await apiRequest('/order', {
          method: 'POST',
          body: {
            items,
            shippingAddress,
            paymentMethod,
            promoCode,
            transactionId,
            notes,
            subtotal: calculatedSubtotal,
            total: calculatedTotal
          }
        });
      }

      const returnedOrder = res?.order || res;
      const normalized = {
        ...returnedOrder,
        id: returnedOrder.id || returnedOrder._id || orderId,
        items: returnedOrder.items || items,
        shippingAddress: returnedOrder.shippingAddress || shippingAddress,
        total: returnedOrder.total || calculatedTotal,
        subtotal: returnedOrder.subtotal || calculatedSubtotal,
        paymentMethod: returnedOrder.paymentMethod || paymentMethod,
        status: returnedOrder.status || 'CONFIRMED',
        createdAt: returnedOrder.createdAt || new Date().toISOString()
      };
      persistOrderLocally(normalized);
      return normalized;
    } catch (err) {
      console.warn('Backend order creation deferred/offline. Saving order locally:', err);
      const fallbackOrder = {
        id: orderId,
        _id: orderId,
        orderNumber: 'BC-' + Math.floor(100000 + Math.random() * 900000),
        items,
        shippingAddress,
        paymentMethod,
        subtotal: calculatedSubtotal,
        deliveryCharge: deliveryCharge || 0,
        discount: discount || 0,
        tax: tax || 0,
        total: calculatedTotal,
        status: 'CONFIRMED',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        createdAt: new Date().toISOString(),
        transactionId: transactionId || null,
        userId: userId || 'usr-guest',
      };
      persistOrderLocally(fallbackOrder);
      return fallbackOrder;
    }
  },

  async getMyOrders() {
    try {
      const res = await apiRequest('/orders/my-orders');
      const serverOrders = Array.isArray(res) ? res : (res?.orders || []);
      const localOrders = getStoredOrders();
      
      const serverIds = new Set(serverOrders.map(o => o.id || o._id));
      const merged = [...serverOrders, ...localOrders.filter(o => !serverIds.has(o.id || o._id))];
      return merged;
    } catch {
      return getStoredOrders();
    }
  },

  async getOrderById(id) {
    try {
      const res = await apiRequest(`/orders/${id}`);
      const found = res?.order || res;
      if (found && (found.id || found._id)) {
        persistOrderLocally(found);
        return { ...found, id: found.id || found._id };
      }
    } catch {
      // Check local cache
    }

    const localList = getStoredOrders();
    const matched = localList.find(o => (o.id || o._id) === id || o.orderNumber === id);
    if (matched) return matched;

    throw new Error('Order not found');
  },

  async cancelOrder(id, reason = 'Customer request') {
    try {
      return await apiRequest(`/orders/${id}/cancel`, {
        method: 'PATCH',
        body: { reason }
      });
    } catch {
      const list = getStoredOrders().map(o => {
        if ((o.id || o._id) === id) {
          return { ...o, status: 'CANCELLED', cancelReason: reason };
        }
        return o;
      });
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(list));
      return { success: true };
    }
  },

  isCancellable(status) {
    return ['Pending', 'Confirmed', 'Processing', 'PLACED', 'CONFIRMED', 'PROCESSING'].includes(status);
  }
};
