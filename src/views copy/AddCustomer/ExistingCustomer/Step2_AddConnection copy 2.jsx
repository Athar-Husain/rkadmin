import React, { useEffect, useState } from 'react';
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
  Chip,
  Card
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
  const [mode, setMode] = useState('select'); // 'select' or 'create'
  const { areas } = useSelector((state) => state.area);
  const { isConnectionLoading } = useSelector((state) => state.connection);

  // We assume the customer object from search contains their connections
  const existingConnections = customer?.connections || [];

  //   console.log('customer in existingConnections ', customer);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSelectExisting = (connection) => {
    // Skip API creation, just pass the existing connection to Step 3
    onNext(connection);
  };

  const onCreateNew = async (data) => {
    try {
      const payload = { ...data, customerId: customer._id };
      const result = await dispatch(createConnection(payload)).unwrap();
      onNext(result.connection);
    } catch (error) {}
  };

  return (
    <Box>
      {/* MODE TOGGLE */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, p: 0.5, bgcolor: '#f0f2f5', borderRadius: 3 }}>
        <Button
          fullWidth
          onClick={() => setMode('select')}
          variant={mode === 'select' ? 'contained' : 'text'}
          sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
        >
          Select Existing Connection
        </Button>
        <Button
          fullWidth
          onClick={() => setMode('create')}
          variant={mode === 'create' ? 'contained' : 'text'}
          sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
        >
          Add New Connection
        </Button>
      </Stack>

      {mode === 'select' ? (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle1" fontWeight={800} mb={2}>
            Existing Connections
          </Typography>
          <Stack spacing={2}>
            {existingConnections.length > 0 ? (
              existingConnections.map((conn) => (
                <Card
                  key={conn._id}
                  onClick={() => onSelectExisting(conn)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: '1px solid #f0f0f0',
                    '&:hover': { borderColor: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.01) }
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {conn.aliasName || 'Primary'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Box ID: {conn.boxId} | STB: {conn.stbNumber}
                      </Typography>
                    </Box>
                    <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}>
                      Select
                    </Button>
                  </Stack>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No existing connections found for this customer.
              </Typography>
            )}
          </Stack>
        </Paper>
      ) : (
        /* THE ORIGINAL FORM WE BUILT PREVIOUSLY */
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
          {/* <form onSubmit={handleSubmit(onCreateNew)}>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5, borderRadius: 3 }}>
              Create & Proceed
            </Button>
          </form> */}

          {/* <form onSubmit={handleSubmit(onSubmit)}> */}
          <form onSubmit={handleSubmit(onCreateNew)}>
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
                disabled={isConnectionLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 800,
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                {isConnectionLoading ? 'Saving...' : 'Create Connection'}
              </Button>
            </Stack>
          </form>
        </Paper>
      )}

      <Button onClick={onBack} sx={{ mt: 2, fontWeight: 700 }}>
        Back to Search
      </Button>
    </Box>
  );
};

export default Step2_AddConnection;
