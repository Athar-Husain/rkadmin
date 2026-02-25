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
  Stack,
  Divider,
  Chip,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  PersonAddAlt1Rounded as AddIcon,
  ArrowBackIosNewRounded as BackIcon,
  EmailTwoTone as EmailIcon,
  PhoneTwoTone as PhoneIcon,
  AccountCircleTwoTone as AccountIcon,
  VpnKeyTwoTone as KeyIcon,
  BadgeTwoTone as BadgeIcon,
  ExploreTwoTone as MapIcon
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
  const [showPassword, setShowPassword] = useState(false);

  const { areas = [], isAreaLoading } = useSelector((state) => state.area);
  const { isTeamLoading } = useSelector((state) => state.team);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched'
  });

  const passwordValue = watch('password', '');

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
      const payload = { ...data, area: data.region.map((r) => r._id) };
      await dispatch(registerTeamMember(payload)).unwrap();
      toast.success(`${data.firstName} has been added successfully!`);
      reset();
      setTimeout(() => navigate('/team'), 2000);
    } catch (err) {
      toast.error(err || 'Failed to register team member');
    }
  };

  // UI Section Header Helper
  const SectionHeader = ({ icon, title }) => (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3, mt: 1 }}>
      <Avatar sx={{ bgcolor: alpha('#4318FF', 0.1), color: '#4318FF', width: 32, height: 32 }}>
        {React.cloneElement(icon, { sx: { fontSize: 18 } })}
      </Avatar>
      <Typography variant="subtitle1" fontWeight={700} color="#1B2559">
        {title}
      </Typography>
      <Divider sx={{ flex: 1, ml: 2, opacity: 0.6 }} />
    </Stack>
  );

  return (
    <Box sx={{ bgcolor: '#F4F7FE', minHeight: '100vh', py: { xs: 2, md: 6 } }}>
      <Container maxWidth="md">
        {/* Top Navigation */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ bgcolor: '#fff', '&:hover': { bgcolor: '#f0f0f0' }, boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }}
            >
              <BackIcon sx={{ fontSize: 16, color: '#4318FF' }} />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={800} color="#1B2559" sx={{ letterSpacing: -0.5 }}>
                Join the Team
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Onboard a new technician or agent to the system.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '30px', boxShadow: '0px 20px 50px rgba(112, 144, 176, 0.08)' }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Section 1: Personal Profile */}
            <SectionHeader icon={<AccountIcon />} title="Personal Information" />
            <Grid container spacing={3} sx={{ mb: 4 }}>
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
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                    />
                  )}
                />
              </Grid>
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
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon fontSize="small" color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid Indian number' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon fontSize="small" color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Section 2: Access & Assignment */}
            <SectionHeader icon={<KeyIcon />} title="System Access & Assignment" />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } }}
                  render={({ field }) => (
                    <Box>
                      <TextField
                        {...field}
                        label="Account Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
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
                      {/* Password Strength Indicator */}
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1, px: 1 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              height: 4,
                              flex: 1,
                              borderRadius: 1,
                              bgcolor: passwordValue.length >= i * 2 ? '#39B81A' : '#E0E5F2'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}>
                      <InputLabel>System Role</InputLabel>
                      <Select
                        {...field}
                        label="System Role"
                        startAdornment={<BadgeIcon sx={{ mr: 1, color: 'action.active', fontSize: 20 }} />}
                      >
                        <MenuItem value="technician">Technician</MenuItem>
                        <MenuItem value="agent">Agent</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="region"
                  control={control}
                  rules={{ required: 'Assign at least one region' }}
                  render={({ field: { onChange, value }, fieldState }) => (
                    <Autocomplete
                      multiple
                      options={uniqueAreas}
                      loading={isAreaLoading}
                      value={value}
                      getOptionLabel={(option) => option.region || ''}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      onChange={(_, newValue) => onChange(newValue)}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            label={option.region}
                            {...getTagProps({ index })}
                            sx={{ borderRadius: '8px', bgcolor: alpha('#4318FF', 0.1), color: '#4318FF', fontWeight: 600 }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Assigned Service Regions"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <MapIcon fontSize="small" color="action" />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                            endAdornment: (
                              <React.Fragment>
                                {isAreaLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            )
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Submit Button */}
              <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isTeamLoading}
                  startIcon={isTeamLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                  sx={{
                    bgcolor: '#4318FF',
                    borderRadius: '18px',
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0px 10px 25px rgba(67, 24, 255, 0.25)',
                    '&:hover': { bgcolor: '#3311CC', transform: 'translateY(-1px)' },
                    transition: 'all 0.2s'
                  }}
                >
                  {isTeamLoading ? 'Creating Account...' : 'Confirm & Register Member'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      <ToastContainer position="top-center" theme="colored" autoClose={3000} hideProgressBar={false} />
    </Box>
  );
};

export default AddTeam;
