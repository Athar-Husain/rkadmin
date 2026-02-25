import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Grid,
  Typography,
  Box,
  MenuItem,
  Divider,
  InputAdornment,
  IconButton,
  alpha
} from '@mui/material';
import { CloseRounded as CloseIcon, MapRounded as MapIcon, WhatsApp as WAIcon, AccessTimeRounded as TimeIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createStoreAdmin, updateStoreAdmin } from '../../redux/features/Stores/StoreSlice';

const StoreModal = ({ store, onClose }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(store);

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      name: '',
      type: 'BRANCH',
      location: {
        address: '',
        area: '',
        city: '',
        state: 'KARNATAKA',
        pincode: '',
        landmark: '',
        gmapsLink: '',
        coordinates: { lat: '', lng: '' }
      },
      contact: { phone: '', whatsapp: '', email: '', managerName: '' },
      timings: { open: '10:00 AM', close: '08:00 PM', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }
    }
  });

  useEffect(() => {
    if (isEdit && store) reset(store);
  }, [store, isEdit, reset]);

  const onSubmit = (data) => {
    if (isEdit) {
      dispatch(updateStoreAdmin({ id: store._id, data }));
    } else {
      dispatch(createStoreAdmin(data));
    }
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '28px' } }}>
      <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#F8FAFC' }}>
        <Typography variant="h6" fontWeight={900}>
          {isEdit ? `Editing Store: ${store.code}` : 'Register New Store Location'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Identity & Contact */}
            <Grid size={{ xs: 12, md: 6 }}>
              <SectionTitle label="Store Identity" />
              <Stack spacing={2.5}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <TextField {...field} label="Store Name" fullWidth size="small" />}
                />
                <Stack direction="row" spacing={2}>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} select label="Type" fullWidth size="small">
                        {['MAIN', 'BRANCH', 'SUB_BRANCH'].map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name="contact.managerName"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Manager Name" fullWidth size="small" />}
                  />
                </Stack>
                <Controller
                  name="contact.phone"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Primary Phone" fullWidth size="small" />}
                />
                <Controller
                  name="contact.whatsapp"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="WhatsApp Business"
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <WAIcon color="success" sx={{ fontSize: 18 }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Stack>
            </Grid>

            {/* Operations */}
            <Grid size={{ xs: 12, md: 6 }}>
              <SectionTitle label="Operational Hours" />
              <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E0E4E8' }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <Controller
                      name="timings.open"
                      control={control}
                      render={({ field }) => <TextField {...field} label="Opening Time" fullWidth size="small" placeholder="10:00 AM" />}
                    />
                    <Controller
                      name="timings.close"
                      control={control}
                      render={({ field }) => <TextField {...field} label="Closing Time" fullWidth size="small" placeholder="08:00 PM" />}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon sx={{ fontSize: 14 }} /> Working Days: Mon to Sat
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            {/* Location (Full Row) */}
            <Grid size={{xs:12,}}>
              <SectionTitle label="Geographical Data" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Controller
                    name="location.address"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Full Physical Address" fullWidth multiline rows={2} />}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller
                    name="location.landmark"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Landmark" fullWidth />}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller
                    name="location.area"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Area (e.g. Jagruti Nagar)" fullWidth helperText="Auto-formatted to UPPERCASE-HYPHEN" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller
                    name="location.city"
                    control={control}
                    render={({ field }) => <TextField {...field} label="City" fullWidth />}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller
                    name="location.pincode"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Pincode" fullWidth />}
                  />
                </Grid>
                <Grid size={{xs:12,}}>
                  <Controller
                    name="location.gmapsLink"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Google Maps Shared Link"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MapIcon color="primary" />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: '#F8FAFC' }}>
          <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700 }}>
            Discard
          </Button>
          <Button type="submit" variant="contained" sx={{ px: 5, borderRadius: '12px', fontWeight: 800 }}>
            {isEdit ? 'Update Outlet' : 'Launch Outlet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const SectionTitle = ({ label }) => (
  <Typography variant="overline" color="primary" fontWeight={800} sx={{ mb: 2, display: 'block', letterSpacing: 1.2 }}>
    {label}
  </Typography>
);

export default StoreModal;
