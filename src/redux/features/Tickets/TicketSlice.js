// src/redux/features/Tickets/TicketSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import TicketService from './TicketService';
import { toast } from 'react-toastify';

const initialState = {
  allTickets: [],
  customerTickets: [],
  ticket: null,
  publicComments: [],
  privateComments: [],
  attachments: [],
  isTicketLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

// ✅ Async Thunks
export const createTicket = createAsyncThunk('ticket/create', async (data, thunkAPI) => {
  try {
    return await TicketService.create(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const createInternalTicket = createAsyncThunk('ticket/createInternal', async (data, thunkAPI) => {
  try {
    return await TicketService.createInternal(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const createFlexibleTicket = createAsyncThunk('ticket/createFlexible', async (data, thunkAPI) => {
  try {
    return await TicketService.createFlexible(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getAllTickets = createAsyncThunk('ticket/getAll', async (query, thunkAPI) => {
  try {
    return await TicketService.getAll(query);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getTicketById = createAsyncThunk('ticket/getById', async (id, thunkAPI) => {
  try {
    return await TicketService.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getCustomerTickets = createAsyncThunk('ticket/getCustomerTickets', async (customerId, thunkAPI) => {
  try {
    return await TicketService.getByCustomer(customerId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const updateTicket = createAsyncThunk('ticket/update', async ({ id, data }, thunkAPI) => {
  try {
    return await TicketService.update(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const deleteTicket = createAsyncThunk('ticket/delete', async (id, thunkAPI) => {
  try {
    return await TicketService.delete(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const assignTicket = createAsyncThunk('ticket/assign', async ({ id, data }, thunkAPI) => {
  try {
    return await TicketService.assign(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const resolveTicket = createAsyncThunk('ticket/resolve', async ({ id, data }, thunkAPI) => {
  try {
    return await TicketService.resolve(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const bulkUpdateTickets = createAsyncThunk('ticket/bulkUpdate', async (payload, thunkAPI) => {
  try {
    return await TicketService.bulkUpdate(payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// 💬 New Comment Thunks
export const addPublicComment = createAsyncThunk('ticket/addPublicComment', async ({ ticketId, content }, thunkAPI) => {
  try {
    return await TicketService.addPublicComment(ticketId, { content });
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getPublicComments = createAsyncThunk('ticket/getPublicComments', async (ticketId, thunkAPI) => {
  try {
    return await TicketService.getPublicComments(ticketId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const addPrivateComment = createAsyncThunk('ticket/addPrivateComment', async ({ ticketId, content }, thunkAPI) => {
  try {
    return await TicketService.addPrivateComment(ticketId, { content });
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getPrivateComments = createAsyncThunk('ticket/getPrivateComments', async (ticketId, thunkAPI) => {
  try {
    return await TicketService.getPrivateComments(ticketId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// 📎 New Attachment Thunks
export const addAttachmentToTicket = createAsyncThunk('ticket/addAttachmentToTicket', async ({ ticketId, formData }, thunkAPI) => {
  try {
    return await TicketService.addAttachmentToTicket(ticketId, formData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const addAttachmentToComment = createAsyncThunk('ticket/addAttachmentToComment', async ({ commentId, formData }, thunkAPI) => {
  try {
    return await TicketService.addAttachmentToComment(commentId, formData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    resetTicketState: (state) => {
      state.isTicketLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.ticket = null;
      state.publicComments = [];
      state.privateComments = [];
      state.attachments = [];
    },
    // A temporary reducer for optimistic UI updates
    // optimisticUpdateTicket: (state, action) => {
    //   const { ticketId, newStatus, newAssignedTo, newAssignedToModel } = action.payload;
    //   state.allTickets = state.allTickets.map((ticket) => {
    //     if (ticket._id === ticketId) {
    //       return {
    //         ...ticket,
    //         status: newStatus || ticket.status,
    //         assignedTo: newAssignedTo || ticket.assignedTo,
    //         assignedToModel: newAssignedToModel || ticket.assignedToModel
    //       };
    //     }
    //     return ticket;
    //   });
    // }
    optimisticUpdateTicket: (state, action) => {
      const { ticketId, newStatus, newAssignedTo, newAssignedToModel } = action.payload;
      state.allTickets = state.allTickets.map((ticket) => {
        if (ticket._id === ticketId) {
          return {
            ...ticket,
            status: newStatus ?? ticket.status,
            assignedTo: newAssignedTo ?? ticket.assignedTo,
            assignedToModel: newAssignedToModel ?? ticket.assignedToModel
          };
        }
        return ticket;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle all async thunks
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        state.ticket = action.payload;
        toast.success('Ticket created successfully');
      })
      .addCase(createInternalTicket.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        state.ticket = action.payload;
        toast.success('Internal ticket created');
      })
      .addCase(createFlexibleTicket.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        state.ticket = action.payload;
        toast.success('Flexible ticket created');
      })
      .addCase(getAllTickets.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        state.allTickets = action.payload;
      })
      .addCase(getCustomerTickets.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        state.customerTickets = action.payload;
      })

      .addCase(updateTicket.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        const updatedTicket = action.payload;
        state.allTickets = state.allTickets.map((ticket) => (ticket._id === updatedTicket._id ? updatedTicket : ticket));
        toast.success('Ticket updated');
      })
      // Delete Ticket
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        state.allTickets = state.allTickets.filter((ticket) => ticket._id !== action.meta.arg);
        toast.success('Ticket deleted');
      })
      // Assign Ticket
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        const updatedTicket = action.payload;
        state.allTickets = state.allTickets.map((ticket) => (ticket._id === updatedTicket._id ? updatedTicket : ticket));
        toast.success('Ticket assigned');
      })
      // Resolve Ticket
      .addCase(resolveTicket.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        const updatedTicket = action.payload;
        state.allTickets = state.allTickets.map((ticket) => (ticket._id === updatedTicket._id ? updatedTicket : ticket));
        toast.success('Ticket resolved');
      })
      .addCase(bulkUpdateTickets.fulfilled, (state) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        // No specific state update needed, as it's a bulk operation.
        // You might refetch or handle this differently if needed.
        toast.success('Tickets updated');
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        state.ticket = action.payload;
        // state.publicComments = action.payload.publicComments || []; // Populate comments
        state.privateComments = action.payload.privateComments || [];
        state.attachments = action.payload.attachments || [];
      })
      // 💬 New Comment Cases
      .addCase(addPublicComment.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        state.publicComments.push(action.payload);
        toast.success('Public comment added');
      })
      .addCase(getPublicComments.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        state.publicComments = action.payload;
        // console.log("in slice ticket", action.payload)
      })
      .addCase(addPrivateComment.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        state.privateComments.push(action.payload);
        toast.success('Private note added');
      })
      .addCase(getPrivateComments.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        state.privateComments = action.payload;
      })
      // 📎 New Attachment Cases
      .addCase(addAttachmentToTicket.fulfilled, (state, action) => {
        state.isTicketLoading = false;
        state.isSuccess = true;
        if (state.ticket) {
          state.ticket.attachments.push(action.payload);
        }
        toast.success('Attachment added to ticket');
      })
      // No specific case needed for addAttachmentToComment, as it modifies a comment, not the main ticket state
      // Instead, a re-fetch of the ticket data would update the UI.
      // Or you could implement optimistic updates for comments as well.

      // Matchers for common loading and error states
      .addMatcher(
        (action) => action.type.startsWith('ticket/') && action.type.endsWith('/pending'),
        (state) => {
          state.isTicketLoading = true;
          state.isError = false;
          state.isSuccess = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('ticket/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isTicketLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { resetTicketState, optimisticUpdateTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
