import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  Autocomplete,
  Chip,
  Typography,
  Box
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

/**
 * SHARED HELPER: Formats strings to UPPERCASE-WITH-HYPHENS
 */
const formatLocationName = (name) => name.trim().toUpperCase().replace(/\s+/g, '-');

// --- 1. ADD CITY DIALOG ---
export const AddCityDialog = ({ open, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { city: '', isActive: true }
  });

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      city: formatLocationName(data.city)
    };
    onSubmit(formattedData);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle fontWeight={800}>Create New City</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Controller
              name="city"
              control={control}
              rules={{ required: 'City name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="City / District Name"
                  fullWidth
                  placeholder="e.g. Ballari"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} color="success" />}
                  label={
                    <Typography variant="body2" fontWeight={500}>
                      Mark as Active immediately
                    </Typography>
                  }
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ borderRadius: 2, px: 3 }}>
            Create City
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// --- 2. ADD AREA DIALOG ---
export const AddAreaDialog = ({ open, onClose, onSubmit, cityName }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: '', pincodes: [], isActive: true }
  });

  const handleFormSubmit = (data) => {
    // Formatting for the API structure expected by addAreasToCity
    const formattedData = {
      areas: [
        {
          name: formatLocationName(data.name),
          pincodes: data.pincodes,
          isActive: data.isActive
        }
      ]
    };
    onSubmit(formattedData);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={800}>
        Add Area to{' '}
        <Box component="span" color="primary.main">
          {cityName}
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Area Name Field */}
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Area name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Area Name"
                  fullWidth
                  placeholder="e.g. Cowl Bazar"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            {/* Pincodes Autocomplete Field */}
            <Controller
              name="pincodes"
              control={control}
              rules={{
                required: 'At least one pincode is required and it must be 6 digits each',
                validate: (value) => {
                  const invalid = value.filter((p) => !/^\d{6}$/.test(p));
                  return invalid.length === 0 || 'Each pincode must be exactly 6 digits';
                }
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={value}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pincodes"
                      placeholder="Type and press Enter"
                      error={!!errors.pincodes}
                      helperText={errors.pincodes ? errors.pincodes.message : 'Add multiple pincodes by pressing Enter after each.'}
                    />
                  )}
                />
              )}
            />

            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} color="success" size="small" />}
                  label={
                    <Typography variant="body2" fontWeight={500}>
                      Area Serviceable
                    </Typography>
                  }
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ borderRadius: 2, px: 4 }}>
            Add Area
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
