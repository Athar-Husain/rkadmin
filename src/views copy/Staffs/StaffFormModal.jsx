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
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStaff, RESET_STAFF_STATE } from '../../redux/features/Staff/StaffSlice';
import { toast } from 'react-toastify';
import { fetchStores } from '../../redux/features/Stores/StoreSlice';

const StaffFormModal = ({ open, handleClose, staff }) => {
  const dispatch = useDispatch();
  const isEdit = !!staff;
  //   const { stores } = useSelector((state) => state.staff);

  const { stores, isStoreLoading } = useSelector((state) => state.store);
  const [loadingStores, setLoadingStores] = useState(true);

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
      password: '',
      permissions: {
        canVerifyCoupon: true,
        canRedeemCoupon: true,
        canCreatePurchase: true,
        canViewBranchReports: false
      }
    }
  });

  useEffect(() => {
    // Load stores for dropdown
    const fetchtStores = async () => {
      setLoadingStores(true);
      await dispatch(fetchStores());
      setLoadingStores(false);
    };
    fetchtStores();

    if (staff) {
      // Split name into first + last for form
      const [firstName, ...lastNameParts] = staff.name?.split(' ') || ['', ''];
      const lastName = lastNameParts.join(' ');
      reset({
        storeId: staff.storeId || '',
        firstName,
        lastName,
        email: staff.email || '',
        mobile: staff.mobile || '',
        username: staff.username || '',
        role: staff.role || 'staff',
        isActive: staff.isActive ?? true,
        password: '',
        permissions: staff.permissions || {
          canVerifyCoupon: true,
          canRedeemCoupon: true,
          canCreatePurchase: true,
          canViewBranchReports: false
        }
      });
    } else {
      reset({});
    }

    dispatch(RESET_STAFF_STATE());
  }, [staff, reset, dispatch]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        storeId: data.storeId,
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        mobile: data.mobile,
        username: data.username.toLowerCase().trim(),
        role: data.role.toLowerCase(),
        isActive: data.isActive,
        password: data.password || undefined,
        permissions: data.permissions
      };

      if (isEdit) {
        // await dispatch(updateStaff({ id: staff._id, data: payload })).unwrap();
        console.log('updateStaff');
        toast.success('Staff updated successfully');
      } else {
        await dispatch(createStaff(payload)).unwrap();
        toast.success('Staff created successfully');
      }
      handleClose();
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Staff' : 'Create Staff'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} id="staff-form">
          <Grid container spacing={2} mt={1}>
            {/* Store Dropdown */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="storeId"
                control={control}
                rules={{ required: 'Store is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.storeId}>
                    <InputLabel>Store</InputLabel>
                    <Select {...field} label="Store" disabled={loadingStores}>
                      {stores?.map((store) => (
                        <MenuItem key={store._id} value={store._id}>
                          {store.name} ({store.code})
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.storeId && <p style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: 4 }}>{errors.storeId.message}</p>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* First Name */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField {...field} label="First Name" fullWidth error={!!errors.firstName} helperText={errors.firstName?.message} />
                )}
              />
            </Grid>

            {/* Last Name */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Last Name" fullWidth error={!!errors.lastName} helperText={errors.lastName?.message} />
                )}
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, md: 4 }}>
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

            {/* Mobile */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="mobile"
                control={control}
                rules={{
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Enter a valid Indian mobile number'
                  }
                }}
                render={({ field }) => (
                  <TextField {...field} label="Mobile Number" fullWidth error={!!errors.mobile} helperText={errors.mobile?.message} />
                )}
              />
            </Grid>

            {/* Username */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="username"
                control={control}
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Username" fullWidth error={!!errors.username} helperText={errors.username?.message} />
                )}
              />
            </Grid>

            {/* Role */}
            <Grid size={{ xs: 12, md: 4 }}>
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
                    {errors.role && <p style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: 4 }}>{errors.role.message}</p>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, md: 4 }}>
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

            {/* Password */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: !isEdit && 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
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
