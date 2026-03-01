import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { bannerAPI } from '../../../utils/api';

// ================================
// Initial State
// ================================
const initialState = {
  banners: [],
  banner: null,
  isBannerLoading: false,
    isBannerSuccess: false,
  isBannerError: false,
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
// Admin Actions
// ----------------
export const createBanner = createAsyncThunk('banner/create', async (data, thunkAPI) => {
  try {
    return await bannerAPI.create(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAllBanners = createAsyncThunk('banner/fetchAll', async (_, thunkAPI) => {
  try {
    return await bannerAPI.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getBannerById = createAsyncThunk('banner/getById', async (id, thunkAPI) => {
  try {
    return await bannerAPI.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateBanner = createAsyncThunk('banner/update', async ({ id, data }, thunkAPI) => {
  try {
    return await bannerAPI.update(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const deleteBanner = createAsyncThunk('banner/delete', async (id, thunkAPI) => {
  try {
    return await bannerAPI.delete(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ----------------
// User Actions
// ----------------
export const fetchActiveBanners = createAsyncThunk('banner/fetchActive', async (params, thunkAPI) => {
  try {
    return await bannerAPI.getActive(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// Slice
// ================================
const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    RESET_BANNER_STATE: (state) => {
      state.isBannerLoading = false;
      state.isBannerSuccess = false;
      state.isBannerError = false;
      state.message = '';
    },
    CLEAR_BANNER_DETAILS: (state) => {
      state.banner = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ----------------
      // Admin Fulfilled
      // ----------------
      .addCase(createBanner.fulfilled, (state, action) => {
        state.banners.push(action.payload.data);
        toast.success('Banner created successfully');
      })
      .addCase(fetchAllBanners.fulfilled, (state, action) => {
        // console.log("action.payload", action.payload)
        state.banners = action.payload;
      })
      .addCase(getBannerById.fulfilled, (state, action) => {
        state.banner = action.payload.data;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        const index = state.banners.findIndex((b) => b._id === action.payload.data._id);
        if (index !== -1) state.banners[index] = action.payload.data;
        toast.success('Banner updated successfully');
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter((b) => b._id !== action.meta.arg);
        toast.success('Banner deleted successfully');
      })

      // ----------------
      // User Fulfilled
      // ----------------
      .addCase(fetchActiveBanners.fulfilled, (state, action) => {
        state.banners = action.payload.data;
      })

      // ----------------
      // Global Matchers
      // ----------------
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isBannerLoading = true;
          state.isBannerError = false;
          state.message = '';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isBannerLoading = false;
          state.isBannerSuccess = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isBannerLoading = false;
          state.isBannerError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { RESET_BANNER_STATE, CLEAR_BANNER_DETAILS } = bannerSlice.actions;
export default bannerSlice.reducer;
