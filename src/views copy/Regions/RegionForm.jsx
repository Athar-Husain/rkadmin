import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  FormControlLabel,
  Switch,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Link,
  Divider
} from '@mui/material';
import {
  MapOutlined as RegionIcon,
  DnsOutlined as StatusIcon,
  DescriptionOutlined as NotesIcon,
  ArrowBackIosNewRounded as BackIcon,
  EditRounded as EditIcon,
  SaveRounded as SaveIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';

import { getServiceAreaById, updateServiceArea, createServiceArea } from '../../redux/features/Area/AreaSlice';

const RegionForm = ({ mode = 'view' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isEdit = mode === 'edit';
  const isView = mode === 'view';
  const isCreate = mode === 'create';

  const { area: selectedArea, isAreaLoading } = useSelector((state) => state.serviceArea || state.area || {});

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      region: '',
      description: '',
      networkStatus: 'Good',
      isActive: true
    }
  });

  // Fetch data if not creating
  useEffect(() => {
    if (!isCreate && id) {
      dispatch(getServiceAreaById(id));
    }
  }, [dispatch, id, isCreate]);

  // Reset form when data is loaded
  useEffect(() => {
    if (selectedArea && !isCreate) {
      reset({
        region: selectedArea.region || '',
        description: selectedArea.description || '',
        networkStatus: selectedArea.networkStatus || 'Good',
        isActive: selectedArea.isActive ?? true
      });
    }
  }, [selectedArea, isCreate, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await dispatch(updateServiceArea({ id, data })).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Region has been updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await dispatch(createServiceArea(data)).unwrap();
        Swal.fire({ icon: 'success', title: 'Created!', text: 'New region added to the network.', timer: 2000, showConfirmButton: false });
      }
      navigate('/areas');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error?.message || 'Something went wrong!' });
    }
  };

  if (isAreaLoading && !isCreate) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#4F46E5' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, mb: 6, px: 2 }}>
      {/* Navigation Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<BackIcon sx={{ fontSize: '14px !important' }} />}
          onClick={() => navigate('/areas')}
          sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}
        >
          Back to List
        </Button>

        {isView && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/areas/${id}/edit`)}
            sx={{ bgcolor: '#4F46E5', borderRadius: 2 }}
          >
            Edit Region
          </Button>
        )}
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0,0,0,0.05)',
          bgcolor: '#FFFFFF'
        }}
      >
        <Box mb={4}>
          <Typography variant="h4" fontWeight={800} color="#1E1B4B" gutterBottom>
            {isView ? 'Region Details' : isEdit ? 'Modify Region' : 'New Service Area'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isView ? 'Viewing historical data and current network status.' : 'Ensure all network parameters are accurate before saving.'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4, opacity: 0.6 }} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3.5}>
            {/* Region Name */}
            <Controller
              name="region"
              control={control}
              rules={{ required: 'Region name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Region Identity"
                  placeholder="e.g. US-EAST-01"
                  disabled={isView}
                  error={!!errors.region}
                  helperText={errors.region?.message}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RegionIcon sx={{ color: isView ? 'text.disabled' : '#4F46E5' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={inputStyles(isView)}
                />
              )}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              {/* Network Status */}
              <FormControl fullWidth disabled={isView}>
                <InputLabel>Network Health</InputLabel>
                <Controller
                  name="networkStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Network Health"
                      startAdornment={<StatusIcon sx={{ mr: 1, ml: -0.5, color: '#4F46E5' }} />}
                      sx={{ borderRadius: 2.5 }}
                    >
                      <MenuItem value="Good">🟢 Stable (Good)</MenuItem>
                      <MenuItem value="Low">🟡 Degraded (Low)</MenuItem>
                      <MenuItem value="Moderate">🟠 Issues (Moderate)</MenuItem>
                      <MenuItem value="Down">🔴 Outage (Down)</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              {/* Status Toggle */}
              <Paper
                variant="outlined"
                sx={{ p: 1, px: 2, borderRadius: 2.5, display: 'flex', alignItems: 'center', borderColor: 'rgba(0,0,0,0.12)' }}
              >
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          disabled={isView}
                          color="success"
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={600} color={field.value ? 'success.main' : 'text.disabled'}>
                          {field.value ? 'REGION ACTIVE' : 'REGION INACTIVE'}
                        </Typography>
                      }
                    />
                  )}
                />
              </Paper>
            </Box>

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Technical Notes"
                  placeholder="Enter infrastructure details..."
                  disabled={isView}
                  fullWidth
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <NotesIcon sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={inputStyles(isView)}
                />
              )}
            />

            {/* Actions */}
            {!isView && (
              <Stack direction="row" spacing={2} pt={2}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{
                    bgcolor: '#4F46E5',
                    borderRadius: 3,
                    py: 1.8,
                    fontWeight: 700,
                    fontSize: 15,
                    textTransform: 'none',
                    boxShadow: '0 10px 20px rgba(79, 70, 229, 0.25)',
                    '&:hover': { bgcolor: '#4338CA' }
                  }}
                >
                  {isEdit ? 'Save Changes' : 'Initialize Region'}
                </Button>
              </Stack>
            )}
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

// Reusable custom styles for Inputs
const inputStyles = (isView) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5,
    transition: 'all 0.2s ease',
    bgcolor: isView ? '#F8FAFC' : '#fff',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
    '&:hover fieldset': { borderColor: isView ? 'rgba(0,0,0,0.1)' : '#4F46E5' },
    '&.Mui-focused fieldset': { borderColor: '#4F46E5', borderWidth: '2px' }
  },
  '& .MuiInputLabel-root': { fontWeight: 500, color: 'text.secondary' }
});

export default RegionForm;
