// src/features/connection/connectionSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import ConnectionService from './ConnectionService';

const initialState = {
  connections: [],
  newConnection: null,
  connection: null,
  isConnectionLoading: false,
  isConnectionSuccess: false,
  isConnectionError: false,
  message: ''
};

// Helper to extract error message
const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

// Async Thunks

export const createConnection = createAsyncThunk('connection/create', async (data, thunkAPI) => {
  try {
    return await ConnectionService.create(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getAllConnections = createAsyncThunk('connection/getAll', async (_, thunkAPI) => {
  try {
    return await ConnectionService.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getConnectionById = createAsyncThunk('connection/getById', async (id, thunkAPI) => {
  try {
    return await ConnectionService.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const updateConnection = createAsyncThunk('connection/update', async ({ id, data }, thunkAPI) => {
  try {
    return await ConnectionService.update(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const deactivateConnection = createAsyncThunk('connection/deactivate', async (id, thunkAPI) => {
  try {
    return await ConnectionService.deactivate(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const deleteConnection = createAsyncThunk('connection/delete', async (id, thunkAPI) => {
  try {
    return await ConnectionService.delete(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getFilteredConnections = createAsyncThunk('connection/getFiltered', async (query, thunkAPI) => {
  try {
    return await ConnectionService.getFiltered(query);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const updateSubscribedPlan = createAsyncThunk('connection/updateSubscribedPlan', async (data, thunkAPI) => {
  try {
    return await ConnectionService.updateSubscribedPlan(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getSubscribedPlans = createAsyncThunk('connection/getSubscribedPlans', async (connectionId, thunkAPI) => {
  try {
    return await ConnectionService.getSubscribedPlans(connectionId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Slice

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    resetConnectionState: (state) => {
      state.isConnectionLoading = false;
      state.isConnectionError = false;
      state.isConnectionSuccess = false;
      state.message = '';
      state.connection = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createConnection.fulfilled, (state, action) => {
        state.isConnectionLoading = false;
        state.isConnectionSuccess = true;
        // state.connections.push(action.payload);
        state.newConnection = action.payload.connection;
        toast.success('Connection created successfully!');
      })

      // GET ALL
      .addCase(getAllConnections.fulfilled, (state, action) => {
        state.isConnectionLoading = false;
        state.isConnectionSuccess = true;
        state.connections = action.payload;
      })

      // GET BY ID
      .addCase(getConnectionById.fulfilled, (state, action) => {
        state.isConnectionLoading = false;
        state.isConnectionSuccess = true;
        state.connection = action.payload;
      })

      // UPDATE
      .addCase(updateConnection.fulfilled, (state, action) => {
        state.isConnectionLoading = false;
        state.isConnectionSuccess = true;
        toast.success('Connection updated successfully!');
        // Update the item in connections list (optional)
        const index = state.connections.findIndex((conn) => conn._id === action.payload._id);
        if (index !== -1) {
          state.connections[index] = action.payload;
        }
      })

      // DEACTIVATE
      .addCase(deactivateConnection.fulfilled, (state, action) => {
        state.isConnectionLoading = false;
        state.isConnectionSuccess = true;
        toast.success('Connection deactivated successfully!');
        // Optional: update the connection in list
        const index = state.connections.findIndex((conn) => conn._id === action.payload._id);
        if (index !== -1) {
          state.connections[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteConnection.fulfilled, (state, action) => {
        state.isConnectionLoading = false;
        state.isConnectionSuccess = true;
        toast.success('Connection deleted successfully!');
        state.connections = state.connections.filter((conn) => conn._id !== action.meta.arg);
      })

      // GET FILTERED
      .addCase(getFilteredConnections.fulfilled, (state, action) => {
        state.isConnectionLoading = false;
        state.isConnectionSuccess = true;
        state.connections = action.payload;
      })

      // UPDATE SUBSCRIBED PLAN
      .addCase(updateSubscribedPlan.fulfilled, (state, action) => {
        state.isConnectionLoading = false;
        state.isConnectionSuccess = true;
        toast.success('Subscribed plan updated successfully!');
      })

      // GET SUBSCRIBED PLANS
      .addCase(getSubscribedPlans.fulfilled, (state, action) => {
        state.isConnectionLoading = false;
        state.isConnectionSuccess = true;
        state.connection = {
          ...state.connection,
          activePlan: action.payload.activePlan,
          planHistory: action.payload.planHistory
        };
      })

      // Global pending and rejected matchers
      .addMatcher(
        (action) => action.type.startsWith('connection/') && action.type.endsWith('/pending'),
        (state) => {
          state.isConnectionLoading = true;
          state.isConnectionError = false;
          state.isConnectionSuccess = false;
          state.message = '';
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('connection/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isConnectionLoading = false;
          state.isConnectionError = true;
          state.isConnectionSuccess = false;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { resetConnectionState } = connectionSlice.actions;
export default connectionSlice.reducer;
