import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import StaffService from './StaffService';

const initialState = {
  staffList: [],
  staff: null,
  profile: null,
  dashboard: null,
  isStaffLoading: false,
  isStaffSuccess: false,
  isStaffError: false,
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

// Public
export const sendOTP = createAsyncThunk('staff/sendOTP', async (data, thunkAPI) => {
  try {
    return await StaffService.sendOTP(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const verifyOTP = createAsyncThunk('staff/verifyOTP', async (data, thunkAPI) => {
  try {
    return await StaffService.verifyOTP(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const forgotPassword = createAsyncThunk('staff/forgotPassword', async (data, thunkAPI) => {
  try {
    return await StaffService.forgotPassword(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const resetPassword = createAsyncThunk('staff/resetPassword', async (data, thunkAPI) => {
  try {
    return await StaffService.resetPassword(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getLoginStatus = createAsyncThunk('staff/getLoginStatus', async (_, thunkAPI) => {
  try {
    return await StaffService.getLoginStatus();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// Staff Protected
export const getProfile = createAsyncThunk('staff/getProfile', async (_, thunkAPI) => {
  try {
    return await StaffService.getProfile();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateProfile = createAsyncThunk('staff/updateProfile', async (data, thunkAPI) => {
  try {
    return await StaffService.updateProfile(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const registerDevice = createAsyncThunk('staff/registerDevice', async (data, thunkAPI) => {
  try {
    return await StaffService.registerDevice(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const logout = createAsyncThunk('staff/logout', async (_, thunkAPI) => {
  try {
    return await StaffService.logout();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getDashboard = createAsyncThunk('staff/getDashboard', async (_, thunkAPI) => {
  try {
    return await StaffService.getDashboard();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// Admin: Staff Management
export const createStaff = createAsyncThunk('staff/createStaff', async (data, thunkAPI) => {
  try {
    return await StaffService.createStaff(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getAllStaff = createAsyncThunk('staff/getAllStaff', async (_, thunkAPI) => {
  try {
    return await StaffService.getAllStaff();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getStaffById = createAsyncThunk('staff/getStaffById', async (id, thunkAPI) => {
  try {
    return await StaffService.getStaffById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateStaff = createAsyncThunk('staff/updateStaff', async ({ id, data }, thunkAPI) => {
  try {
    return await StaffService.updateStaff(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const deleteStaff = createAsyncThunk('staff/deleteStaff', async (id, thunkAPI) => {
  try {
    return await StaffService.deleteStaff(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ----------------
// Slice
// ----------------
const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    RESET_STAFF_STATE: (state) => {
      state.isStaffLoading = false;
      state.isStaffSuccess = false;
      state.isStaffError = false;
      state.message = '';
    },
    CLEAR_STAFF_PROFILE: (state) => {
      state.profile = null;
      state.dashboard = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ----------------
      // Public Thunks
      // ----------------
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })

      // ----------------
      // Staff Protected
      // ----------------
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profile = action.payload.staff;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload.staff;
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload.dashboard;
      })

      // ----------------
      // Admin Staff Management
      // ----------------
      .addCase(getAllStaff.fulfilled, (state, action) => {
        console.log('staffList', action.payload);
        state.staffList = action.payload;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.staffList.push(action.payload.staff);
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        const index = state.staffList.findIndex((s) => s._id === action.payload.staff._id);
        if (index !== -1) state.staffList[index] = action.payload.staff;
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.staffList = state.staffList.filter((s) => s._id !== action.payload.staffId);
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })

      // ----------------
      // Global Matchers
      // ----------------
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isStaffLoading = true;
          state.isStaffError = false;
          state.message = '';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isStaffLoading = false;
          state.isStaffSuccess = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isStaffLoading = false;
          state.isStaffError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { RESET_STAFF_STATE, CLEAR_STAFF_PROFILE } = staffSlice.actions;

export default staffSlice.reducer;
