import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const CONNECTION_URL = `${BASE_API_URL}/api/connections`;

const axiosInstance = axios.create({
  baseURL: CONNECTION_URL,
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

const ConnectionService = {
  getAll: () => axiosInstance.get('/').then((res) => res.data),

  getById: (id) => axiosInstance.get(`/${id}`).then((res) => res.data),

  create: (data) => axiosInstance.post('/', data).then((res) => res.data),

  update: (id, data) => axiosInstance.patch(`/${id}`, data).then((res) => res.data),

  deactivate: (id) => axiosInstance.patch(`/deactivate/${id}`).then((res) => res.data),

  delete: (id) => axiosInstance.delete(`/${id}`).then((res) => res.data),

  getFiltered: (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    return axiosInstance.get(`/filter?${queryParams}`).then((res) => res.data);
  },

  updateSubscribedPlan: (planData) => axiosInstance.post('/updateSubscribedPlan', planData).then((res) => res.data),

  getSubscribedPlans: (connectionId) => axiosInstance.get(`/${connectionId}/subscribedPlans`).then((res) => res.data)
};

export default ConnectionService;
