import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

// ===============================
// Configuration
// ===============================
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const LOCATION_URL = `${BASE_API_URL}/api/locations`;

// ===============================
// Axios Instance
// ===============================
const axiosInstance = axios.create({
  baseURL: LOCATION_URL,
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
// LocationService Methods
// ===============================
const LocationService = {
  // ----------------
  // Admin
  // ----------------
  createCity: (data) => axiosInstance.post('/createCity', data).then((res) => res.data),

  addAreasToCity: (city, data) => axiosInstance.post(`/addAreasToCity/${city}`, data).then((res) => res.data),

  removeAreaFromCity: (city, area) => axiosInstance.delete(`/removeAreaFromCity/${city}/area/${area}`).then((res) => res.data),

  toggleCityStatus: (city) => axiosInstance.patch(`/toggleCityStatus/${city}/status`).then((res) => res.data),

  toggleAreaStatus: (city, area) => axiosInstance.patch(`/toggleAreaStatus/${city}/area/${area}/status`).then((res) => res.data),

  getAllCitiesWithAreas: () => axiosInstance.get('/getAllCitiesWithAreas').then((res) => res.data),

  getCityDetails: (city) => axiosInstance.get(`/getCityDetails/${city}`).then((res) => res.data),

  // ----------------
  // Public
  // ----------------
  getCities: () => axiosInstance.get('/cities').then((res) => res.data),

  getAreasByCity: (city) => axiosInstance.get(`/cities/${city}/areas`).then((res) => res.data),

  validateCityArea: (data) => axiosInstance.post('/validate', data).then((res) => res.data)
};

export default LocationService;
