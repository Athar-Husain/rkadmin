import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// Redux action
import { AdminRegister } from '../../redux/features/Admin/adminSlice';

// Material UI
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Logo
import Logo from '../../assets/images/logo-dark.png';

const Register = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    if (!agree) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    try {
      await dispatch(AdminRegister(data)).unwrap();
      navigate('/login'); // <-- Redirect after success
    } catch (err) {
      console.error('Registration error:', err);
    }
  };


  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: theme.palette.common.black, height: '100%', minHeight: '100vh' }}
    >
      {/* <Grid item xs={11} md={6} lg={4}> */}
      <Grid size={{ xs: 11, md: 6, lg: 4 }}>
        <Card
          sx={{
            overflow: 'visible',
            backgroundColor: theme.palette.common.white,
            display: 'flex',
            position: 'relative',
            my: 3,
            mx: 'auto',
            maxWidth: 475
          }}
        >
          <CardContent sx={{ p: theme.spacing(5, 4, 3, 4), width: '100%' }}>
            <Grid container direction="column" spacing={4} justifyContent="center">
              <Grid size={{ xs: 12 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid >
                    <Typography color="textPrimary" gutterBottom variant="h2">
                      Register
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      To keep connected with us.
                    </Typography>
                  </Grid>
                  <Grid >
                    <RouterLink to="/">
                      <img alt="logo" src={Logo} height={40} />
                    </RouterLink>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    fullWidth
                    label="First Name"
                    {...register('firstName', { required: 'First Name is required' })}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    label="Last Name"
                    {...register('lastName', { required: 'Last Name is required' })}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: 'Enter a valid email'
                      }
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    margin="normal"
                  />

                  <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.password}>
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
                          <IconButton
                            onClick={() => setShowPassword((show) => !show)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                    {errors.password && (
                      <Typography variant="caption" color="error">
                        {errors.password.message}
                      </Typography>
                    )}
                  </FormControl>


                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the&nbsp;
                        <RouterLink to="#">terms and conditions</RouterLink>
                      </Typography>
                    }
                    sx={{ mt: 2 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ mt: 3 }}
                  >
                    Register
                  </Button>
                </form>
              </Grid>

              <Grid container justifyContent="flex-start" sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }}>
                <Grid >
                  <Typography
                    variant="subtitle2"
                    color="secondary"
                    component={RouterLink}
                    to="/application/login"
                    sx={{ textDecoration: 'none', pl: 2 }}
                  >
                    Already have an account? Login
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Register;
