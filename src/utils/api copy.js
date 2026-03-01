import axios from 'axios';

// Base configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
console.log('API_BASE_URL', API_BASE_URL);
// const API_BASE_URL = 'http://127.0.0.1:5000';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiry');
        window.location.href = '/login';
      }
      return Promise.reject(data || { message: 'An error occurred' });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something else happened
      return Promise.reject({ message: error.message });
    }
  }
);

// API functions
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  refresh: (refreshToken) => api.post('/api/auth/refresh', { refreshToken }),
  getProfile: () => api.get('/api/auth/profile'),
  getLoginStatus: () => api.get('/api/auth/status')
};

export const storeAPI = {
  getAll: (params) => api.get('/api/stores/getStores', { params }),
  getById: (id) => api.get(`/api/stores/${id}`),
  create: (data) => api.post('/api/stores', data),
  update: (id, data) => api.put(`/api/stores/${id}`, data),
  delete: (id) => api.delete(`/api/stores/${id}`),
  toggleStatus: (id) => api.patch(`/api/stores/${id}/toggle`),
  getAreasByCity: (city) => api.get(`/api/stores/areas/${city}`),
  getNearby: (params) => api.get('/api/stores/nearby', { params })
};

export const productAPI = {
  getAll: (params) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
  getByCategory: (category, params) => api.get(`/api/products/category/${category}`, { params }),
  search: (query, params) => api.get(`/api/products/search/${query}`, { params }),
  getFeatured: () => api.get('/api/products/featured'),
  getCategories: () => api.get('/api/products/categories-list'),
  checkAvailability: (id, params) => api.get(`/api/products/${id}/availability`, { params }),
  compare: (productIds) => api.post('/api/products/compare', { productIds })
};

export const purchaseAPI = {
  create: (data) => api.post('/api/purchases/recordPurchase', data),
  getById: (id) => api.get(`/api/purchases/${id}`),
  getAll: (params) => api.get('/api/purchase/purchases', { params }),
  getMy: (params) => api.get('/api/purchases/my', { params }),
  getStore: (storeId, params) => api.get(`/api/purchases/store/${storeId}`, { params }),
  updateStatus: (id, data) => api.put(`/api/purchases/${id}/status`, data),
  cancel: (id) => api.put(`/api/purchases/${id}/cancel`),
  refund: (id) => api.put(`/api/purchases/${id}/refund`),
  export: (params) => api.get('/api/purchases/export', { params, responseType: 'blob' }),
  getReport: (storeId, params) => api.get(`/api/purchases/report/store/${storeId}`, { params }),
  getUserReport: (userId) => api.get(`/api/purchases/report/user/${userId}`),
  preview: (data) => api.post('/api/purchases/preview', data)
};

export const couponAPI = {
  getAll: () => api.get('/api/coupons'),
  getById: (id) => api.get(`/api/coupons/${id}`),
  create: (data) => api.post('/api/coupons', data),
  update: (id, data) => api.put(`/api/coupons/${id}`, data),
  delete: (id) => api.delete(`/api/coupons/${id}`),
  claim: (id) => api.post(`/api/coupons/${id}/claim`),
  validate: (data) => api.post('/api/coupons/validate', data),
  redeem: (data) => api.post('/api/coupons/redeem', data),
  getRedemptions: (id, params) => api.get(`/api/coupons/${id}/redemptions`, { params }),
  getDiscoverable: (userId) => api.get('/api/coupons/discoverable', { params: { userId } }),
  getMy: (params) => api.get('/api/coupons/my', { params }),
  getActive: (params) => api.get('/api/coupons/active', { params }),
  getHistory: (params) => api.get('/api/coupons/history', { params }),
  getSavings: (params) => api.get('/api/coupons/savings', { params }),
  getAnalytics: () => api.get('/api/coupons/analytics')
};

