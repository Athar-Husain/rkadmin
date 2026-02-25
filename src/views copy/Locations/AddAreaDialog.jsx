import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addAreasToCityAdmin, fetchCityDetailsAdmin } from '../../redux/features/Locations/LocationSlice';

const AddAreaDialog = ({ open, onClose, city }) => {
  const dispatch = useDispatch();
  const { isLocationLoading } = useSelector((state) => state.location);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      areaName: '',
      pincodes: ''
    }
  });

  const onSubmit = async (data) => {
    // Transform comma-separated string into a clean array
    const pincodeArray = data.pincodes
      ? data.pincodes
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p !== '')
      : [];

    const payload = {
      city,
      areas: [
        {
          name: data.areaName.trim(),
          pincodes: pincodeArray
        }
      ]
    };

    const resultAction = await dispatch(addAreasToCityAdmin(payload));

    if (addAreasToCityAdmin.fulfilled.match(resultAction)) {
      dispatch(fetchCityDetailsAdmin(city));
      handleClose();
    }
  };

  const handleClose = () => {
    reset(); // Clear form fields
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Area to {city}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Area Name"
              fullWidth
              autoFocus
              {...register('areaName', {
                required: 'Area name is required',
                minLength: { value: 3, message: 'Minimum 3 characters' }
              })}
              error={!!errors.areaName}
              helperText={errors.areaName?.message}
            />

            <TextField
              label="Pincodes (comma separated)"
              placeholder="e.g. 560001, 560002"
              fullWidth
              {...register('pincodes')}
              helperText="Optional: Separate multiple pincodes with commas"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLocationLoading}>
            {isLocationLoading ? 'Adding...' : 'Add Area'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddAreaDialog;
