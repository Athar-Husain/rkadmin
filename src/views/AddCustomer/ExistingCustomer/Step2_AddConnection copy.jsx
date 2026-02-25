import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
  FormHelperText,
  Chip
} from '@mui/material';
import {
  AddLinkOutlined as AddIcon,
  PersonOutline as PersonIcon,
  ArrowBackIosNew as BackIcon,
  LocationOnOutlined as AreaIcon
} from '@mui/icons-material';
import { getAllServiceAreas } from '../../../redux/features/Area/AreaSlice';
import { createConnection } from '../../../redux/features/Connection/ConnectionSlice';

const Step2_AddConnection = ({ customer, onNext, onBack }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { areas } = useSelector((state) => state.area);
  const { isLoading } = useSelector((state) => state.connection);

  console.log('customer in Step2 in existing', customer._id);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      connectionType: 'Fiber',
      aliasName: 'Secondary' // Defaulting to secondary since it's an existing customer
    }
  });

  useEffect(() => {
    dispatch(getAllServiceAreas());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      // Using _id because searchedCustomer usually returns the full Mongo object
      const payload = { ...data, customerId: customer._id };
      const result = await dispatch(createConnection(payload)).unwrap();
      onNext(result.connection);
    } catch (error) {
      // Error handled by Redux
    }
  };

  return (
    <Box>
      {/* EXISTING CUSTOMER IDENTITY BAR */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={800}>
              {customer?.firstName} {customer?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Existing Customer ID: {customer?._id?.slice(-6).toUpperCase()}
            </Typography>
          </Box>
        </Stack>
        <Chip label="Adding New Connection" size="small" color="primary" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
      </Paper>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AddIcon color="primary" />
          <Typography variant="h5" fontWeight={800}>
            Connection Details
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Box ID"
                placeholder="Enter hardware box ID"
                {...register('boxId', { required: 'Box ID is required' })}
                error={!!errors.boxId}
                helperText={errors.boxId?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="STB Number"
                placeholder="Set-top box number"
                {...register('stbNumber', { required: 'STB Number is required' })}
                error={!!errors.stbNumber}
                helperText={errors.stbNumber?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="User ID"
                placeholder="User ID"
                {...register('userId', { required: 'STB Number is required' })}
                error={!!errors.userId}
                helperText={errors.userId?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="PPPoE User Name"
                {...register('userName', { required: 'User Name is required' })}
                error={!!errors.userName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.serviceArea}>
                <InputLabel>Service Area</InputLabel>
                <Select label="Service Area" defaultValue="" {...register('serviceArea', { required: 'Area selection required' })}>
                  {areas.map((area) => (
                    <MenuItem key={area._id} value={area._id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AreaIcon sx={{ fontSize: 18, opacity: 0.6 }} />
                        <Typography>{area.region}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.serviceArea?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Connection Type" {...register('connectionType')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Connection Alias" placeholder="e.g. Shop, Floor 2, Tenant" {...register('aliasName')} />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={onBack}
              startIcon={<BackIcon sx={{ fontSize: 14 }} />}
              sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
            >
              Change Customer
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontWeight: 800,
                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              {isLoading ? 'Saving...' : 'Create Connection'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Step2_AddConnection;
