// src/features/customer/CustomerService.js

import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const CUSTOMER_URL = `${BASE_API_URL}/api/customers`;

// Create a reusable axios instance for customer-related requests
const axiosInstance = axios.create({
  baseURL: CUSTOMER_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Adding token authentication for the requests
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

/**
 * Service to handle all API interactions for customer management.
 */
const CustomerService = {
  // Registers a new customer (Admin protected)
  register: (data) => axiosInstance.post('/register', data).then((res) => res.data),

  // Logs in a customer
  login: (data) =>
    axiosInstance.post('/login', data).then((res) => {
      // Optionally store token here or handle in slice
      return res.data;
    }),

  // Fetches all customers (Admin protected)
  getAll: () => axiosInstance.get('/all').then((res) => res.data),

  // Gets the logged-in customer's profile
  getProfile: () => axiosInstance.get('/profile').then((res) => res.data),

  // Updates the logged-in customer's profile (Admin protected)
  update: (data) => axiosInstance.patch('/update', data).then((res) => res.data),

  // Sends forgot password OTP email
  forgotPassword: (email) => axiosInstance.post('/forgot-password', { email }).then((res) => res.data),

  // Verifies OTP for password reset
  verifyOtp: (otpData) => axiosInstance.post('/verify-otp', otpData).then((res) => res.data),

  // Changes password (protected route)
  changePassword: (passwordData) => axiosInstance.post('/change-password', passwordData).then((res) => res.data),

  // Logs out the customer
  logout: () => axiosInstance.post('/logout').then((res) => res.data),

  // Searches customers by phone (query param)
  searchByPhone: (phone) => axiosInstance.get(`/search?phone=${phone}`).then((res) => res.data),

  // Delete a customer by id (you had this in slice, but not in routes, add if needed)
  delete: (id) => axiosInstance.delete(`/${id}`).then((res) => res.data)
};

export default CustomerService;
