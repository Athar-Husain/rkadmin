import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const LEAD_URL = `${BASE_API_URL}/api/leads`;

const axiosInstance = axios.create({
  baseURL: LEAD_URL,
  headers: { 'Content-Type': 'application/json' }
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

const LeadService = {
  // Admin: Get all leads with filters
  getAll: async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    const res = await axiosInstance.get(`/?${queryParams}`);
    return res.data;
  },

  // Used by openFollowUpModal to get fresh history
  getById: async (id) => {
    const res = await axiosInstance.get(`/${id}`);
    return res.data;
  },

  createAdminLead: async (data) => {
    const res = await axiosInstance.post('/createLeadadmin', data);
    return res.data;
  },

  bulkUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosInstance.post('/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Admin: Assign to team member
  assignLead: async (leadId, teamMemberId) => {
    const res = await axiosInstance.patch(`/${leadId}/assign`, { teamMemberId });
    return res.data;
  },

  // Team: Add a follow-up log
  addFollowUp: async (leadId, data) => {
    const res = await axiosInstance.post(`/${leadId}/follow-up`, data);
    return res.data;
  },

  // Team: Update status (interested, lost, etc)
  updateStatus: async (leadId, status) => {
    const res = await axiosInstance.patch(`/${leadId}/status`, { status });
    return res.data;
  },

  // Admin: Final conversion
  convert: async (leadId, conversionData) => {
    const res = await axiosInstance.patch(`/${leadId}/convert`, conversionData);
    return res.data;
  }
};

export default LeadService;
