import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  IconButton,
  CircularProgress,
  alpha
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';

import Breadcrumbs from '../../component/Breadcrumb';
import { getNotifications } from '../../redux/features/Notifications/NotificationSlice';

const ProfileIndex = () => {
  const dispatch = useDispatch();

  // Get Admin data from Redux state
  const { Admin, isLoading } = useSelector((state) => state.admin);

  
  console.log('Admin', Admin);

  //   const { notifications } = useSelector((state) => state.notifications);

  const { notifications, isNotificationLoading } = useSelector((state) => state.notifications);
  console.log('notifications', notifications);

  // useEffect(() => {
  // dispatch(getNotifications());
  // dispatch(clearBadge()); // Reset the bell icon badge when viewing this screen
  // }, [dispatch]);

  //   console.log('Admin in profile ', Admin);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: ''
    }
  });

  // Sync form with Redux data when it changes
  useEffect(() => {
    if (Admin) {
      reset({
        firstName: Admin.firstName || '',
        lastName: Admin.lastName || '',
        email: Admin.email || '',
        phone: Admin.phone || '', // assuming phone exists in model
        address: Admin.address || ''
      });
    }
  }, [Admin, reset]);

  const onSubmit = (data) => {
    console.log('Update Admin Action Triggered:', data);
    // dispatch(updateAdminProfile(data));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Breadcrumbs links={[{ label: 'Dashboard', to: '/' }, { label: 'Admin Profile' }]} divider />

      <Box sx={{ bgcolor: '#F4F7FE', minHeight: '100vh', pb: 5 }}>
        {/* Header Banner */}
        <Box
          sx={{
            height: '180px',
            background: 'linear-gradient(90deg, #0f1e42 0%, #253b72 100%)',
            borderRadius: '0 0 40px 40px',
            position: 'relative',
            mb: -10,
            display: 'flex',
            alignItems: 'center',
            px: 4
          }}
        >
          <Typography variant="h4" color="white" fontWeight={700}>
            Account Settings
          </Typography>
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3}>
            {/* Left Side: Profile Card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', border: '1px solid #E0E7FF' }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={Admin?.profileImage} // Map to your actual API key
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      mx: 'auto',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      border: '4px solid white'
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 15,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                    size="small"
                  >
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  {Admin?.firstName} {Admin?.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {Admin?.role?.toUpperCase() || 'ADMINISTRATOR'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: 'left' }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{Admin?.email}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BadgeIcon fontSize="small" color="action" />
                    <Typography variant="body2">ID: {Admin?._id?.substring(0, 8)}...</Typography>
                  </Stack>
                </Box>
              </Paper>
            </Grid>

            {/* Right Side: Form */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #E0E7FF' }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Personal Information
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="First Name"
                        fullWidth
                        {...register('firstName', { required: 'First name is required' })}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Last Name"
                        fullWidth
                        {...register('lastName', { required: 'Last name is required' })}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Email Address"
                        disabled // Usually email isn't changeable without OTP
                        fullWidth
                        {...register('email')}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Phone Number" fullWidth {...register('phone')} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Address" fullWidth {...register('address')} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button variant="outlined" color="inherit" onClick={() => reset()}>
                          Reset
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{
                            px: 4,
                            bgcolor: '#0f1e42',
                            '&:hover': { bgcolor: '#1a2b5a' }
                          }}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

// Helper Stack for icons
const Stack = ({ children, direction, spacing, alignItems, sx }) => (
  <Box sx={{ display: 'flex', flexDirection: direction, gap: spacing, alignItems, ...sx }}>{children}</Box>
);

export default ProfileIndex;
