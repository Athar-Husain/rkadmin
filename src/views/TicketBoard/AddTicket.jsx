import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import { FlagRounded as PriorityIcon, ConfirmationNumberRounded as TicketIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { createInternalTicket } from '../../redux/features/Tickets/TicketSlice';
import { getAllConnections } from '../../redux/features/Connection/ConnectionSlice';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

const PRIORITY_OPTIONS = [
  { label: 'Low', color: '#10b981' },
  { label: 'Medium', color: '#f59e0b' },
  { label: 'High', color: '#ef4444' }
];

const AddTicket = ({ open, handleClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Selectors
  const { connections = [], isConnectionLoading } = useSelector((state) => state.connection);
  const { isCreatingTicket } = useSelector((state) => state.ticket); // Assuming you have a loading state for creation

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      description: '',
      priority: 'Medium',
      connectionId: ''
    }
  });

  useEffect(() => {
    if (open) {
      dispatch(getAllConnections());
    }
  }, [open, dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(createInternalTicket(data)).unwrap();
      toast.success('Ticket created successfully');
      handleInternalClose();
    } catch (error) {
      toast.error(error || 'Failed to create ticket');
    }
  };

  const handleInternalClose = () => {
    reset();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleInternalClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: '16px', p: 1 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              p: 1,
              borderRadius: '10px',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              display: 'flex'
            }}
          >
            <TicketIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              Create Ticket
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Log a new internal support request
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Stack spacing={2.5}>
          {/* Connection Selection */}
          <Controller
            name="connectionId"
            control={control}
            rules={{ required: 'Please select a customer connection' }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={connections}
                loading={isConnectionLoading}
                getOptionLabel={(opt) => (opt?.userName ? `${opt.userName} (${opt.userId})` : '')}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(_, data) => field.onChange(data?._id)}
                value={connections.find((c) => c._id === field.value) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer Connection"
                    error={!!errors.connectionId}
                    helperText={errors.connectionId?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isConnectionLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Briefly describe the issue' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Issue Description"
                placeholder="Describe the speed, connectivity, or hardware issue..."
                multiline
                rows={3}
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          {/* Priority */}
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Set Priority" fullWidth error={!!errors.priority}>
                {PRIORITY_OPTIONS.map((option) => (
                  <MenuItem key={option.label} value={option.label}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PriorityIcon sx={{ color: option.color, fontSize: 18 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {option.label}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleInternalClose} color="inherit" sx={{ fontWeight: 700, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isCreatingTicket}
          sx={{
            borderRadius: '8px',
            px: 4,
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: 'none'
          }}
        >
          {isCreatingTicket ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Ticket'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTicket;
