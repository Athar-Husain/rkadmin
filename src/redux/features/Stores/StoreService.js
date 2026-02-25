import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

// ===============================
// Configuration
// ===============================
// const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const STORE_URL = `${BASE_API_URL}/api/stores`;

// ===============================
// Axios Instance
// ===============================
const axiosInstance = axios.create({
  baseURL: STORE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

// ===============================
// StoreService Methods
// ===============================
const StoreService = {
  // Public
  getStores: (params) => axiosInstance.get('/getStores', { params }).then((res) => res.data),
  getStoreById: (id) => axios.get(`/${id}`).then((res) => res.data),
  getStoreHours: (id) => axios.get(`/${id}/hours`).then((res) => res.data),
  getNearbyStores: (params) => axios.get('/nearby', { params }).then((res) => res.data),

  // Staff
  staffLogin: (data) =>
    axios.post('/staff-login', data).then((res) => {
      const { token, expiresIn } = res.data;
      if (token && expiresIn) TokenManager.save(token, expiresIn);
      return res.data;
    }),
  getDashboard: (id) => axiosInstance.get(`/${id}/dashboard`).then((res) => res.data),

  // Admin
  createStore: (data) => axiosInstance.post('/createStore', data).then((res) => res.data),
  getAllStoresAdmin: () => axiosInstance.get('/getAllStores').then((res) => res.data),
  getStoreByIdAdmin: (id) => axiosInstance.get(`/getStoreById/${id}`).then((res) => res.data),
  updateStore: (id, data) => axiosInstance.put(`/updateStore/${id}`, data).then((res) => res.data),
  toggleStoreStatus: (id) => axiosInstance.patch(`/toggleStoreStatus/${id}/status`).then((res) => res.data)
};

export default StoreService;
