// ./AddRoles.jsx
import React from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const AddRoles = ({ onClose, onSubmitRegion }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { regionName: '' },
  });

  const onSubmit = (data) => {
    onSubmitRegion(data.regionName);
    reset();
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="regionName"
            control={control}
            rules={{ required: 'Region name is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Region Name"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add Region
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddRoles;
