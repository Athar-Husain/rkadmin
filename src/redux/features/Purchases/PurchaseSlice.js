import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { purchaseAPI } from '../../../utils/api';

const initialState = {
  purchases: [],
  purchase: null,
  reports: null,
  isPurchaseLoading: false,
  isPurchaseSuccess: false,
  isPurchaseError: false,
  message: ''
};

// ----------------
// Helper
// ----------------
const getErrorMessage = (error) =>
  error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Something went wrong';

// ----------------
// Async Thunks
// ----------------

// USER
export const getMyPurchases = createAsyncThunk('purchase/getMyPurchases', async (_, thunkAPI) => {
  try {
    return await purchaseAPI.getMyPurchases();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getPurchaseById = createAsyncThunk('purchase/getPurchaseById', async (id, thunkAPI) => {
  try {
    return await purchaseAPI.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const addRating = createAsyncThunk('purchase/addRating', async ({ id, data }, thunkAPI) => {
  try {
    return await purchaseAPI.addRating(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateFeedback = createAsyncThunk('purchase/updateFeedback', async ({ id, data }, thunkAPI) => {
  try {
    return await purchaseAPI.updateFeedback(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// STAFF
export const recordPurchase = createAsyncThunk('purchase/recordPurchase', async (data, thunkAPI) => {
  try {
    return await purchaseAPI.create(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getStorePurchases = createAsyncThunk('purchase/getStorePurchases', async (storeId, thunkAPI) => {
  try {
    return await purchaseAPI.getByStore(storeId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updatePurchaseStatus = createAsyncThunk('purchase/updatePurchaseStatus', async ({ id, data }, thunkAPI) => {
  try {
    return await purchaseAPI.updateStatus(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const cancelPurchase = createAsyncThunk('purchase/cancelPurchase', async ({ id, data }, thunkAPI) => {
  try {
    return await purchaseAPI.cancel(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// REPORTS
export const getStoreSalesReport = createAsyncThunk('purchase/getStoreSalesReport', async (storeId, thunkAPI) => {
  try {
    return await purchaseAPI.getStoreReport(storeId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getUserSpendingReport = createAsyncThunk('purchase/getUserSpendingReport', async (userId, thunkAPI) => {
  try {
    return await purchaseAPI.getUserSpendingReport(userId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ADMIN
export const getAllPurchases = createAsyncThunk('purchase/getAllPurchases', async (_, thunkAPI) => {
  try {
    return await purchaseAPI.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const refundPurchase = createAsyncThunk('purchase/refundPurchase', async ({ id, data }, thunkAPI) => {
  try {
    return await purchaseAPI.refund(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const deletePurchase = createAsyncThunk('purchase/deletePurchase', async (id, thunkAPI) => {
  try {
    return await purchaseAPI.delete(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ----------------
// Slice
// ----------------
const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    RESET_PURCHASE_STATE: (state) => {
      state.isPurchaseLoading = false;
      state.isPurchaseSuccess = false;
      state.isPurchaseError = false;
      state.message = '';
    },
    CLEAR_PURCHASE: (state) => {
      state.purchase = null;
    }
  },
  extraReducers: (builder) => {
    builder
      //   .addCase(getMyPurchases.fulfilled, (state, action) => {
      //     state.purchases = action.payload.purchases;
      //   })
      .addCase(getAllPurchases.fulfilled, (state, action) => {
        state.purchases = action.payload.purchases || action.payload;
      })
      .addCase(getStoreSalesReport.fulfilled, (state, action) => {
        state.reports = action.payload;
      })
      .addCase(getUserSpendingReport.fulfilled, (state, action) => {
        state.reports = action.payload;
      })

      .addCase(getPurchaseById.fulfilled, (state, action) => {
        state.purchase = action.payload.purchase;
      })
      .addCase(recordPurchase.fulfilled, (state, action) => {
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(refundPurchase.fulfilled, (state, action) => {
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })

      // Global matchers
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isPurchaseLoading = true;
          state.isPurchaseError = false;
          state.message = '';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isPurchaseLoading = false;
          state.isPurchaseSuccess = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isPurchaseLoading = false;
          state.isPurchaseError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { RESET_PURCHASE_STATE, CLEAR_PURCHASE } = purchaseSlice.actions;

export default purchaseSlice.reducer;
