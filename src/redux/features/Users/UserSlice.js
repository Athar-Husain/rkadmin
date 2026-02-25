import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import UserService from './UserService';

// ================================
// Initial State
// ================================
const initialState = {
  users: [], // Admin: all users
  user: null, // Single user / logged-in profile
  isUserLoading: false,
  isUserSuccess: false,
  isUserError: false,
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
export const fetchAllUsersAdmin = createAsyncThunk('user/admin/fetchAll', async (_, thunkAPI) => {
  try {
    return await UserService.getAllUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getUserByIdAdmin = createAsyncThunk('user/admin/getById', async (id, thunkAPI) => {
  try {
    return await UserService.getUserById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateUserByAdmin = createAsyncThunk('user/admin/update', async ({ id, data }, thunkAPI) => {
  try {
    return await UserService.updateUserByAdmin(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const deleteUserByAdmin = createAsyncThunk('user/admin/delete', async (id, thunkAPI) => {
  try {
    return await UserService.deleteUserByAdmin(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ----------------
// User / Protected
// ----------------
export const registerUser = createAsyncThunk('user/register', async (data, thunkAPI) => {
  try {
    return await UserService.registerUser(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getProfile = createAsyncThunk('user/getProfile', async (_, thunkAPI) => {
  try {
    return await UserService.getProfile();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateProfile = createAsyncThunk('user/updateProfile', async (data, thunkAPI) => {
  try {
    return await UserService.updateProfile(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updatePreferences = createAsyncThunk('user/updatePreferences', async (data, thunkAPI) => {
  try {
    return await UserService.updatePreferences(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// Slice
// ================================
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    RESET_USER_STATE: (state) => {
      state.isUserLoading = false;
      state.isUserSuccess = false;
      state.isUserError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // ----------------
      // Admin
      // ----------------
      .addCase(fetchAllUsersAdmin.fulfilled, (state, action) => {
        state.users = action.payload.users;
      })
      .addCase(getUserByIdAdmin.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload.user._id);
        if (index !== -1) state.users[index] = action.payload.user;
        toast.success('User updated successfully');
      })
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload.user._id);
        toast.success('User deleted successfully');
      })

      // ----------------
      // User / Protected
      // ----------------
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        toast.success('User registered successfully');
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        toast.success('Profile updated successfully');
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.user = action.payload.user;
        toast.success('Preferences updated successfully');
      })

      // ----------------
      // Error handling
      // ----------------
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isUserLoading = false;
          state.isUserError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isUserLoading = true;
          state.isUserError = false;
          state.message = '';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isUserLoading = false;
          state.isUserSuccess = true;
        }
      );
  }
});

export const { RESET_USER_STATE } = userSlice.actions;
export default userSlice.reducer;
