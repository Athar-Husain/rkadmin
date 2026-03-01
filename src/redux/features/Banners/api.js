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

const STORES = '/api/stores';

export const storeAPI = {
  // ========================
  // 🔹 Public Routes
  // ========================

  // Get all stores (filters + pagination)
  getAll: (params) => api.get(`${STORES}/getStores`, { params }),

  // Get nearby stores
  getNearby: (params) => api.get(`${STORES}/nearby`, { params }),

  // Get single store (public)
  getById: (id) => api.get(`${STORES}/getStoreById/${id}`),

  // Get store working hours
  getStoreHours: (id) => api.get(`${STORES}/getStoreHours/${id}/hours`),

  // ========================
  // 🔹 Store Staff Routes
  // ========================

  staffLogin: (data) => api.post(`${STORES}/staff-login`, data),

  getDashboard: (id) => api.get(`${STORES}/getStoreD/${id}/dashboard`),

  // ========================
  // 🔹 Admin Routes
  // ========================

  create: (data) => api.post(`${STORES}/createStore`, data),

  getAllAdmin: () => api.get(`${STORES}/getAllStores`),

  getByIdAdmin: (id) => api.get(`${STORES}/getStoreById/${id}`),

  update: (id, data) => api.put(`${STORES}/updateStore/${id}`, data),

  toggleStatus: (id) => api.patch(`${STORES}/toggleStoreStatus/${id}/status`)
};

const PRODUCTS = '/api/products';

export const productAPI = {
  // 🔹 Public - Get all products
  getAll: (params) => api.get(`${PRODUCTS}/getProducts`, { params }),

  // 🔹 Get product by ID
  getById: (id) => api.get(`${PRODUCTS}/getProductById/${id}`),

  // 🔹 Get products by category
  getByCategory: (category, params) => api.get(`${PRODUCTS}/category/${category}`, { params }),

  // 🔹 Search products
  search: (query, params) => api.get(`${PRODUCTS}/search/${query}`, { params }),

  // 🔹 Featured products
  getFeatured: () => api.get(`${PRODUCTS}/getFeaturedProducts`),

  // 🔹 Categories list
  getCategories: () => api.get(`${PRODUCTS}/getCategoriesList`),

  // 🔹 Check availability
  checkAvailability: (id, params) => api.get(`${PRODUCTS}/checkAvailability/${id}/availability`, { params }),

  // 🔹 Compare products
  compare: (productIds) => api.post(`${PRODUCTS}/compare`, { productIds }),

  // 🔹 Admin - Add product
  create: (data) => api.post(`${PRODUCTS}/addproduct`, data),

  // 🔹 Admin - Update product
  update: (id, data) => api.patch(`${PRODUCTS}/updateProduct/${id}`, data)
};
// export const purchaseAPI = {
//   create: (data) => api.post('/api/purchases/recordPurchase', data),
//   getById: (id) => api.get(`/api/purchases/${id}`),
//   getAll: (params) => api.get('/api/purchase/purchases', { params }),
//   getMy: (params) => api.get('/api/purchases/my', { params }),
//   getStore: (storeId, params) => api.get(`/api/purchases/store/${storeId}`, { params }),
//   updateStatus: (id, data) => api.put(`/api/purchases/${id}/status`, data),
//   cancel: (id) => api.put(`/api/purchases/${id}/cancel`),
//   refund: (id) => api.put(`/api/purchases/${id}/refund`),
//   export: (params) => api.get('/api/purchases/export', { params, responseType: 'blob' }),
//   getReport: (storeId, params) => api.get(`/api/purchases/report/store/${storeId}`, { params }),
//   getUserReport: (userId) => api.get(`/api/purchases/report/user/${userId}`),
//   preview: (data) => api.post('/api/purchases/preview', data)
// };

const PURCHASES = '/api/purchase';

export const purchaseAPI = {
  /* =========================
     USER ROUTES
  ========================= */

  getMy: () => api.get(`${PURCHASES}/getMyPurchases`),

  getById: (id) => api.get(`${PURCHASES}/getPurchaseById/${id}`),

  addRating: (id, data) => api.post(`${PURCHASES}/addRating/${id}/rating`, data),

  updateFeedback: (id, data) => api.patch(`${PURCHASES}/updateFeedback/${id}/feedback`, data),

  /* =========================
     STORE STAFF ROUTES
  ========================= */

  record: (data) => api.post(`${PURCHASES}/recordPurchase`, data),

  preview: (data) => api.post(`${PURCHASES}/previewPurchase`, data),

  getMyRecorded: () => api.get(`${PURCHASES}/getMyRecordedPurchases`),

  getStore: (storeId, params) => api.get(`${PURCHASES}/store/${storeId}`, { params }),

  updateStatus: (id) => api.patch(`${PURCHASES}/updatePurchaseStatus/${id}/status`),

  cancel: (id) => api.patch(`${PURCHASES}/cancelPurchase/${id}/cancel`),

  /* =========================
     REPORTS
  ========================= */

  getStoreReport: (storeId, params) => api.get(`${PURCHASES}/report/store/${storeId}`, { params }),

  getUserReport: (userId) => api.get(`${PURCHASES}/report/user/${userId}`),

  /* =========================
     ADMIN ROUTES
  ========================= */

  getAll: (params) => api.get(`${PURCHASES}/getAllPurchases`, { params }),

  refund: (id) => api.patch(`${PURCHASES}/refundPurchase/${id}/refund`),

  export: (params) =>
    api.get(`${PURCHASES}/export`, {
      params,
      responseType: 'blob'
    }),

  delete: (id) => api.delete(`${PURCHASES}/deletePurchase/${id}`)
};

