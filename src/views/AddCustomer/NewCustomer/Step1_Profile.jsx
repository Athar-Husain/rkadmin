import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Box, Grid, TextField, Button, Typography, InputAdornment, alpha, useTheme, CircularProgress, Stack } from '@mui/material';
import {
  PersonOutlineRounded as NameIcon,
  MailOutlineRounded as EmailIcon,
  SmartphoneRounded as PhoneIcon,
  HttpsOutlined as LockIcon,
  ArrowForwardRounded as NextIcon
} from '@mui/icons-material';
import { registerCustomer, resetCustomerState } from '../../../redux/features/Customers/CustomerSlice';
import { resetConnectionState } from '../../../redux/features/Connection/ConnectionSlice';

// const Step1_Profile = ({ onNext }) => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const { isLoading, newCustomer } = useSelector((state) => state.customer);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors }
//   } = useForm();

//   const onSubmit = async (data) => {
//     try {
//       const result = await dispatch(registerCustomer(data)).unwrap();
//       onNext(result);
//     } catch (error) {
//       // Error handled by middleware/parent
//     }
//   };

const Step1_Profile = ({ onNext }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  // Get the customer data currently in the store
  const { isLoading, newCustomer } = useSelector((state) => state.customer);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    // IMPORTANT: This pre-fills the form when the user comes back
    defaultValues: {
      firstName: newCustomer?.firstName || '',
      lastName: newCustomer?.lastName || '',
      email: newCustomer?.email || '',
      phone: newCustomer?.phone || '',
      password: newCustomer?.password || ''
    }
  });

  //   const onSubmit = async (data) => {
  //     try {
  //       // If the customer already exists (user went back and forward),
  //       // you might want to call an update API or just proceed
  //       const result = await dispatch(registerCustomer(data)).unwrap();
  //       onNext(result);
  //     } catch (error) {
  //       // Handled by toast
  //     }
  //   };

  const onSubmit = async (data) => {
    try {
      // 1. Check if the customer was already created in this session
      if (newCustomer?.id || newCustomer?._id) {
        console.log('Customer already exists, moving to next step...');

        // OPTIONAL: If you want to allow updating the details
        // await dispatch(updateCustomer({ id: newCustomer.id, ...data })).unwrap();

        onNext(newCustomer);
        return;
      }

      // 2. If no customer exists, register them for the first time
      const result = await dispatch(registerCustomer(data)).unwrap();
      onNext(result);
    } catch (error) {
      // Error handled by Redux/Toast
    }
  };

  const handleClear = () => {
    dispatch(resetCustomerState());
    // dispatch(resetConnectionState());
    // Optional: If you use a router, you might want to redirect to step 1
    window.location.reload(); // Hard reset if needed
  };

  // const Step1_Profile = ({ onNext }) => {
  //   const theme = useTheme();
  //   const dispatch = useDispatch();
  //   const { isLoading, newCustomer } = useSelector((state) => state.customer);

  //   const {
  //     register,
  //     handleSubmit,
  //     setValue, // Add this to manually set values if needed
  //     formState: { errors }
  //   } = useForm({
  //     defaultValues: {
  //       firstName: newCustomer?.firstName || '',
  //       lastName: newCustomer?.lastName || '',
  //       email: newCustomer?.email || '',
  //       phone: newCustomer?.phone || '',
  //       password: newCustomer?.password || ''
  //     }
  //   });

  //   // Force sync form with Redux if newCustomer changes
  //   // This handles the "Back" button behavior perfectly
  //   useEffect(() => {
  //     if (newCustomer) {
  //       setValue('firstName', newCustomer.firstName);
  //       setValue('lastName', newCustomer.lastName);
  //       setValue('email', newCustomer.email);
  //       setValue('phone', newCustomer.phone);
  //       // Only set password if it exists in your state
  //       if (newCustomer.password) {
  //         setValue('password', newCustomer.password);
  //       }
  //     }
  //   }, [newCustomer, setValue]);

  //   const onSubmit = async (data) => {
  //     console.log('data in onsubmit ', data);
  //     try {
  //       if (newCustomer?.id || newCustomer?._id) {
  //         // If data hasn't changed, just move on
  //         // We pass 'data' to onNext to ensure the next step has the latest values
  //         onNext({ ...newCustomer, ...data });
  //         return;
  //       }

  //       const result = await dispatch(registerCustomer(data)).unwrap();

  //       // IMPORTANT: If your API doesn't return the password,
  //       // merge the password from 'data' into the result so the next steps have it
  //       onNext({ ...result, password: data.password });
  //     } catch (error) {
  //       // Error handled by Redux
  //     }
  //   };

  // ... rest of your JSX remains the same

  // Common styles for compact, professional inputs
  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease-in-out',
      backgroundColor: '#F8FAFC',
      '&:hover': {
        backgroundColor: '#F1F5F9'
      },
      '&.Mui-focused': {
        backgroundColor: '#fff',
        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`
      }
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.85rem',
      fontWeight: 500,
      color: '#64748B'
    }
  };

  return (
    <Box>
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Section Header */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={700}
              sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Personal Details
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="First Name"
              placeholder="John"
              {...register('firstName', { required: 'Required' })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NameIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Last Name"
              placeholder="Doe"
              {...register('lastName', { required: 'Required' })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              sx={inputStyle}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              label="Email Address"
              type="email"
              placeholder="john@company.com"
              {...register('email', { required: 'Required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Phone Number without Country code"
              placeholder="9876543210"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Phone number must be exactly 10 digits'
                }
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
              inputProps={{
                maxLength: 10,
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            {/* <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            /> */}
            <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={inputStyle}
              // This ensures MUI doesn't treat the value as undefined
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>

        {/* Action Button - Reduced Size & Enhanced UX */}
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 5 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            endIcon={!isLoading && <NextIcon />}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              bgcolor: '#1B2559',
              '&:hover': {
                bgcolor: '#0B1437',
                boxShadow: `0 4px 14px 0 ${alpha('#1B2559', 0.39)}`
              }
            }}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Save & Continue'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Step1_Profile;
