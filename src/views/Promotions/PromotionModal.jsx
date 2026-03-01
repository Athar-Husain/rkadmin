import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  MenuItem, Divider, Chip, Box, InputAdornment, Typography, Accordion,
  AccordionSummary, AccordionDetails, Autocomplete, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// Redux Actions (Adjust paths as per your project)
import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';
import { createPromotion } from '../../redux/features/Promotions/PromotionSlice';

export default function PromotionModal({ open, onClose, onRefresh }) {
  const dispatch = useDispatch();

  // Selectors
  const { allCitiesWithAreas, isLocationLoading } = useSelector((state) => state.location);
  
  const { control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      title: '',
      shortDescription: '',
      description: '',
      type: 'DISCOUNT',
      value: 0,
      minValue: 0,
      maxValue: 0,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
      maxRedemptions: 1000,
      perUserLimit: 1,
      featured: false,
      status: 'DRAFT',
      targeting: {
        type: 'ALL',
        geographic: { cities: [], areas: [], stores: [] },
        segments: [],
        products: [],
        categories: [],
        brands: []
      }
    }
  });

  const targetingType = watch('targeting.type');
  const selectedCities = watch('targeting.geographic.cities');
  const promoType = watch('type');

  useEffect(() => {
    if (open) {
      dispatch(fetchAllCitiesWithAreasAdmin());
    }
  }, [open, dispatch]);

  // Sync Areas based on selected Cities
  const availableAreas = useMemo(() => {
    if (!selectedCities?.length) return [];
    return allCitiesWithAreas
      .filter((city) => selectedCities.includes(city._id))
      .flatMap((city) => city.areas || []);
  }, [selectedCities, allCitiesWithAreas]);

  const onSubmit = async (data) => {
    // Normalization to match Backend Schema
    const payload = {
      ...data,
      value: Number(data.value),
      minValue: Number(data.minValue),
      maxValue: Number(data.maxValue),
      maxRedemptions: Number(data.maxRedemptions),
    };

    // Clean up targeting based on selected type
    if (targetingType !== 'GEOGRAPHIC') payload.targeting.geographic = { cities: [], areas: [] };
    if (targetingType !== 'SEGMENT') payload.targeting.segments = [];

    try {
      await dispatch(createPromotion(payload)).unwrap();
      reset();
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error('Failed to create promotion:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
      <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem' }}>Create New Promotion</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            
            {/* BASIC INFO */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Promotion Title" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>

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

            <Grid size={{ xs: 12 }}>
              <Controller
                name="shortDescription"
                control={control}
                render={({ field }) => <TextField {...field} label="Short Teaser (Visible on Banner)" fullWidth multiline rows={2} />}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider textAlign="left">
                <Chip label="Offer Configuration" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>

            {/* PROMO TYPE & VALUE */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Promo Type" fullWidth>
                    <MenuItem value="DISCOUNT">Discount</MenuItem>
                    <MenuItem value="BOGO">Buy 1 Get 1 (BOGO)</MenuItem>
                    <MenuItem value="CASHBACK">Cashback</MenuItem>
                    <MenuItem value="FREE_ITEM">Free Item</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="value"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    type="number" 
                    label="Value" 
                    fullWidth 
                    disabled={promoType === 'BOGO' || promoType === 'FREE_ITEM'}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{promoType === 'DISCOUNT' ? '%' : '₹'}</InputAdornment>
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="minValue"
                control={control}
                render={({ field }) => <TextField {...field} type="number" label="Min Order Value (₹)" fullWidth />}
              />
            </Grid>

            {/* VALIDITY & LIMITS */}
            <Grid size={{ xs: 6, md: 3 }}>
              <Controller
                name="validFrom"
                control={control}
                render={({ field }) => <TextField {...field} label="Starts" type="date" fullWidth InputLabelProps={{ shrink: true }} />}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Controller
                name="validUntil"
                control={control}
                render={({ field }) => <TextField {...field} label="Expires" type="date" fullWidth InputLabelProps={{ shrink: true }} />}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Controller
                name="maxRedemptions"
                control={control}
                render={({ field }) => <TextField {...field} type="number" label="Total Limit" fullWidth />}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Controller
                name="perUserLimit"
                control={control}
                render={({ field }) => <TextField {...field} type="number" label="Limit Per User" fullWidth />}
              />
            </Grid>

            {/* TARGETING SECTION */}
            <Grid size={{ xs: 12 }}>
              <Divider><Chip label="Audience & Targeting" /></Divider>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="targeting.type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Targeting Type" fullWidth>
                    <MenuItem value="ALL">All Users</MenuItem>
                    <MenuItem value="GEOGRAPHIC">Geographic</MenuItem>
                    {/* <MenuItem value="SEGMENT">User Segments</MenuItem> */}
                  </TextField>
                )}
              />
            </Grid>

            {targetingType === 'GEOGRAPHIC' && (
              <>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="targeting.geographic.cities"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={allCitiesWithAreas}
                        getOptionLabel={(option) => option.city}
                        value={allCitiesWithAreas.filter(c => field.value.includes(c._id))}
                        onChange={(_, newValue) => field.onChange(newValue.map(v => v._id))}
                        renderInput={(params) => <TextField {...params} label="Cities" />}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="targeting.geographic.areas"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={availableAreas}
                        getOptionLabel={(option) => option.name}
                        value={availableAreas.filter(a => field.value.includes(a._id))}
                        onChange={(_, newValue) => field.onChange(newValue.map(v => v._id))}
                        renderInput={(params) => <TextField {...params} label="Areas" disabled={!selectedCities.length} />}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            {/* {targetingType === 'SEGMENT' && (
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="targeting.segments"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      options={["NEW_USER", "LOYAL_CUSTOMER", "INACTIVE_30_DAYS", "FREQUENT_BUYER"]}
                      renderInput={(params) => <TextField {...params} label="Select Segments" />}
                      onChange={(_, data) => field.onChange(data)}
                    />
                  )}
                />
              </Grid>
            )} */}

            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" fontWeight={700}>Feature this promotion on Home Page?</Typography>
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <Chip 
                      label={field.value ? "FEATURED" : "STANDARD"} 
                      color={field.value ? "primary" : "default"}
                      onClick={() => field.onChange(!field.value)}
                    />
                  )}
                />
              </Box>
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" size="large" sx={{ borderRadius: '12px', px: 4 }}>
            Create Promotion
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}