const COUPONS = '/api/coupons';

// const COUPONS = '/api/coupons';

export const couponAPI = {
  // 🔹 Admin - Create
  create: (data) => api.post(`${COUPONS}/createCoupon`, data),
  // createV2: (data) => api.post(`${COUPONS}/createCoupon2`, data),

  // 🔹 Admin - Analytics
  getAnalytics: () => api.get(`${COUPONS}/analytics`),
  getAnalytics1: () => api.get(`${COUPONS}/analytics1`),
  getAnalytics2: () => api.get(`${COUPONS}/analytics2`),

  // 🔹 Admin - Get All Coupons
  getAll: () => api.get(`${COUPONS}/getAllCoupons`),

  // 🔹 User - My Coupons
  dynamicOptions: () => api.get(`${COUPONS}/dynamicOptions`),
  getMy: () => api.get(`${COUPONS}/getmycoupons`),
  getMyActive: () => api.get(`${COUPONS}/getmyactivecoupons`),
  getHistory: () => api.get(`${COUPONS}/getMyCouponHistory`),
  getSavings: () => api.get(`${COUPONS}/getMyCouponSavings`),
  getDiscoverable: () => api.get(`${COUPONS}/getDiscoverableCoupons`),

  // 🔹 Get By ID
  getById: (id) => api.get(`${COUPONS}/getCouponById/${id}`),

  // 🔹 Update (Admin)
  update: (id, data) => api.put(`${COUPONS}/updateCoupon/${id}`, data),

  // 🔹 Claim
  claim: (id) => api.post(`${COUPONS}/claimCoupon/${id}/claim`),

  // 🔹 Validation
  validate: (data) => api.post(`${COUPONS}/validate`, data),

  validateForStaff: (data) => api.post(`${COUPONS}/validateForStaff`, data),

  // 🔹 Redeem
  redeem: (data) => api.post(`${COUPONS}/redeem`, data),

  // 🔹 Redemption History (Admin)
  getRedemptions: (id) => api.get(`${COUPONS}/getRedemptionHistory/${id}/redemptions`)
};

const STAFF = '/api/staff';

export const staffAPI = {
  // ============================
  // 🔹 Public Auth Routes
  // ============================

  sendOTP: (data) => api.post(`${STAFF}/send-otp`, data),

  verifyOTP: (data) => api.post(`${STAFF}/verify-otp`, data),

  forgotPassword: (data) => api.post(`${STAFF}/forgot-password`, data),

  resetPassword: (data) => api.post(`${STAFF}/reset-password`, data),

  refreshToken: (data) => api.post(`${STAFF}/refresh-token`, data),

  // ============================
  // 🔹 Staff Protected Routes
  // ============================

  getProfile: () => api.get(`${STAFF}/profile`),

  updateProfile: (data) => api.patch(`${STAFF}/profile`, data),

  registerDevice: (data) => api.post(`${STAFF}/register-device`, data),

  logout: () => api.post(`${STAFF}/logout`),

  getDashboard: () => api.get(`${STAFF}/dashboard`),

  getLoginStatus: () => api.get(`${STAFF}/login-status`),

  // ============================
  // 🔹 Admin Routes (Manage Staff)
  // ============================

  create: (data) => api.post(`${STAFF}/create`, data),

  getAll: () => api.get(`${STAFF}/getAllStaff`),

  getById: (id) => api.get(`${STAFF}/getStaffById/${id}`),

  delete: (id) => api.delete(`${STAFF}/deleteStaff/${id}`)
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

// const ANALYTICS = '/api/analytics';
// export const analyticsAPI = {
//   getDashboard: () => api.get('/api/analytics/dashboard'),
//   getSales: (params) => api.get('/api/analytics/sales', { params }),
//   getUsers: (params) => api.get('/api/analytics/users', { params }),
//   getRedemptions: (params) => api.get('/api/analytics/redemptions', { params }),
//   getPerformance: (params) => api.get('/api/analytics/performance', { params }),
//   getTrends: (params) => api.get('/api/analytics/trends', { params })
// };

const ANALYTICS = '/api/analytics';

export const analyticsAPI = {
  getSales: (params) => api.get(`${ANALYTICS}/sales`, { params }),
  getUsers: (params) => api.get(`${ANALYTICS}/users`, { params }),
  getCoupons: (params) => api.get(`${ANALYTICS}/coupons`, { params }),
  getStores: (params) => api.get(`${ANALYTICS}/stores`, { params })
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
