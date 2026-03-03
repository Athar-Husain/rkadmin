import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { couponAPI } from '../../../utils/api';

const initialState = {
  coupons: [],
  myCoupons: [],
  coupon: null,
  redemptionHistory: [],
  analytics: null,
  isCouponLoading: false,
  isCouponSuccess: false,
  isCouponError: false,
  message: '',
  dynamicCategories: [],
  dynamicBrands: []
};

const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong';

// --- Thunks ---
export const createCouponAdmin = createAsyncThunk('coupon/admin/create', async (data, thunkAPI) => {
  try {
    const response = await couponAPI.create(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateCouponAdmin = createAsyncThunk('coupon/admin/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await couponAPI.update(id, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAllCouponsAdmin = createAsyncThunk('coupon/admin/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await couponAPI.getAll();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const dynamicOptions = createAsyncThunk('coupon/admin/dynamicOptions', async (_, thunkAPI) => {
  try {
    const response = await couponAPI.dynamicOptions();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchRedemptionHistoryAdmin = createAsyncThunk('coupon/admin/redemptionHistory', async (id, thunkAPI) => {
  try {
    const response = await couponAPI.getRedemptions(id);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    RESET_COUPON_STATE: (state) => {
      state.isCouponLoading = false;
      state.isCouponSuccess = false;
      state.isCouponError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createCouponAdmin.fulfilled, (state, action) => {
        state.coupons.unshift(action.payload.coupon);
        toast.success('Coupon created successfully');
      })
      // Update
      .addCase(updateCouponAdmin.fulfilled, (state, action) => {
        const index = state.coupons.findIndex((c) => c._id === action.payload.coupon._id);
        if (index !== -1) {
          state.coupons[index] = action.payload.coupon;
        }
        toast.success('Coupon updated successfully');
      })
      // Fetch All
      .addCase(fetchAllCouponsAdmin.fulfilled, (state, action) => {
        console.log("action payload", action.payload)
        state.coupons = action.payload || [];
      })
      // Dynamic Options (Categories/Brands)
      .addCase(dynamicOptions.fulfilled, (state, action) => {
        // Checking for nested 'dynamicOptions' property based on your controller structure
        const options = action.payload.dynamicOptions || action.payload;
        state.dynamicCategories = options.categories || [];
        state.dynamicBrands = options.brands || [];
      })
      // Redemption History
      .addCase(fetchRedemptionHistoryAdmin.fulfilled, (state, action) => {
        state.redemptionHistory = action.payload.redemptions || [];
      })

      // Global Matchers for Loading/Error
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isCouponLoading = true;
          state.isCouponError = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isCouponLoading = false;
          state.isCouponSuccess = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isCouponLoading = false;
          state.isCouponError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { RESET_COUPON_STATE } = couponSlice.actions;
export default couponSlice.reducer;
