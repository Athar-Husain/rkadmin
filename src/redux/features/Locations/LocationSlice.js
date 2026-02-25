import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import LocationService from './LocationService';

const initialState = {
  cities: [],
  areas: [],
  cityDetails: null,
  allCitiesWithAreas: [],
  isLocationLoading: false,
  isLocationSuccess: false,
  isLocationError: false,
  message: ''
};

const getErrorMessage = (error) =>
  error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Something went wrong';

// ASYNC THUNKS
export const createCityAdmin = createAsyncThunk('location/admin/createCity', async (data, thunkAPI) => {
  try {
    return await LocationService.createCity(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const addAreasToCityAdmin = createAsyncThunk('location/admin/addAreas', async ({ city, areas }, thunkAPI) => {
  try {
    // Pass the areas array directly
    return await LocationService.addAreasToCity(city, areas);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const removeAreaFromCityAdmin = createAsyncThunk('location/admin/removeArea', async ({ city, area }, thunkAPI) => {
  try {
    return await LocationService.removeAreaFromCity(city, area);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const toggleCityStatusAdmin = createAsyncThunk('location/admin/toggleCityStatus', async (city, thunkAPI) => {
  try {
    return await LocationService.toggleCityStatus(city);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const toggleAreaStatusAdmin = createAsyncThunk('location/admin/toggleAreaStatus', async ({ city, area }, thunkAPI) => {
  try {
    return await LocationService.toggleAreaStatus(city, area);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAllCitiesWithAreasAdmin = createAsyncThunk('location/admin/fetchAllCitiesWithAreas', async (_, thunkAPI) => {
  try {
    return await LocationService.getAllCitiesWithAreas();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchCityDetailsAdmin = createAsyncThunk('location/admin/fetchCityDetails', async (city, thunkAPI) => {
  try {
    return await LocationService.getCityDetails(city);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchCities = createAsyncThunk('location/public/fetchCities', async (_, thunkAPI) => {
  try {
    return await LocationService.getCities();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAreasByCity = createAsyncThunk('location/public/fetchAreasByCity', async (city, thunkAPI) => {
  try {
    return await LocationService.getAreasByCity(city);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const validateCityAreaPublic = createAsyncThunk('location/public/validateCityArea', async (data, thunkAPI) => {
  try {
    return await LocationService.validateCityArea(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// SLICE
const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    RESET_LOCATION_STATE: (state) => {
      state.isLocationLoading = false;
      state.isLocationSuccess = false;
      state.isLocationError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCitiesWithAreasAdmin.fulfilled, (state, action) => {
        state.allCitiesWithAreas = action.payload.data;
      })
      .addCase(fetchCityDetailsAdmin.fulfilled, (state, action) => {
        state.cityDetails = action.payload.data;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload.data; // Array of strings from controller
      })
      .addCase(fetchAreasByCity.fulfilled, (state, action) => {
        state.areas = action.payload.areas; // Key is 'areas' in your controller
      })
      .addCase(validateCityAreaPublic.fulfilled, (state, action) => {
        toast.success(action.payload.message || 'Valid city and area');
      })
      // Global Matchers for UI State
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLocationLoading = true;
          state.isLocationError = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.isLocationLoading = false;
          state.isLocationSuccess = true;
          // Only show success toasts for mutations (POST/PATCH/DELETE)
          if (
            action.type.includes('create') ||
            action.type.includes('add') ||
            action.type.includes('toggle') ||
            action.type.includes('remove')
          ) {
            toast.success(action.payload.message);
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLocationLoading = false;
          state.isLocationError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { RESET_LOCATION_STATE } = locationSlice.actions;
export default locationSlice.reducer;
