import React from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  InputAdornment,
  CircularProgress,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  MapOutlined as RegionIcon,
  DnsOutlined as StatusIcon,
  DescriptionOutlined as NotesIcon,
  AddCircleOutlineRounded as AddIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import { getAllServiceAreas, createServiceArea } from '../../redux/features/Area/AreaSlice';

const AddRegion = ({ onClose }) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      region: '',
      description: '',
      isActive: true,
      networkStatus: 'Good'
    }
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(createServiceArea(data)).unwrap();

      // Elegant success notification
      Swal.fire({
        icon: 'success',
        title: 'Region Initialized',
        text: 'The new service area is now live on the network.',
        timer: 2000,
        showConfirmButton: false,
        borderRadius: '15px'
      });

      reset();
      await dispatch(getAllServiceAreas());
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Provisioning Failed',
        text: error?.message || 'Check your network connection and try again.'
      });
    }
  };

  return (
    <Box>
      {/* Modal Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1E1B4B">
            Create Region
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Configure new infrastructure parameters
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#F3F4F6' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3, opacity: 0.5 }} />

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2.5}>
          {/* Region Name */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name="region"
              control={control}
              rules={{
                required: 'Region ID is required',
                pattern: {
                  value: /^[a-zA-Z0-9-]+$/,
                  message: 'Use only alphanumeric characters and hyphens'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Region Identity"
                  placeholder="e.g. LON-01"
                  fullWidth
                  error={!!errors.region}
                  helperText={errors.region?.message}
                  inputProps={{ maxLength: 30 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RegionIcon sx={{ color: '#6366F1', fontSize: 20 }} />
                      </InputAdornment>
                    )
                  }}
                  sx={inputFieldStyles}
                />
              )}
            />
          </Grid>

          {/* Network Status Dropdown */}
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel>Network Health</InputLabel>
              <Controller
                name="networkStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Network Health"
                    sx={{ borderRadius: 2.5 }}
                    startAdornment={<StatusIcon sx={{ mr: 1, ml: -0.5, color: '#6366F1', fontSize: 20 }} />}
                  >
                    <MenuItem value="Good">🟢 Stable (Good)</MenuItem>
                    <MenuItem value="Low">🟡 Degraded (Low)</MenuItem>
                    <MenuItem value="Moderate">🟠 Issues (Moderate)</MenuItem>
                    <MenuItem value="Down">🔴 Outage (Down)</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Infrastructure Description"
                  placeholder="Add technical notes..."
                  fullWidth
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <NotesIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                      </InputAdornment>
                    )
                  }}
                  sx={inputFieldStyles}
                />
              )}
            />
          </Grid>

          {/* isActive Switch */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 1.5,
                px: 2,
                borderRadius: 2.5,
                bgcolor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Controller
                name="isActive"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    control={<Switch checked={value} onChange={(e) => onChange(e.target.checked)} color="success" />}
                    label={
                      <Typography variant="body2" fontWeight={700} color={value ? 'success.main' : 'text.disabled'}>
                        {value ? 'READY TO DEPLOY' : 'DRAFT MODE'}
                      </Typography>
                    }
                  />
                )}
              />
            </Box>
          </Grid>

          {/* Buttons */}
          <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={onClose}
                fullWidth
                variant="outlined"
                sx={{
                  borderRadius: 2.5,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#E2E8F0',
                  color: 'text.secondary'
                }}
              >
                Discard
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
                sx={{
                  borderRadius: 2.5,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  bgcolor: '#6366F1',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    bgcolor: '#4F46E5'
                  }
                }}
              >
                {isSubmitting ? 'Provisioning...' : 'Add Region'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// Senior Dev Shared Styles
const inputFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5,
    transition: 'all 0.2s ease-in-out',
    '& fieldset': { borderColor: '#E2E8F0' },
    '&:hover fieldset': { borderColor: '#6366F1' },
    '&.Mui-focused fieldset': { borderColor: '#6366F1', borderWidth: '2px' }
  },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

export default AddRegion;
