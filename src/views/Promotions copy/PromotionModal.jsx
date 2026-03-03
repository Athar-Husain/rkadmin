import React, { useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Divider,
  Chip,
  Grid,
  Autocomplete
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';
import { createPromotion } from '../../redux/features/Promotions/PromotionSlice';

export default function PromotionModal({ open, onClose, onRefresh }) {
  const dispatch = useDispatch();
  const { allCitiesWithAreas = [] } = useSelector((state) => state.location);

  const { control, handleSubmit, watch, reset } = useForm({
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

  useEffect(() => {
    if (open) dispatch(fetchAllCitiesWithAreasAdmin());
  }, [open, dispatch]);

  const availableAreas = useMemo(() => {
    if (!selectedCities?.length) return [];
    return allCitiesWithAreas.filter((city) => selectedCities.includes(city._id)).flatMap((city) => city.areas || []);
  }, [selectedCities, allCitiesWithAreas]);

  const onSubmit = async (data) => {
    try {
      console.log('data', data);
      await dispatch(createPromotion(data)).unwrap();
      reset();
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Create Promotion</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* TITLE */}
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

            {/* STATUS */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Initial Status" fullWidth>
                    <MenuItem value="DRAFT">Draft</MenuItem>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* SHORT DESCRIPTION */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="shortDescription"
                control={control}
                render={({ field }) => <TextField {...field} label="Short Description" multiline rows={3} fullWidth />}
              />
            </Grid>

            {/* IMAGE URL */}
            <Grid size={{ xs: 12 }}>
              <Controller name="imageUrl" control={control} render={({ field }) => <TextField {...field} label="Image URL" fullWidth />} />
            </Grid>

            {/* DATE RANGE */}
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
                        getOptionLabel={(option) => option.city}
                        value={allCitiesWithAreas.filter((c) => field.value.includes(c._id))}
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
                        getOptionLabel={(option) => option.name}
                        value={availableAreas.filter((a) => field.value.includes(a._id))}
                        onChange={(_, newValue) => field.onChange(newValue.map((v) => v._id))}
                        renderInput={(params) => <TextField {...params} label="Areas" disabled={!selectedCities.length} />}
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
            Create Promotion
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
