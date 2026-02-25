import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import {
  RouterRounded as RouterIcon,
  MemoryRounded as BoxIcon,
  MapRounded as AreaIcon,
  PersonRounded as PersonIcon,
  ArrowBackRounded as BackIcon,
  CheckCircleRounded as SaveIcon
} from '@mui/icons-material';
import { getAllServiceAreas } from '../../../redux/features/Area/AreaSlice';
import { createConnection, resetConnectionState } from '../../../redux/features/Connection/ConnectionSlice';
import { resetCustomerState } from '../../../redux/features/Customers/CustomerSlice';

// const Step2_Connection = ({ customer, onNext, onBack }) => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const { areas } = useSelector((state) => state.area);
//   const { isConnectionLoading, newConnection } = useSelector((state) => state.connection);
//   const { newCustomer } = useSelector((state) => state.customer);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({
//     defaultValues: {
//       connectionType: 'Fiber',
//       aliasName: 'Home'
//     }
//   });
const Step2_Connection = ({ customer, onNext, onBack }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { areas } = useSelector((state) => state.area);
  const { isConnectionLoading, newConnection } = useSelector((state) => state.connection);
  const { newCustomer } = useSelector((state) => state.customer);

  console.log('newConnection', newConnection?.serviceArea);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    // Prefill from Redux if user came back from Step 3
    defaultValues: {
      boxId: newConnection?.boxId || '',
      stbNumber: newConnection?.stbNumber || '',
      userName: newConnection?.userName || '',
      userId: newConnection?.userId || '',
      serviceArea: newConnection?.serviceArea?._id || newConnection?.serviceArea || '',
      connectionType: newConnection?.connectionType || 'Fiber',
      aliasName: newConnection?.aliasName || 'Home'
    }
  });

  useEffect(() => {
    if (newConnection?.serviceArea) {
      const areaId = newConnection.serviceArea?._id || newConnection.serviceArea;
      setValue('serviceArea', areaId);
    }
  }, [newConnection, setValue, areas]);

  useEffect(() => {
    dispatch(getAllServiceAreas());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      // 1. SMART CHECK: Does a connection already exist in the store?
      if (newConnection?._id || newConnection?.id) {
        // Check if user changed any critical hardware info
        const hasHardwareChanged =
          data.boxId !== newConnection.boxId || data.stbNumber !== newConnection.stbNumber || data.userId !== newConnection.userId;

        if (hasHardwareChanged) {
          // If hardware changed, we update the existing connection
          // Assuming you have an updateConnection action
          const updated = await dispatch(
            updateConnection({
              id: newConnection._id,
              ...data
            })
          ).unwrap();
          onNext(updated.connection || updated);
        } else {
          // No changes? Just move to the next step
          onNext(newConnection);
        }
        return;
      }

      // 2. FRESH SUBMISSION: Create for the first time
      const payload = { ...data, customerId: newCustomer?.id || customer?.id };
      const result = await dispatch(createConnection(payload)).unwrap();

      // result.connection usually contains the new object
      onNext(result.connection || result);
    } catch (error) {
      // Errors handled by Redux/Toast middleware
    }
  };

  const handleClear = () => {
    dispatch(resetCustomerState());
    dispatch(resetConnectionState());
    // Optional: If you use a router, you might want to redirect to step 1
    window.location.reload(); // Hard reset if needed
  };

  // ... rest of your JSX

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      fontSize: '0.875rem',
      backgroundColor: '#F8FAFC',
      '&.Mui-focused': {
        backgroundColor: '#fff',
        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`
      }
    },
    '& .MuiInputLabel-root': { fontSize: '0.85rem', fontWeight: 500 }
  };

  return (
    <Box>
      {/* ELITE CUSTOMER CONTEXT BAR */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Typography
          onClick={handleClear}
          sx={{
            cursor: 'pointer',
            fontSize: '0.75rem',
            color: theme.palette.error.main,
            fontWeight: 700,
            '&:hover': { textDecoration: 'underline', opacity: 0.8 }
          }}
        >
          ✕ CLEAR SESSION DATA
        </Typography>
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          p: 1.5,
          mb: 4,
          borderRadius: '14px',
          bgcolor: alpha('#4318FF', 0.03),
          border: '1px solid #E0E5F2'
        }}
      >
        <Avatar sx={{ bgcolor: '#4318FF', width: 32, height: 32 }}>
          <PersonIcon sx={{ fontSize: 18 }} />
        </Avatar>
        <Box>
          <Typography variant="caption" sx={{ color: '#707EAE', fontWeight: 700, display: 'block', lineHeight: 1 }}>
            PROVISIONING FOR
          </Typography>
          <Typography variant="body2" sx={{ color: '#1B2559', fontWeight: 800 }}>
            {customer?.customer?.firstName} - {customer?.customer?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#1B2559', fontWeight: 800 }}>
            {newCustomer?.firstName} - {newCustomer?.lastName}
          </Typography>
        </Box>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={700}
              sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Hardware details
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Box ID / MAC"
              {...register('boxId', { required: 'Required' })}
              error={!!errors.boxId}
              helperText={errors.boxId?.message}
              sx={inputStyle}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="STB Serial Number"
              {...register('stbNumber', { required: 'Required' })}
              error={!!errors.stbNumber}
              helperText={errors.stbNumber?.message}
              sx={inputStyle}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              {...register('userName', { required: 'Required' })}
              error={!!errors.userName}
              sx={inputStyle}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="User ID"
              size="small"
              placeholder="User ID"
              {...register('userId', { required: 'User ID is required' })}
              error={!!errors.userId}
              sx={inputStyle}
              helperText={errors.userId?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small" error={!!errors.serviceArea} sx={inputStyle}>
              <InputLabel>Service Area</InputLabel>
              <Select label="Service Area" defaultValue="" {...register('serviceArea', { required: 'Required' })}>
                {areas.map((area) => (
                  <MenuItem key={area._id} value={area._id} sx={{ fontSize: '0.875rem' }}>
                    {area.region}
                  </MenuItem>
                ))}
              </Select>
              {errors.serviceArea && <FormHelperText>{errors.serviceArea?.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" label="Connection Type" {...register('connectionType')} sx={inputStyle} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" label="Alias (e.g. Home)" {...register('aliasName')} sx={inputStyle} />
          </Grid>
        </Grid>

        {/* ACTIONS */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 6 }}>
          <Button
            variant="text"
            startIcon={<BackIcon sx={{ fontSize: 14 }} />}
            onClick={onBack}
            sx={{
              color: '#707EAE',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: 'transparent', color: '#1B2559' }
            }}
          >
            Go Back
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isConnectionLoading}
            endIcon={!isConnectionLoading && <SaveIcon />}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: '10px',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.875rem',
              bgcolor: '#1B2559',
              '&:hover': { bgcolor: '#0B1437' }
            }}
          >
            {isConnectionLoading ? <CircularProgress size={20} color="inherit" /> : 'Provision Hardware'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Step2_Connection;
