import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import notificationService from './NotificationService';

const initialState = {
  notifications: [],
  hasSeenTray: false, // Local UI state to clear the red badge
  isNotificationLoading: false,
  isNotificationError: false,
  isNotificationSuccess: false,
  notificationMessage: ''
};

const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

export const getNotifications = createAsyncThunk('notifications/getNotifications', async (_, thunkAPI) => {
  try {
    return await notificationService.getNotificationsForUser();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const markAsRead = createAsyncThunk('notifications/markAsRead', async (notificationId, thunkAPI) => {
  try {
    return await notificationService.markNotificationAsRead(notificationId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const deleteNotification = createAsyncThunk('notifications/delete', async (notificationId, thunkAPI) => {
  try {
    await notificationService.deleteNotification(notificationId);
    return notificationId;
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Register FCM token
export const registerFCMToken = createAsyncThunk('notifications/registerToken', async (data, thunkAPI) => {
  try {
    return await notificationService.registerCustomerFCMToken(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Unregister FCM token
export const unregisterFCMToken = createAsyncThunk('notifications/unregisterToken', async (data, thunkAPI) => {
  try {
    return await notificationService.unregisterCustomerFCMToken(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearBadge: (state) => {
      state.hasSeenTray = true;
    },
    resetNotificationState: (state) => {
      state.isNotificationLoading = false;
      state.isNotificationError = false;
      state.isNotificationSuccess = false;
      state.notificationMessage = '';
      state.hasSeenTray = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isNotificationLoading = false;
        state.isNotificationSuccess = true;
        state.notifications = action.payload;
        // If new notifications arrive, we might want to show the badge again
        // state.hasSeenTray = false;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const idx = state.notifications.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) state.notifications[idx] = action.payload;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((n) => n._id !== action.payload);
        toast.warn('Notification deleted');
      })

      // 🔹 FCM token registration/unregistration
      .addCase(registerFCMToken.fulfilled, (state) => {
        state.isNotificationSuccess = true;
      })
      .addCase(unregisterFCMToken.fulfilled, (state) => {
        state.isNotificationSuccess = true;
      })

      .addMatcher(
        (action) => action.type.startsWith('notifications/') && action.type.endsWith('/pending'),
        (state) => {
          state.isNotificationLoading = true;
          state.isNotificationError = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('notifications/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isNotificationLoading = false;
          state.isNotificationError = true;
          const msg = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Error';
          state.notificationMessage = msg;
          toast.error(msg);
        }
      );
  }
});

export const { resetNotificationState, clearBadge } = notificationSlice.actions;
export default notificationSlice.reducer;
