import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

// ===============================
// Configuration
// ===============================
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const USER_URL = `${BASE_API_URL}/api/users`;

// ===============================
// Axios Instance
// ===============================
const axiosInstance = axios.create({
  baseURL: USER_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = TokenManager.getToken();
//     if (token && TokenManager.isValid()) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

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
// UserService Methods
// ===============================
const UserService = {
  // ----------------
  // Public
  // ----------------
  registerUser: (data) => axiosInstance.post('/register', data).then((res) => res.data),

  // ----------------
  // Protected / User
  // ----------------
  getProfile: () => axiosInstance.get('/getProfile').then((res) => res.data),
  updateProfile: (data) => axiosInstance.patch('/updateProfile', data).then((res) => res.data),
  updatePreferences: (data) => axiosInstance.patch('/updatePreferences', data).then((res) => res.data),
  // deleteAccount: () => axiosInstance.delete('/deleteAccount').then((res) => res.data),

  // ----------------
  // Admin
  // ----------------
  getAllUsers: () => axiosInstance.get('/getAllUsers').then((res) => res.data),
  getUserById: (id) => axiosInstance.get(`/getUserById/${id}`).then((res) => res.data),
  updateUserByAdmin: (id, data) => axiosInstance.patch(`/updateUserByAdmin/${id}`, data).then((res) => res.data),
  deleteUserByAdmin: (id) => axiosInstance.delete(`/deleteUserByAdmin/${id}`).then((res) => res.data)
};

export default UserService;
