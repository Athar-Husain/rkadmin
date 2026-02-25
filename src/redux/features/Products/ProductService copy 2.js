import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const PRODUCT_URL = `${BASE_API_URL}/api/products`;

// -------------------------------
// Axios instance
// -------------------------------
const axiosInstance = axios.create({
  baseURL: PRODUCT_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token if valid
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

// Optional: unwrap data globally
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

// -------------------------------
// ProductService
// -------------------------------
const ProductService = {
  // Public
  getAll: (params) => axiosInstance.get('/getProducts', { params }).then((res) => res.data),

  getProducts: (params) => axiosInstance.get('/', { params }),
  getFeatured: () => axiosInstance.get('/getFeaturedProducts'),
  getById: (id) => axiosInstance.get(`/getProductById/${id}`),
  search: (query, params) => axiosInstance.get(`/search/${query}`, { params }),
  byCategory: (category, params) => axiosInstance.get(`/category/${category}`, { params }),
  checkAvailability: (id, params) => axiosInstance.get(`/checkAvailability/${id}/availability`, { params }),
  compare: (data) => axiosInstance.post('/compare', data),

  // Admin
  add: (data) => axiosInstance.post('/addproduct', data),
  update: (id, data) => axiosInstance.patch(`/updateProduct/${id}`, data)
};

export default ProductService;
