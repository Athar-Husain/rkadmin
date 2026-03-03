import React, { useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Divider,
  Chip,
  Grid,
  Autocomplete,
  Box,
  Typography,
  Stack,
  MenuItem
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';
import { createPromotion, updatePromotion } from '../../redux/features/Promotions/PromotionSlice';

export default function PromotionModal({ open, onClose, onRefresh, promotion = null }) {
  const dispatch = useDispatch();
  const isEdit = Boolean(promotion?._id);

  const { allCitiesWithAreas = [] } = useSelector((state) => state.location);

  const { control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      title: '',
      shortDescription: '',
      imageUrl: '',
      status: 'DRAFT',
      startDate: '',
      endDate: '',
      targeting: {
        type: 'ALL',
        geographic: { cities: [], areas: [] }
      }
    }
  });

  const targetingType = watch('targeting.type');
  const selectedCities = watch('targeting.geographic.cities');
  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (open) dispatch(fetchAllCitiesWithAreasAdmin());
  }, [open, dispatch]);

  // Hydrate edit data
  useEffect(() => {
    if (promotion) {
      reset({
        title: promotion.title || '',
        shortDescription: promotion.description || '',
        imageUrl: promotion.imageUrl || '',
        status: promotion.isActive ? 'ACTIVE' : 'DRAFT',
        startDate: promotion.startDate?.split('T')[0] || '',
        endDate: promotion.endDate?.split('T')[0] || '',
        targeting: promotion.targeting || {
          type: 'ALL',
          geographic: { cities: [], areas: [] }
        }
      });
    } else {
      reset();
    }
  }, [promotion, reset]);

  const availableAreas = useMemo(() => {
    if (!selectedCities?.length) return [];
    return allCitiesWithAreas.filter((c) => selectedCities.includes(c._id)).flatMap((c) => c.areas || []);
  }, [selectedCities, allCitiesWithAreas]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      isActive: data.status === 'ACTIVE'
    };

    try {
      if (isEdit) {
        await dispatch(updatePromotion({ id: promotion._id, data: payload })).unwrap();
      } else {
        await dispatch(createPromotion(payload)).unwrap();
      }

      onRefresh?.();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 800 }}>{isEdit ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* BASIC INFO */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                Basic Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Title" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label="Draft"
                      color={field.value === 'DRAFT' ? 'default' : 'default'}
                      variant={field.value === 'DRAFT' ? 'filled' : 'outlined'}
                      onClick={() => field.onChange('DRAFT')}
                    />
                    <Chip
                      label="Active"
                      color="success"
                      variant={field.value === 'ACTIVE' ? 'filled' : 'outlined'}
                      onClick={() => field.onChange('ACTIVE')}
                    />
                  </Stack>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="shortDescription"
                control={control}
                render={({ field }) => <TextField {...field} label="Short Description" multiline rows={3} fullWidth />}
              />
            </Grid>

            {/* IMAGE */}
            <Grid size={{ xs: 12 }}>
              <Controller name="imageUrl" control={control} render={({ field }) => <TextField {...field} label="Image URL" fullWidth />} />
            </Grid>

            {imageUrl && (
              <Grid size={{ xs: 12 }}>
                <Box
                  component="img"
                  src={imageUrl}
                  alt="preview"
                  sx={{
                    width: '100%',
                    maxHeight: 220,
                    objectFit: 'cover',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0'
                  }}
                />
              </Grid>
            )}

            {/* VALIDITY */}
            <Grid size={{ xs: 12 }}>
              <Divider>
                <Chip label="Validity Period" />
              </Divider>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => <TextField {...field} type="date" label="Start Date" fullWidth InputLabelProps={{ shrink: true }} />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => <TextField {...field} type="date" label="End Date" fullWidth InputLabelProps={{ shrink: true }} />}
              />
            </Grid>

            {/* TARGETING */}
            <Grid size={{ xs: 12 }}>
              <Divider>
                <Chip label="Targeting" />
              </Divider>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="targeting.type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Targeting Type" fullWidth>
                    <MenuItem value="ALL">All Users</MenuItem>
                    <MenuItem value="GEOGRAPHIC">Geographic</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {targetingType === 'GEOGRAPHIC' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="targeting.geographic.cities"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={allCitiesWithAreas}
                        getOptionLabel={(o) => o.city}
                        value={allCitiesWithAreas.filter((c) => field.value?.includes(c._id))}
                        onChange={(_, newValue) => field.onChange(newValue.map((v) => v._id))}
                        renderInput={(params) => <TextField {...params} label="Cities" />}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="targeting.geographic.areas"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={availableAreas}
                        getOptionLabel={(o) => o.name}
                        value={availableAreas.filter((a) => field.value?.includes(a._id))}
                        onChange={(_, newValue) => field.onChange(newValue.map((v) => v._id))}
                        renderInput={(params) => <TextField {...params} label="Areas" />}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 3, px: 4 }}>
            {isEdit ? 'Update Promotion' : 'Create Promotion'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
