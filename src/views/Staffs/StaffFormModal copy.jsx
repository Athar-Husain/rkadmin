import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createStaff, RESET_STAFF_STATE } from '../../redux/features/Staff/StaffSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const StaffFormModal = ({ open, handleClose, staff }) => {
  const dispatch = useDispatch();
  const isEdit = !!staff;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      firstName: staff?.firstName || '',
      lastName: staff?.lastName || '',
      email: staff?.email || '',
      username: staff?.username || '',
      role: staff?.role || 'staff',
      isActive: staff?.isActive ?? true,
      password: ''
    }
  });

  useEffect(() => {
    reset({
      firstName: staff?.firstName || '',
      lastName: staff?.lastName || '',
      email: staff?.email || '',
      username: staff?.username || '',
      role: staff?.role || 'staff',
      isActive: staff?.isActive ?? true,
      password: ''
    });
    dispatch(RESET_STAFF_STATE());
  }, [staff, reset, dispatch]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        // await dispatch(updateStaff({ id: staff._id, data })).unwrap();
        console.log('updated staff');
        toast.success('Staff updated successfully');
      } else {
        await dispatch(createStaff(data)).unwrap();
        toast.success('Staff created successfully');
      }
      handleClose();
    } catch (err) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Staff' : 'Create Staff'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} id="staff-form">
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField {...field} label="First Name" fullWidth error={!!errors.firstName} helperText={errors.firstName?.message} />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Last Name" fullWidth error={!!errors.lastName} helperText={errors.lastName?.message} />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email'
                  }
                }}
                render={({ field }) => (
                  <TextField {...field} label="Email" fullWidth error={!!errors.email} helperText={errors.email?.message} />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="username"
                control={control}
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Username" fullWidth error={!!errors.username} helperText={errors.username?.message} />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.role}>
                    <InputLabel>Role</InputLabel>
                    <Select {...field} label="Role">
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="staff">Staff</MenuItem>
                    </Select>
                    {errors.role && (
                      <p style={{ color: '#d32f2f', margin: '3px 14px 0 14px', fontSize: '0.75rem' }}>{errors.role.message}</p>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: !isEdit && 'Password is required'
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={isEdit ? 'Password (leave blank to keep)' : 'Password'}
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button type="submit" form="staff-form" variant="contained" disabled={isSubmitting}>
          {isEdit ? 'Update Staff' : 'Create Staff'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffFormModal;