export const staffAPI = {
  create: (data) => api.post('/api/staff', data),
  getAll: () => api.get('/api/staff'),
  getById: (id) => api.get(`/api/staff/${id}`),
  update: (id, data) => api.put(`/api/staff/${id}`, data),
  delete: (id) => api.delete(`/api/staff/${id}`),
  login: (data) => api.post('/api/staff/login', data),
  logout: () => api.post('/api/staff/logout'),
  getProfile: () => api.get('/api/staff/profile'),
  updateProfile: (data) => api.put('/api/staff/profile', data),
  refreshToken: (refreshToken) => api.post('/api/staff/refresh', { refreshToken }),
  getDashboard: (id) => api.get(`/api/staff/${id}/dashboard`),
  getLoginStatus: () => api.get('/api/staff/status')
};

export const userAPI = {
  getAll: (params) => api.get('/api/users', { params }),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (data) => api.post('/api/users', data),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`),
  getProfile: (id) => api.get(`/api/users/${id}/profile`),
  updateProfile: (id, data) => api.put(`/api/users/${id}/profile`),
  getPurchases: (id, params) => api.get(`/api/users/${id}/purchases`, { params }),
  getSpendingReport: (id) => api.get(`/api/users/${id}/spending-report`)
};

export const notificationAPI = {
  send: (data) => api.post('/api/notifications/send', data),
  getSent: (params) => api.get('/api/notifications/sent', { params }),
  getDelivered: (params) => api.get('/api/notifications/delivered', { params }),
  getFailed: (params) => api.get('/api/notifications/failed', { params }),
  getStats: () => api.get('/api/notifications/stats'),
  getTemplates: () => api.get('/api/notifications/templates'),
  createTemplate: (data) => api.post('/api/notifications/templates', data),
  updateTemplate: (id, data) => api.put(`/api/notifications/templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/api/notifications/templates/${id}`)
};

export const analyticsAPI = {
  getDashboard: () => api.get('/api/analytics/dashboard'),
  getSales: (params) => api.get('/api/analytics/sales', { params }),
  getUsers: (params) => api.get('/api/analytics/users', { params }),
  getRedemptions: (params) => api.get('/api/analytics/redemptions', { params }),
  getPerformance: (params) => api.get('/api/analytics/performance', { params }),
  getTrends: (params) => api.get('/api/analytics/trends', { params })
};

export const locationAPI = {
  getCities: () => api.get('/api/locations/cities'),
  getAreas: (city) => api.get(`/api/locations/areas/${city}`),
  getStores: (city, area) => api.get('/api/locations/stores', { params: { city, area } }),
  getCoordinates: (address) => api.get('/api/locations/coordinates', { params: { address } })
};

// New API functions for promotions and banners
export const promotionAPI = {
  create: (data) => api.post('/api/promotions', data),
  getAll: () => api.get('/api/promotions'),
  getById: (id) => api.get(`/api/promotions/${id}`),
  update: (id, data) => api.put(`/api/promotions/${id}`, data),
  delete: (id) => api.delete(`/api/promotions/${id}`),
  getAnalytics: (id) => api.get(`/api/promotions/${id}/analytics`),
  getActive: (params) => api.get('/api/promotions/active', { params }),
  apply: (data) => api.post('/api/promotions/apply', data)
};

export const bannerAPI = {
  create: (data) => api.post('/api/banners', data),
  getAll: () => api.get('/api/banners'),
  getById: (id) => api.get(`/api/banners/${id}`),
  update: (id, data) => api.put(`/api/banners/${id}`, data),
  delete: (id) => api.delete(`/api/banners/${id}`),
  getActive: (params) => api.get('/api/banners/active', { params })
};

// Utility functions
export const downloadFile = (data, filename, mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') => {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatDate = (date, format = 'yyyy-MM-dd') => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date));
};

export const validateEmail = (email) => {
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return re.test(email);
};

export const validateMobile = (mobile) => {
  const re = /^[6-9]\\d{9}$/;
  return re.test(mobile);
};
