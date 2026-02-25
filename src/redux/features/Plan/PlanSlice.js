// src/features/plan/planSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import PlanService from './PlanService';

const initialState = {
  allPlans: [],
  plan: null,
  categories: [],
  category: null,
  isPlanLoading: false,
  isPlanSuccess: false,
  isPlanError: false,
  message: ''
};

const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

// ---------- Plan Thunks ----------
export const createPlan = createAsyncThunk('plan/create', async (data, thunkAPI) => {
  try {
    return await PlanService.createPlan(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getAllPlans = createAsyncThunk('plan/getAll', async (_, thunkAPI) => {
  try {
    return await PlanService.getAllPlans();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getPlanById = createAsyncThunk('plan/getById', async (id, thunkAPI) => {
  try {
    return await PlanService.getPlanById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const updatePlan = createAsyncThunk('plan/update', async ({ id, data }, thunkAPI) => {
  try {
    return await PlanService.updatePlan(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const deletePlan = createAsyncThunk('plan/delete', async (id, thunkAPI) => {
  try {
    return await PlanService.deletePlan(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getPlansByCriteria = createAsyncThunk('plan/search', async (params, thunkAPI) => {
  try {
    return await PlanService.getPlansByCriteria(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const subscribeToPlan = createAsyncThunk('plan/subscribe', async (data, thunkAPI) => {
  try {
    return await PlanService.subscribeToPlan(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getCustomerCurrentPlan = createAsyncThunk('plan/current', async (_, thunkAPI) => {
  try {
    return await PlanService.getCustomerCurrentPlan();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const renewSubscription = createAsyncThunk('plan/renew', async (data, thunkAPI) => {
  try {
    return await PlanService.renewSubscription(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const checkPlanExpiry = createAsyncThunk('plan/expiry', async (_, thunkAPI) => {
  try {
    return await PlanService.checkPlanExpiry();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// ---------- Plan Category Thunks ----------
export const createPlanCategory = createAsyncThunk('planCategory/create', async (data, thunkAPI) => {
  try {
    return await PlanService.createPlanCategory(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getAllPlanCategories = createAsyncThunk('planCategory/getAll', async (_, thunkAPI) => {
  try {
    return await PlanService.getAllPlanCategories();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getPlanCategoryById = createAsyncThunk('planCategory/getById', async (id, thunkAPI) => {
  try {
    return await PlanService.getPlanCategoryById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const updatePlanCategory = createAsyncThunk('planCategory/update', async ({ id, data }, thunkAPI) => {
  try {
    return await PlanService.updatePlanCategory(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const deletePlanCategory = createAsyncThunk('planCategory/delete', async (id, thunkAPI) => {
  try {
    return await PlanService.deletePlanCategory(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    resetPlanState: (state) => {
      state.isPlanLoading = false;
      state.isPlanError = false;
      state.isPlanSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Plan Actions ---
      .addCase(createPlan.fulfilled, (state) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        toast.success('Plan created successfully!');
      })
      .addCase(getAllPlans.fulfilled, (state, action) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        state.allPlans = action.payload.plans || [];
      })
      .addCase(getPlanById.fulfilled, (state, action) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        state.plan = action.payload;
      })
      .addCase(updatePlan.fulfilled, (state) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        toast.success('Plan updated successfully!');
      })
      .addCase(deletePlan.fulfilled, (state) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        toast.success('Plan deleted successfully!');
      })
      .addCase(getPlansByCriteria.fulfilled, (state, action) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        state.allPlans = action.payload.plans || [];
      })

      .addCase(subscribeToPlan.fulfilled, (state) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        toast.success('Successfully subscribed to the plan!');
      })

      .addCase(getCustomerCurrentPlan.fulfilled, (state, action) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        state.plan = action.payload;
      })

      .addCase(renewSubscription.fulfilled, (state) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        toast.success('Subscription renewed successfully!');
      })

      .addCase(checkPlanExpiry.fulfilled, (state) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        toast.success('Plan expiry checked!');
      })

      // --- Plan Category Actions ---
      .addCase(createPlanCategory.fulfilled, (state) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        toast.success('Category created successfully!');
      })

      .addCase(getAllPlanCategories.fulfilled, (state, action) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        state.categories = action.payload;
      })

      .addCase(getPlanCategoryById.fulfilled, (state, action) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        state.category = action.payload;
      })

      .addCase(updatePlanCategory.fulfilled, (state) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        toast.success('Category updated successfully!');
      })

      .addCase(deletePlanCategory.fulfilled, (state) => {
        state.isPlanLoading = false;
        state.isPlanSuccess = true;
        toast.success('Category deleted successfully!');
      })

      // --- Matchers for pending and rejected ---
      .addMatcher(
        (action) => action.type.startsWith('plan') && action.type.endsWith('/pending'),
        (state) => {
          state.isPlanLoading = true;
          state.isPlanError = false;
          state.isPlanSuccess = false;
          state.message = '';
        }
      )

      .addMatcher(
        (action) => action.type.startsWith('plan') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isPlanLoading = false;
          state.isPlanError = true;
          state.isPlanSuccess = false;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { resetPlanState } = planSlice.actions;
export default planSlice.reducer;
