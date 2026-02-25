// src/features/customer/customerSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import CustomerService from './CustomerService';

const initialState = {
  allCustomers: [],
  newCustomer: null,
  customer: null, // For logged-in or fetched single customer
  searchedCustomer: null, // For search results
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  token: null // For login token management
};

// Helper to extract error message
const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

// Async Thunks

// Register customer (Admin protected)
export const registerCustomer = createAsyncThunk('customer/register', async (data, thunkAPI) => {
  try {
    return await CustomerService.register(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Login customer
export const loginCustomer = createAsyncThunk('customer/login', async (data, thunkAPI) => {
  try {
    return await CustomerService.login(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Get all customers (Admin protected)
export const getAllCustomers = createAsyncThunk('customer/getAll', async (_, thunkAPI) => {
  try {
    return await CustomerService.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Get logged-in customer profile
export const getCustomerProfile = createAsyncThunk('customer/getProfile', async (_, thunkAPI) => {
  try {
    return await CustomerService.getProfile();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Update customer (Admin protected)
export const updateCustomer = createAsyncThunk('customer/update', async (data, thunkAPI) => {
  try {
    return await CustomerService.update(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Forgot password (send OTP)
export const forgotPassword = createAsyncThunk('customer/forgotPassword', async (email, thunkAPI) => {
  try {
    return await CustomerService.forgotPassword(email);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Verify OTP
export const verifyOtp = createAsyncThunk('customer/verifyOtp', async (data, thunkAPI) => {
  try {
    return await CustomerService.verifyOtp(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Change password
export const changePassword = createAsyncThunk('customer/changePassword', async (data, thunkAPI) => {
  try {
    return await CustomerService.changePassword(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Logout customer
export const logoutCustomer = createAsyncThunk('customer/logout', async (_, thunkAPI) => {
  try {
    return await CustomerService.logout();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Search customer by phone (Admin or open, depending on backend)
export const searchCustomerByPhone = createAsyncThunk('customer/searchByPhone', async (phone, thunkAPI) => {
  try {
    return await CustomerService.searchByPhone(phone);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetCustomerState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.customer = null;
      state.newCustomer = null;
      state.searchedCustomer = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.newCustomer = action.payload.customer;
        toast.success(action.payload.message);
      })

      // Login
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.token;
        state.customer = action.payload; // assuming payload has user info
        toast.success('Login successful!');
      })

      // Get all customers
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allCustomers = action.payload;
      })

      // Get customer profile
      .addCase(getCustomerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.customer = action.payload;
      })

      // Update customer
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success('Customer updated successfully!');
      })

      // Forgot password
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success('OTP sent to email!');
      })

      // Verify OTP
      .addCase(verifyOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success('OTP verified!');
      })

      // Change password
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success('Password changed successfully!');
      })

      // Logout customer
      .addCase(logoutCustomer.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = null;
        state.customer = null;
        toast.success('Logged out successfully!');
      })

      // Search customer by phone
      .addCase(searchCustomerByPhone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.searchedCustomer = action.payload;
      })

      // Global pending matcher for all customer actions
      .addMatcher(
        (action) => action.type.startsWith('customer/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;
          state.message = '';
        }
      )

      // Global rejected matcher for all customer actions
      .addMatcher(
        (action) => action.type.startsWith('customer/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload || 'Failed to perform action';
          toast.error(state.message);
        }
      );
  }
});

export const { resetCustomerState } = customerSlice.actions;
export default customerSlice.reducer;
