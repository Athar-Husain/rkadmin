import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import LeadService from './LeadService';

const initialState = {
  leads: [], // For the main list
  lead: null, // For the FollowUpModal details
  isLeadLoading: false,
  isLeadSuccess: false,
  isLeadError: false,
  message: '',
  pagination: { total: 0, page: 1, pages: 1 }
};

const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

/* ============================
   Async Thunks
============================ */

export const getAllLeads = createAsyncThunk('lead/getAll', async (filters, thunkAPI) => {
  try {
    return await LeadService.getAll(filters);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getLeadById = createAsyncThunk('lead/getById', async (id, thunkAPI) => {
  try {
    return await LeadService.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const addLeadFollowUp = createAsyncThunk('lead/addFollowUp', async ({ leadId, data }, thunkAPI) => {
  try {
    return await LeadService.addFollowUp(leadId, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// export const createAdminLead = createAsyncThunk('lead/create', async (data, thunkAPI) => {
//   try {
//     return await LeadService.createAdminLead(data);
//   } catch (error) {
//     return thunkAPI.rejectWithValue(getError(error));
//   }
// });

export const createAdminLead = createAsyncThunk('lead/create', async (data, thunkAPI) => {
  try {
    return await LeadService.createAdminLead(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const bulkUploadLeads = createAsyncThunk('lead/bulkUpload', async (file, thunkAPI) => {
  try {
    return await LeadService.bulkUpload(file);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// export const getLeadDetails = createAsyncThunk(
//   'lead/getDetails',
//   async (leadId, thunkAPI) => {
//     try {
//       const response = await axiosInstance.get(`/leads/${leadId}`);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data.message);
//     }
//   }
// );

/* ============================
   Slice Implementation
============================ */

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    resetLeadState: (state) => {
      state.isLeadLoading = false;
      state.isLeadError = false;
      state.isLeadSuccess = false;
      state.message = '';
      state.lead = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(getAllLeads.fulfilled, (state, action) => {
        state.isLeadLoading = false;
        state.isLeadSuccess = true;
        state.leads = action.payload.data.leads;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages
        };
      })

      // Fetch Single Lead (for Modal)
      .addCase(getLeadById.fulfilled, (state, action) => {
        state.isLeadLoading = false;
        state.isLeadSuccess = true;
        state.lead = action.payload.data.lead;
      })

      // Update Lead (Follow-up)
      .addCase(addLeadFollowUp.fulfilled, (state, action) => {
        state.isLeadLoading = false;
        state.isLeadSuccess = true;
        const updatedLead = action.payload.data.lead;

        // Update it in the list array
        const index = state.leads.findIndex((l) => l._id === updatedLead._id);
        if (index !== -1) state.leads[index] = updatedLead;

        // Update the active modal lead
        state.lead = updatedLead;
        toast.success('Follow-up recorded');
      })
      .addCase(createAdminLead.fulfilled, (state, action) => {
        state.isLeadLoading = false;
        state.leads.unshift(action.payload.data.lead);
        toast.success('Lead added successfully');
      })
      .addCase(bulkUploadLeads.fulfilled, (state) => {
        state.isLeadLoading = false;
        toast.success('Bulk import complete');
      })

      /* Global Matchers for Loading/Errors */
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLeadLoading = true;
          state.isLeadError = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLeadLoading = false;
          state.isLeadError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { resetLeadState } = leadSlice.actions;
export default leadSlice.reducer;
