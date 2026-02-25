// utils/TokenManager.js
import axios from 'axios';

// Define the Axios instance globally (you can use different base URLs in other places, but this is the general idea)
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Replace with your API base URL if needed
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add the Axios interceptor here
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

// Token management logic
const TokenManager = {
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
  },

  // Utility function to get the token from the header (to be used in Axios)
  getAuthHeader: () => {
    const token = TokenManager.getToken();
    return token && TokenManager.isValid() ? `Bearer ${token}` : null;
  },

  // Method to get the Axios instance (with interceptor already attached)
  getAxiosInstance: () => axiosInstance
};

export default TokenManager;
