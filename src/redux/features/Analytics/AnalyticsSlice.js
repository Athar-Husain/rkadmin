import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { analyticsAPI } from '../../../utils/api';

// ================================
// Initial State
// ================================
const initialState = {
  salesAnalytics: null,
  userAnalytics: null,
  couponAnalytics: null,
  storeAnalytics: null,

  isAnalyticsLoading: false,
  isAnalyticsSuccess: false,
  isAnalyticsError: false,
  message: ''
};

// ================================
// Error Helper
// ================================
const getErrorMessage = (error) =>
  error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Something went wrong';

// ================================
// ASYNC THUNKS
// ================================
export const fetchSalesAnalytics = createAsyncThunk('analytics/fetchSales', async (params, thunkAPI) => {
  try {
    const response = await analyticsAPI.getSales(params);

    console.log('response', response);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchUserAnalytics = createAsyncThunk('analytics/fetchUsers', async (params, thunkAPI) => {
  try {
    const response = await analyticsAPI.getUsers(params);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchCouponAnalytics = createAsyncThunk('analytics/fetchCoupons', async (params, thunkAPI) => {
  try {
    const response = await analyticsAPI.getCoupons(params);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchStoreAnalytics = createAsyncThunk('analytics/fetchStores', async (params, thunkAPI) => {
  try {
    const response = await analyticsAPI.getStores(params);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// SLICE
// ================================
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    RESET_ANALYTICS_STATE: (state) => {
      state.isAnalyticsLoading = false;
      state.isAnalyticsSuccess = false;
      state.isAnalyticsError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder

      // =====================
      // SUCCESS HANDLERS
      // =====================
      .addCase(fetchSalesAnalytics.fulfilled, (state, action) => {
        console.log('fetchSalesAnalytics', action.payload);
        state.salesAnalytics = action.payload;
      })

      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.userAnalytics = action.payload;
      })

      .addCase(fetchCouponAnalytics.fulfilled, (state, action) => {
        state.couponAnalytics = action.payload;
      })

      .addCase(fetchStoreAnalytics.fulfilled, (state, action) => {
        state.storeAnalytics = action.payload;
      })

      // =====================
      // GLOBAL MATCHERS
      // =====================
      .addMatcher(
        (action) => action.type.startsWith('analytics/') && action.type.endsWith('/pending'),
        (state) => {
          state.isAnalyticsLoading = true;
          state.isAnalyticsError = false;
          state.isAnalyticsSuccess = false;
        }
      )

      .addMatcher(
        (action) => action.type.startsWith('analytics/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.isAnalyticsLoading = false;
          state.isAnalyticsSuccess = true;
        }
      )

      .addMatcher(
        (action) => action.type.startsWith('analytics/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isAnalyticsLoading = false;
          state.isAnalyticsError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { RESET_ANALYTICS_STATE } = analyticsSlice.actions;
export default analyticsSlice.reducer;
