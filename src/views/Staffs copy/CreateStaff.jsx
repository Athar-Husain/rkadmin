import { useState } from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Typography, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createStaff } from '../../redux/features/Staff/StaffSlice';
import PermissionsMatrix from './PermissionsMatrix ';
// import PermissionsMatrix from '../../components/staff/PermissionsMatrix';

const defaultPermissions = {
  canVerifyCoupon: true,
  canRedeemCoupon: true,
  canCreatePurchase: true,
  canViewBranchReports: false
};

const CreateStaff = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const [permissions, setPermissions] = useState(defaultPermissions);
  const [isActive, setIsActive] = useState(true);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      permissions,
      isActive
    };

    dispatch(createStaff(payload));
  };

  return (
    <Box p={3} maxWidth={900} mx="auto">
      <Typography variant="h5" fontWeight={600} mb={2}>
        Create New Staff
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Staff Details
                </Typography>

                <TextField
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  {...register('name', { required: 'Name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />

                <TextField
                  label="Username"
                  fullWidth
                  margin="normal"
                  {...register('username', { required: 'Username is required' })}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Minimum 6 characters'
                    }
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />

                <TextField select label="Role" fullWidth margin="normal" defaultValue="staff" {...register('role')}>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>

                <FormControlLabel control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Active" />
              </CardContent>
            </Card>
          </Grid>

          {/* Permissions */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Permissions
                </Typography>

                <PermissionsMatrix permissions={permissions} onChange={setPermissions} />
              </CardContent>
            </Card>
          </Grid>

          {/* Submit */}
          <Grid size={{ xs: 12 }}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => window.history.back()}>
                Cancel
              </Button>

              <Button variant="contained" type="submit">
                Create Staff
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateStaff;
