import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  Divider,
  Stack,
  Card,
  alpha,
  useTheme
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SpeedIcon from '@mui/icons-material/Speed';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { createPlan, getAllPlanCategories } from '../../redux/features/Plan/PlanSlice';

const CreatePlan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { categories } = useSelector((state) => state.plan);

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      name: '',
      duration: '',
      price: '',
      internetSpeed: '',
      internetSpeedUnit: 'mbps',
      dataLimitType: 'limited',
      dataLimit: '',
      description: '',
      category: '',
      features: [{ value: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'features' });
  const dataLimitType = watch('dataLimitType');

  useEffect(() => {
    dispatch(getAllPlanCategories());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const transformed = {
      ...data,
      features: data.features.map((f) => f.value)
    };
    try {
      await dispatch(createPlan(transformed)).unwrap();
      navigate('/plans');
    } catch (err) {
      console.error('Error creating plan', err);
    }
  };

  return (
    <Box maxWidth="1000px" mx="auto" p={{ xs: 2, md: 4 }}>
      {/* Header Area */}
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <IconButton onClick={() => navigate('/plans')} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Create New Plan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure internet speeds, pricing, and features for your customers.
          </Typography>
        </Box>
      </Stack>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={4}>
          {/* Left Column: Basic Info & Specs */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="subtitle1" fontWeight={700} mb={2} display="flex" alignItems="center" gap={1}>
                  <AssignmentIcon color="primary" fontSize="small" /> Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Plan Name"
                      fullWidth
                      placeholder="e.g. Ultra Fiber Pro"
                      {...register('name', { required: 'Plan name is required' })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      label="Plan Category"
                      fullWidth
                      value={watch('category') || ''}
                      onChange={(e) => setValue('category', e.target.value)}
                      error={!!errors.category}
                    >
                      {categories.map((c) => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      label="Billing Cycle"
                      fullWidth
                      value={watch('duration') || ''}
                      onChange={(e) => setValue('duration', e.target.value)}
                    >
                      <MenuItem value="1-month">Monthly</MenuItem>
                      <MenuItem value="3-months">Quarterly</MenuItem>
                      <MenuItem value="6-months">Half-Yearly</MenuItem>
                      <MenuItem value="12-months">Annual</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="subtitle1" fontWeight={700} mb={2} display="flex" alignItems="center" gap={1}>
                  <SpeedIcon color="primary" fontSize="small" /> Connectivity Specs
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 7 }}>
                    <TextField
                      label="Internet Speed"
                      fullWidth
                      type="number"
                      {...register('internetSpeed', { required: 'Required' })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" fontWeight={700}>
                              {watch('internetSpeedUnit').toUpperCase()}
                            </Typography>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 5 }}>
                    <TextField
                      select
                      label="Unit"
                      fullWidth
                      value={watch('internetSpeedUnit')}
                      onChange={(e) => setValue('internetSpeedUnit', e.target.value)}
                    >
                      <MenuItem value="mbps">Mbps</MenuItem>
                      <MenuItem value="gbps">Gbps</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      label="Data Limit"
                      fullWidth
                      value={dataLimitType}
                      onChange={(e) => setValue('dataLimitType', e.target.value)}
                    >
                      <MenuItem value="limited">Limited Data</MenuItem>
                      <MenuItem value="unlimited">Unlimited Data</MenuItem>
                    </TextField>
                  </Grid>
                  {dataLimitType === 'limited' && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Quota (GB)" fullWidth type="number" {...register('dataLimit', { required: 'Limit is required' })} />
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column: Pricing & Features */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} mb={2} display="flex" alignItems="center" gap={1}>
                  <CurrencyRupeeIcon color="primary" fontSize="small" /> Pricing
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Base Price"
                  {...register('price', { required: 'Price is required' })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    sx: { fontSize: '1.2rem', fontWeight: 700 }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Customers will be charged this amount per billing cycle.
                </Typography>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Key Features
                  </Typography>
                  <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={() => append({ value: '' })}>
                    Add
                  </Button>
                </Stack>
                <Divider sx={{ mb: 2 }} />

                {fields.map((field, index) => (
                  <Stack key={field.id} direction="row" spacing={1} mb={1.5} alignItems="flex-start">
                    <Controller
                      name={`features.${index}.value`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          placeholder="e.g. Free Router"
                          error={!!errors.features?.[index]?.value}
                        />
                      )}
                    />
                    <IconButton size="small" color="error" onClick={() => remove(index)} disabled={fields.length === 1}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}
              </Paper>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              >
                Publish Plan
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CreatePlan;
