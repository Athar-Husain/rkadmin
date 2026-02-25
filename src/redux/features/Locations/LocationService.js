import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
// Ensure this matches your app.use("/api/...", router) in server.js
const LOCATION_URL = `${BASE_API_URL}/api/locations`;

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

// const LocationService = {
//   // ADMIN
//   createCity: (data) => axiosInstance.post('/createCity', data).then((res) => res.data),

//   // Note: Controller expects { areas: [...] } in req.body
//   addAreasToCity: (city, areas) => axiosInstance.post(`/addAreasToCity/${city}`, { areas }).then((res) => res.data),

//   removeAreaFromCity: (city, area) => axiosInstance.delete(`/removeAreaFromCity/${city}/area/${area}`).then((res) => res.data),

//   toggleCityStatus: (city) => axiosInstance.patch(`/toggleCityStatus/${city}/status`).then((res) => res.data),

//   toggleAreaStatus: (city, area) => axiosInstance.patch(`/toggleAreaStatus/${city}/area/${area}/status`).then((res) => res.data),

//   getAllCitiesWithAreas: () => axiosInstance.get('/getAllCitiesWithAreas').then((res) => res.data),

//   getCityDetails: (city) => axiosInstance.get(`/getCityDetails/${city}`).then((res) => res.data),

//   // PUBLIC
//   getCities: () => axiosInstance.get('/cities').then((res) => res.data),

//   getAreasByCity: (city) => axiosInstance.get(`/cities/${city}/areas`).then((res) => res.data),

//   validateCityArea: (data) => axiosInstance.post('/validate', data).then((res) => res.data)
// };

const LocationService = {
  // --- ADMIN (Base: /api/location) ---
  createCity: (data) => axiosInstance.post('/city', data).then((res) => res.data),

  addAreasToCity: (city, areas) => axiosInstance.post(`/addAreasToCity/${city}/areas`, { areas }).then((res) => res.data),

  removeAreaFromCity: (city, area) => axiosInstance.delete(`/removeAreaFromCity/${city}/area/${area}`).then((res) => res.data),

  toggleCityStatus: (city) => axiosInstance.patch(`/toggleCityStatus/${city}/status`).then((res) => res.data),

  toggleAreaStatus: (city, area) => axiosInstance.patch(`/toggleAreaStatus/${city}/area/${area}/status`).then((res) => res.data),

  // --- PUBLIC/ADMIN SHARED ---
  getAllCitiesWithAreas: () => axiosInstance.get('/getAllCitiesWithAreas').then((res) => res.data),

  getCityDetails: (city) => axiosInstance.get(`/getCityDetails/${city}`).then((res) => res.data),

  // --- USER WEB ROUTES ---
  getCities: () => axiosInstance.get('/getcities').then((res) => res.data),

  getAreasByCity: (city) => axiosInstance.get(`/getareasbycity/${city}/areas`).then((res) => res.data),

  validateCityArea: (data) => axiosInstance.post('/location/validate', data).then((res) => res.data),

  // --- MOBILE & SEARCH OPTIMIZED (The Missing Ones) ---
  // Note: Your router has /location/ prefixing these specifically
  getCitiesMobile: () => axiosInstance.get('/location/cities').then((res) => res.data),

  getAreasByCityMobile: (cityId) => axiosInstance.get(`/location/areas/${cityId}`).then((res) => res.data),

  searchLocations: (query) => axiosInstance.get(`/searchCities?query=${query}`).then((res) => res.data),

  checkServiceAvailability: (cityId, areaId) => axiosInstance.post('/check-availability', { cityId, areaId }).then((res) => res.data)
};

export default LocationService;
