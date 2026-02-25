import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const STAFF_URL = `${BASE_API_URL}/api/staff`;

const axiosInstance = axios.create({
  baseURL: STAFF_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token automatically
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

const StaffService = {
  // ----------------
  // Public
  // ----------------
  sendOTP: (data) => axiosInstance.post('/send-otp', data).then((res) => res.data),
  verifyOTP: (data) => axiosInstance.post('/verify-otp', data).then((res) => res.data),
  forgotPassword: (data) => axiosInstance.post('/forgot-password', data).then((res) => res.data),
  resetPassword: (data) => axiosInstance.post('/reset-password', data).then((res) => res.data),
  getLoginStatus: () => axiosInstance.get('/login-status').then((res) => res.data),

  // ----------------
  // Protected Staff
  // ----------------
  getProfile: () => axiosInstance.get('/profile').then((res) => res.data),
  updateProfile: (data) => axiosInstance.patch('/profile', data).then((res) => res.data),
  registerDevice: (data) => axiosInstance.post('/register-device', data).then((res) => res.data),
  logout: () => axiosInstance.post('/logout').then((res) => res.data),
  getDashboard: () => axiosInstance.get('/dashboard').then((res) => res.data),

  // ----------------
  // Admin: Staff Management
  // ----------------
  createStaff: (data) => axiosInstance.post('/createStaff', data).then((res) => res.data),
  getAllStaff: () => axiosInstance.get('/getAllStaff').then((res) => res.data),
  getStaffById: (id) => axiosInstance.get(`/getStaffById/${id}`).then((res) => res.data),
  updateStaff: (id, data) => axiosInstance.patch(`/updateStaff/${id}`, data).then((res) => res.data),
  deleteStaff: (id) => axiosInstance.delete(`/deleteStaff/${id}`).then((res) => res.data)
};

export default StaffService;
