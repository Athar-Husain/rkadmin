import { Autocomplete, Chip } from '@mui/material';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControlLabel, Switch, Stack } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

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
    onSubmit(data);
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
                <TextField {...field} label="City / District Name" fullWidth error={!!errors.city} helperText={errors.city?.message} />
              )}
            />
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} color="success" />}
                  label="Mark as Active immediately"
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ borderRadius: 2 }}>
            Create City
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
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
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={800}>Add Area to {cityName}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Area name is required' }}
              render={({ field }) => (
                <TextField {...field} label="Area Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
              )}
            />

            {/* Dynamic Pincodes Chip Input */}
            <Controller
              name="pincodes"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]} // No predefined options
                  value={value}
                  onChange={(event, newValue) => onChange(newValue)}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option} {...getTagProps({ index })} color="primary" variant="outlined" size="small" />
                    ))
                  }
                  renderInput={(params) => <TextField {...params} label="Pincodes" placeholder="Type and press Enter" />}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Add Area
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
