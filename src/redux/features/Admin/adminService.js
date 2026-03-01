import axios from 'axios';

/* ===============================
   Configuration
================================= */
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const ADMIN_URL = `${BASE_API_URL}/api/admin`;

/* ===============================
   Axios Instance
================================= */
const axiosInstance = axios.create({
  baseURL: ADMIN_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/* ===============================
   Token Manager
================================= */
export const TokenManager = {
  save: (token, expiresInSeconds) => {
    const expiryTime = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem('access_token', token);
    localStorage.setItem('token_expiry', expiryTime.toString());
  },
  clear: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiry');
  },
  getToken: () => localStorage.getItem('access_token'),
  isValid: () => {
    const expiry = localStorage.getItem('token_expiry');
    return expiry && Date.now() < parseInt(expiry, 10);
  }
};

/* ===============================
   Interceptor
================================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();

    if (token && TokenManager.isValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   Admin Service
================================= */
const AdminService = {
  /* ========= AUTH ========= */
  register: (data) => axios.post(`${ADMIN_URL}/register`, data).then((res) => res.data),

  login: async (data) => {
    const response = await axios.post(`${ADMIN_URL}/login`, data);
    const { token, expiresIn } = response.data;

    if (token && expiresIn) {
      TokenManager.save(token, expiresIn);
    }

    return response.data;
  },

  logout: async () => {
    await axiosInstance.post('/logout');
    TokenManager.clear();
  },

  forgotPassword: (email) => axios.post(`${ADMIN_URL}/forgot-password`, { email }).then((res) => res.data),

  verifyOtp: (data) => axios.post(`${ADMIN_URL}/verify-otp`, data).then((res) => res.data),

  changePassword: (data) => axiosInstance.patch('/change-password', data).then((res) => res.data),

  /* ========= PROFILE ========= */
  getProfile: () => axiosInstance.get('/profile').then((res) => res.data),

  updateProfile: (data) => axiosInstance.put('/profile', data).then((res) => res.data),

  getLoginStatus: () => axiosInstance.get('/login-status').then((res) => res.data),

  /* ========= DASHBOARD ========= */
  getDashboard: () => axiosInstance.get('/dashboard').then((res) => res.data),

  /* ========= COUPONS ========= */
  createCoupon: (data) => axiosInstance.post('/coupons', data).then((res) => res.data),

  updateCoupon: (id, data) => axiosInstance.put(`/coupons/${id}`, data).then((res) => res.data),

  getCouponAnalytics: () => axiosInstance.get('/coupons/analytics').then((res) => res.data),

  /* ========= USERS ========= */
  getUsers: () => axiosInstance.get('/users').then((res) => res.data),

  exportUsers: () => axiosInstance.get('/users/export', { responseType: 'blob' }),

  /* ========= NOTIFICATIONS ========= */
  sendNotification: (data) => axiosInstance.post('/notifications', data).then((res) => res.data),

  /* ========= PRODUCTS ========= */
  importProducts: (formData) =>
    axiosInstance.post('/products/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export default AdminService;
