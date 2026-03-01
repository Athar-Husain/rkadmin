import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { storeAPI } from '../../../utils/api';

// ================================
// Initial State
// ================================

const token = localStorage.getItem('access_token');
const tokenExpiry = localStorage.getItem('token_expiry');

const initialState = {
  stores: [],
  store: null,
  nearbyStores: [],
  storeDashboard: null,
  isStaffLoggedIn: !!(token && tokenExpiry && Date.now() < +tokenExpiry),
  isStoreLoading: false,
  isStoreSuccess: false,
  isStoreError: false,
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
// Public
// ----------------
export const fetchStores = createAsyncThunk('store/fetchStores', async (params, thunkAPI) => {
  try {
    return await storeAPI.getAll(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchStoreById = createAsyncThunk('store/fetchStoreById', async (id, thunkAPI) => {
  try {
    return await storeAPI.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchStoreHours = createAsyncThunk('store/fetchStoreHours', async (id, thunkAPI) => {
  try {
    return await storeAPI.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchNearbyStores = createAsyncThunk('store/fetchNearby', async (params, thunkAPI) => {
  try {
    return await storeAPI.getNearby(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ----------------
// Staff
// ----------------
export const staffLogin = createAsyncThunk('store/staffLogin', async (credentials, thunkAPI) => {
  try {
    return await storeAPI.getById(credentials.storeId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getDashboard = createAsyncThunk('store/getDashboard', async (id, thunkAPI) => {
  try {
    return await storeAPI.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ----------------
// Admin
// ----------------
export const createStoreAdmin = createAsyncThunk('store/admin/create', async (data, thunkAPI) => {
  try {
    return await storeAPI.create(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAllStoresAdmin = createAsyncThunk('store/admin/fetchAll', async (_, thunkAPI) => {
  try {
    // console.log('storeAPI.getAll()', storeAPI.getAll());
    return await storeAPI.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchStoreByIdAdmin = createAsyncThunk('store/admin/fetchById', async (id, thunkAPI) => {
  try {
    return await storeAPI.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateStoreAdmin = createAsyncThunk('store/admin/update', async ({ id, data }, thunkAPI) => {
  try {
    return await storeAPI.update(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const toggleStoreStatusAdmin = createAsyncThunk('store/admin/toggleStatus', async (id, thunkAPI) => {
  try {
    return await storeAPI.toggleStatus(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// Slice
// ================================
const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    RESET: (state) => {
      state.isStoreLoading = false;
      state.isStoreSuccess = false;
      state.isStoreError = false;
      state.message = '';
    },
    LOGOUT_STAFF: (state) => {
      state.isStaffLoggedIn = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_expiry');
    }
  },
  extraReducers: (builder) => {
    builder
      // ----------------
      // Public
      // ----------------
      .addCase(fetchStores.pending, (state) => {
        state.isStoreLoading = true;
      })
      // .addCase(fetchStores.fulfilled, (state, action) => {
      //   state.isStoreLoading = false;
      //   state.stores = action.payload;
      // })
      // .addCase(fetchStores.rejected, (state, action) => {
      //   state.isStoreLoading = false;
      //   state.isStoreError = true;
      //   state.message = action.payload;
      //   toast.error(action.payload);
      // })

      .addCase(fetchStoreById.pending, (state) => {
        state.isStoreLoading = true;
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.isStoreLoading = false;
        state.store = action.payload;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.isStoreLoading = false;
        state.isStoreError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(fetchNearbyStores.fulfilled, (state, action) => {
        state.nearbyStores = action.payload;
      })

      // ----------------
      // Staff
      // ----------------
      .addCase(staffLogin.fulfilled, (state, action) => {
        state.isStaffLoggedIn = true;
        toast.success('Staff logged in');
      })
      .addCase(staffLogin.rejected, (state, action) => {
        state.isStaffLoggedIn = false;
        state.isStoreError = true;
        toast.error(action.payload);
      })

      .addCase(getDashboard.fulfilled, (state, action) => {
        state.storeDashboard = action.payload;
      })

      // ----------------
      // Admin
      // ----------------
      .addCase(fetchAllStoresAdmin.fulfilled, (state, action) => {
        state.stores = action.payload.stores;
        // console.log('action.payload', action.payload);
      })
      .addCase(createStoreAdmin.fulfilled, (state, action) => {
        state.stores.push(action.payload);
        toast.success('Store created successfully');
      })
      .addCase(updateStoreAdmin.fulfilled, (state, action) => {
        const index = state.stores.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) state.stores[index] = action.payload;
        toast.success('Store updated successfully');
      })
      .addCase(toggleStoreStatusAdmin.fulfilled, (state, action) => {
        const index = state.stores.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) state.stores[index].isActive = action.payload.isActive;
        toast.info(`Store ${action.payload.isActive ? 'activated' : 'deactivated'}`);
      });
  }
});

export const { RESET, LOGOUT_STAFF } = storeSlice.actions;
export default storeSlice.reducer;
