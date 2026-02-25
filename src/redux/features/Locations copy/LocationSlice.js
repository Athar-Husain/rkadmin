import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import LocationService from './LocationService';

// ================================
// Initial State
// ================================
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

// ================================
// Helper
// ================================
const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Something went wrong';

// ================================
// Async Thunks
// ================================

// ----------------
// Admin
// ----------------
export const createCityAdmin = createAsyncThunk('location/admin/createCity', async (data, thunkAPI) => {
  try {
    return await LocationService.createCity(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const addAreasToCityAdmin = createAsyncThunk('location/admin/addAreas', async ({ city, data }, thunkAPI) => {
  try {
    console.log('city, data', city, data);
    return await LocationService.addAreasToCity(city, data);
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

// ----------------
// Public
// ----------------
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

// ================================
// Slice
// ================================
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
      // ----------------
      // Admin
      // ----------------
      .addCase(createCityAdmin.fulfilled, (state, action) => {
        toast.success(action.payload.message || 'City created successfully');
      })
      .addCase(addAreasToCityAdmin.fulfilled, (state, action) => {
        toast.success(action.payload.message || 'Areas added successfully');
      })
      .addCase(removeAreaFromCityAdmin.fulfilled, (state, action) => {
        toast.success(action.payload.message || 'Area removed successfully');
      })
      .addCase(toggleCityStatusAdmin.fulfilled, (state, action) => {
        toast.success(action.payload.message);
      })
      .addCase(toggleAreaStatusAdmin.fulfilled, (state, action) => {
        toast.success(action.payload.message);
      })
      .addCase(fetchAllCitiesWithAreasAdmin.fulfilled, (state, action) => {
        state.allCitiesWithAreas = action.payload.data;
      })
      .addCase(fetchCityDetailsAdmin.fulfilled, (state, action) => {
        state.cityDetails = action.payload.data;
      })

      // ----------------
      // Public
      // ----------------
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload.data;
      })
      .addCase(fetchAreasByCity.fulfilled, (state, action) => {
        state.areas = action.payload.areas;
      })
      .addCase(validateCityAreaPublic.fulfilled, () => {
        toast.success('Valid city and area');
      })

      // ----------------
      // Matchers
      // ----------------
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLocationLoading = true;
          state.isLocationError = false;
          state.message = '';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isLocationLoading = false;
          state.isLocationSuccess = true;
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
