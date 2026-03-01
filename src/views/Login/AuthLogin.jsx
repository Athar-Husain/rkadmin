import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';

// Redux
import { loginAdmin } from '../../redux/features/Admin/adminSlice';

// Material UI
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Logo
import Google from '../../assets/images/logo-dark.svg';

const AuthLogin = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to where user wanted to go or default '/'
  const from = location.state?.from?.pathname || '/';

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(loginAdmin(data)).unwrap();
      // Redirect to original page or home
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err); // Toast shown in slice
    }
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid size={{ xs: 12 }}>
          <Button
            fullWidth
            sx={{
              fontSize: { md: '1rem', xs: '0.875rem' },
              fontWeight: 500,
              backgroundColor: theme.palette.grey[50],
              color: theme.palette.grey[600],
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: theme.palette.grey[100]
              }
            }}
            size="large"
            variant="contained"
          >
            {/* * CRITICAL FIX: Add a loading error handler to prevent a blank screen.
             * The image src path is a common source of silent errors.
             */}
            <img
              src={Google}
              alt="google"
              width="20px"
              style={{ marginRight: '16px' }}
              onError={(e) => {
                console.error('Failed to load Google logo:', e);
                e.target.style.display = 'none'; // Hide broken image
              }}
            />
            Sign in with Google
          </Button>
        </Grid>
      </Grid>

      <Box alignItems="center" display="flex" mt={2}>
        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
        <Typography color="textSecondary" variant="h5" sx={{ m: theme.spacing(2) }}>
          OR
        </Typography>
        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          fullWidth
          label="Email Address / Username"
          margin="normal"
          variant="outlined"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email format'
            }
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <FormControl fullWidth sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }} error={!!errors.password}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((show) => !show)} onMouseDown={(e) => e.preventDefault()} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
        </FormControl>

        <Grid container justifyContent="flex-end">
          <Grid>
            <Typography variant="subtitle2" color="primary" sx={{ cursor: 'pointer' }}>
              Forgot Password?
            </Typography>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
            Log In
          </Button>
        </Box>
      </form>
    </>
  );
};

export default AuthLogin;
