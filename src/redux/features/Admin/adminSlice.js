// src/redux/features/Admin/adminSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import AdminService from './adminService';

// ================================
// Initial State
// ================================
const token = localStorage.getItem('access_token');
const tokenExpiry = localStorage.getItem('token_expiry');

const initialState = {
  Admin: null,
  isLoggedIn: !!(token && tokenExpiry && Date.now() < +tokenExpiry),
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',

  // Dashboard
  dashboard: null,
  dashboardLoading: false,

  // Extra Features
  users: [],
  coupons: [],
  couponAnalytics: null
};

// ================================
// Helper
// ================================
const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong';

// ================================
// AUTH THUNKS
// ================================
export const registerAdmin = createAsyncThunk('admin/register', async (data, thunkAPI) => {
  try {
    return await AdminService.register(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const loginAdmin = createAsyncThunk('admin/login', async (credentials, thunkAPI) => {
  try {
    return await AdminService.login(credentials);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const logoutAdmin = createAsyncThunk('admin/logout', async () => {
  await AdminService.logout();
});

export const getAdminLoginStatus = createAsyncThunk('admin/status', async (_, thunkAPI) => {
  try {
    return await AdminService.getLoginStatus();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getAdminProfile = createAsyncThunk('admin/profile', async (_, thunkAPI) => {
  try {
    return await AdminService.getProfile();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateAdminProfile = createAsyncThunk('admin/updateProfile', async (data, thunkAPI) => {
  try {
    return await AdminService.updateProfile(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const forgotPassword = createAsyncThunk('admin/forgotPassword', async (email, thunkAPI) => {
  try {
    return await AdminService.forgotPassword(email);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const verifyOtp = createAsyncThunk('admin/verifyOtp', async (data, thunkAPI) => {
  try {
    return await AdminService.verifyOtp(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const changePassword = createAsyncThunk('admin/changePassword', async (data, thunkAPI) => {
  try {
    return await AdminService.changePassword(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// DASHBOARD
// ================================
export const getDashboard = createAsyncThunk('admin/dashboard', async (_, thunkAPI) => {
  try {
    return await AdminService.getDashboard();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// COUPONS
// ================================
export const createCoupon = createAsyncThunk('admin/createCoupon', async (data, thunkAPI) => {
  try {
    return await AdminService.createCoupon(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateCoupon = createAsyncThunk('admin/updateCoupon', async ({ id, data }, thunkAPI) => {
  try {
    return await AdminService.updateCoupon(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getCouponAnalytics = createAsyncThunk('admin/couponAnalytics', async (_, thunkAPI) => {
  try {
    return await AdminService.getCouponAnalytics();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// USERS
// ================================
export const getUsers = createAsyncThunk('admin/getUsers', async (_, thunkAPI) => {
  try {
    return await AdminService.getUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const exportUsers = createAsyncThunk('admin/exportUsers', async (_, thunkAPI) => {
  try {
    return await AdminService.exportUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// NOTIFICATIONS
// ================================
export const sendNotification = createAsyncThunk('admin/sendNotification', async (data, thunkAPI) => {
  try {
    return await AdminService.sendNotification(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// PRODUCTS
// ================================
export const importProducts = createAsyncThunk('admin/importProducts', async (formData, thunkAPI) => {
  try {
    return await AdminService.importProducts(formData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// SLICE
// ================================
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    ADRESET: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerAdmin.fulfilled, (state) => {
        toast.success('Admin registered successfully');
      })

      // LOGIN
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.Admin = action.payload.admin;
        toast.success('Login successful');
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.Admin = null;
        toast.error(action.payload);
      })

      // LOGOUT
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.Admin = null;
        toast.info('Logged out successfully');
      })

      // PROFILE
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.Admin = action.payload.admin;
        state.isLoggedIn = true;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.Admin = action.payload;
        toast.success('Profile updated successfully');
      })

      // DASHBOARD
      .addCase(getDashboard.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        toast.error(action.payload);
      })

      // USERS
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      // COUPON ANALYTICS
      .addCase(getCouponAnalytics.fulfilled, (state, action) => {
        state.couponAnalytics = action.payload;
      })

      // GENERIC ERRORS
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isError = true;
          state.message = action.payload;
        }
      );
  }
});

export const { ADRESET } = adminSlice.actions;
export default adminSlice.reducer;
