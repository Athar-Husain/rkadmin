import React, { useEffect, useMemo, useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Button,
  Autocomplete,
  CircularProgress,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  PersonAddAlt1Rounded as AddIcon,
  ArrowBackIosNewRounded as BackIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { getAllServiceAreas } from '../../redux/features/Area/AreaSlice';
import { registerTeamMember } from '../../redux/features/Team/TeamSlice';

const DEFAULT_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  role: 'technician',
  region: []
};

const AddTeam = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  // Local UI state
  const [showPassword, setShowPassword] = useState(false);

  const { areas = [], isAreaLoading } = useSelector((state) => state.area);
  const { isTeamLoading } = useSelector((state) => state.team);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched' // Validates as the user types/leaves a field
  });

  useEffect(() => {
    dispatch(getAllServiceAreas());
  }, [dispatch]);

  const uniqueAreas = useMemo(() => {
    const seen = new Set();
    return areas.filter(({ _id }) => {
      if (seen.has(_id)) return false;
      seen.add(_id);
      return true;
    });
  }, [areas]);

  const onSubmit = async (data) => {
    try {
      // Map the selected area objects to just their IDs if your API expects strings,
      // otherwise pass the objects as they are.
      const payload = {
        ...data,
        area: data.region.map((r) => r._id)
      };

      const result = await dispatch(registerTeamMember(payload)).unwrap();
      toast.success(`${data.firstName} has been added to the team!`);
      reset();
      setTimeout(() => navigate('/team'), 2000);
    } catch (err) {
      toast.error(err || 'Failed to register team member');
    }
  };

  return (
    <Box sx={{ bgcolor: '#F4F7FE', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Header with Navigation */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#fff', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}>
            <BackIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#1B2559">
              Add Team Member
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a new account for field technicians or agents.
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '24px',
            boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
            bgcolor: '#fff'
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              {/* First Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: 'First name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  )}
                />
              </Grid>

              {/* Last Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: 'Last name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  )}
                />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  )}
                />
              </Grid>

              {/* Phone */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Enter a valid 10-digit Indian number'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      placeholder="8888855555"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  )}
                />
              </Grid>

              {/* Password with Toggle */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Role Selection */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                      <InputLabel>System Role</InputLabel>
                      <Select {...field} label="System Role">
                        <MenuItem value="technician">Technician</MenuItem>
                        <MenuItem value="agent">Agent</MenuItem>
                        {/* <MenuItem value="admin">Administrator</MenuItem> */}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Regions Multi-Select */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="region"
                  control={control}
                  rules={{ required: 'Select at least one region' }}
                  render={({ field: { onChange, value }, fieldState }) => (
                    <Autocomplete
                      multiple
                      options={uniqueAreas}
                      loading={isAreaLoading}
                      value={value}
                      getOptionLabel={(option) => option.region || ''}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      onChange={(_, newValue) => onChange(newValue)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Assigned Regions"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          placeholder="Search and select regions"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isAreaLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            )
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isTeamLoading}
                  startIcon={isTeamLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                  sx={{
                    bgcolor: '#4318FF',
                    borderRadius: '16px',
                    py: 1.8,
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.2)',
                    '&:hover': { bgcolor: '#3311CC' }
                  }}
                >
                  {isTeamLoading ? 'Processing...' : 'Register Team Member'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      <ToastContainer position="bottom-right" theme="colored" />
    </Box>
  );
};

export default AddTeam;
