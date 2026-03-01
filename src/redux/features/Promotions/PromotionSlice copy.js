import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
// import { promotionAPI } from 'utils/api';
import { promotionAPI } from '../../../utils/api';
// import { promotionAPI } from '../../utils/api';

// ================================
// Initial State
// ================================
const initialState = {
  promotions: [],
  promotion: null,
  analytics: null,
  isPromotionLoading: false,
  isPromotionSuccess: false,
  isPromotionError: false,
  message: ''
};

// ================================
// Helper: Extract error messages
// ================================
const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong';

// ================================
// Async Thunks
// ================================

// ----------------
// Admin
// ----------------
export const createPromotion = createAsyncThunk('promotion/create', async (data, thunkAPI) => {
  try {
    return await promotionAPI.create(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAllPromotions = createAsyncThunk('promotion/fetchAll', async (_, thunkAPI) => {
  try {
    return await promotionAPI.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getPromotionById = createAsyncThunk('promotion/getById', async (id, thunkAPI) => {
  try {
    return await promotionAPI.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updatePromotion = createAsyncThunk('promotion/update', async ({ id, data }, thunkAPI) => {
  try {
    return await promotionAPI.update(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const deletePromotion = createAsyncThunk('promotion/delete', async (id, thunkAPI) => {
  try {
    return await promotionAPI.delete(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getPromotionAnalytics = createAsyncThunk('promotion/analytics', async (id, thunkAPI) => {
  try {
    return await promotionAPI.getAnalytics(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ----------------
// User
// ----------------
export const fetchActivePromotions = createAsyncThunk('promotion/fetchActive', async (params, thunkAPI) => {
  try {
    return await promotionAPI.getActive(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const applyPromotion = createAsyncThunk('promotion/apply', async (data, thunkAPI) => {
  try {
    return await promotionAPI.apply(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// Slice
// ================================
const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {
    RESET_PROMOTION_STATE: (state) => {
      state.isPromotionLoading = false;
      state.isPromotionSuccess = false;
      state.isPromotionError = false;
      state.message = '';
    },
    CLEAR_PROMOTION_DETAILS: (state) => {
      state.promotion = null;
      state.analytics = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ----------------
      // Admin
      // ----------------
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.promotions.push(action.payload.promotion);
        toast.success('Promotion created successfully');
      })
      .addCase(fetchAllPromotions.fulfilled, (state, action) => {
        state.promotions = action.payload.promotions;
      })
      .addCase(getPromotionById.fulfilled, (state, action) => {
        state.promotion = action.payload.promotion;
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        const index = state.promotions.findIndex((p) => p._id === action.payload.promotion._id);
        if (index !== -1) state.promotions[index] = action.payload.promotion;
        toast.success('Promotion updated successfully');
      })
      .addCase(deletePromotion.fulfilled, (state, action) => {
        state.promotions = state.promotions.filter((p) => p._id !== action.payload.promotionId);
        toast.success('Promotion deleted successfully');
      })
      .addCase(getPromotionAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload.analytics;
      })

      // ----------------
      // User
      // ----------------
      .addCase(fetchActivePromotions.fulfilled, (state, action) => {
        state.promotions = action.payload.promotions;
      })
      .addCase(applyPromotion.fulfilled, (state, action) => {
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })

      // ----------------
      // Global Matchers
      // ----------------
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isPromotionLoading = true;
          state.isPromotionError = false;
          state.message = '';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isPromotionLoading = false;
          state.isPromotionSuccess = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isPromotionLoading = false;
          state.isPromotionError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { RESET_PROMOTION_STATE, CLEAR_PROMOTION_DETAILS } = promotionSlice.actions;
export default promotionSlice.reducer;
