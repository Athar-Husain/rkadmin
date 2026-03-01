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
  Select,
  Typography,
  Divider,
  Box,
  alpha
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStaff, RESET_STAFF_STATE } from '../../redux/features/Staff/StaffSlice';
import { toast } from 'react-toastify';
import { fetchAllStoresAdmin } from '../../redux/features/Stores/StoreSlice';

const StaffFormModal = ({ open, handleClose, staff }) => {
  const dispatch = useDispatch();
  const isEdit = !!staff;
  const { stores, isStoreLoading } = useSelector((state) => state.store);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      storeId: '',
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      username: '',
      role: 'staff',
      isActive: true,
      password: ''
    }
  });

  useEffect(() => {
    dispatch(fetchAllStoresAdmin());
    if (staff) {
      const [firstName, ...lastNameParts] = staff.name?.split(' ') || ['', ''];
      reset({
        ...staff,
        firstName,
        lastName: lastNameParts.join(' '),
        password: ''
      });
    } else {
      reset({ role: 'staff', isActive: true, storeId: '' });
    }
  }, [staff, reset, dispatch]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        name: `${data.firstName} ${data.lastName}`.trim(),
        username: data.username.toLowerCase().trim(),
        password: data.password || undefined
      };
      // Logic for dispatching create/update...
      toast.success(`Staff ${isEdit ? 'updated' : 'created'} successfully`);
      handleClose();
    } catch (err) {
      toast.error(err?.message || 'Action failed');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem' }}>{isEdit ? 'Update Member Profile' : 'Onboard New Staff'}</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} id="staff-form">
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Section: Professional Details */}
            <Grid size={12}>
              <Typography variant="overline" color="primary" fontWeight={700}>
                Professional Context
              </Typography>
              <Divider sx={{ mb: 2, mt: 0.5 }} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="storeId"
                control={control}
                rules={{ required: 'Assigning a store is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.storeId} variant="filled">
                    <InputLabel>Primary Branch/Store</InputLabel>
                    <Select {...field} label="Store" disabled={isStoreLoading}>
                      {stores?.map((s) => (
                        <MenuItem key={s._id} value={s._id}>
                          {s.name} ({s.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Access Role</InputLabel>
                    <Select {...field}>
                      <MenuItem value="manager">Manager (Elevated)</MenuItem>
                      <MenuItem value="staff">Staff (Standard)</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Section: Personal Info */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Typography variant="overline" color="primary" fontWeight={700}>
                Personal Identity
              </Typography>
              <Divider sx={{ mb: 2, mt: 0.5 }} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => <TextField {...field} label="First Name" fullWidth variant="outlined" error={!!errors.firstName} />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => <TextField {...field} label="Last Name" fullWidth variant="outlined" error={!!errors.lastName} />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <TextField {...field} label="Business Email" fullWidth variant="outlined" error={!!errors.email} />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => <TextField {...field} label="Phone Number" fullWidth variant="outlined" />}
              />
            </Grid>

            {/* Section: Security */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Typography variant="overline" color="primary" fontWeight={700}>
                Credentials
              </Typography>
              <Divider sx={{ mb: 2, mt: 0.5 }} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => <TextField {...field} label="Username" fullWidth placeholder="jdoe_staff" />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField {...field} type="password" label={isEdit ? 'Update Password (Optional)' : 'Security Password'} fullWidth />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Discard
        </Button>
        <Button
          type="submit"
          form="staff-form"
          variant="contained"
          disableElevation
          disabled={isSubmitting}
          sx={{ borderRadius: '10px', px: 4 }}
        >
          {isEdit ? 'Save Changes' : 'Confirm Registration'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffFormModal;
