import React, { useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Divider,
  Typography,
  Chip,
  Box,
  InputAdornment
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';
import { createCouponAdmin } from '../../redux/features/Coupons/CouponSlice';

export default function CreateCouponDialog({ open, onClose, onRefresh }) {
  const dispatch = useDispatch();
  const { allCitiesWithAreas, isLocationLoading } = useSelector((state) => state.location);

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      title: '',
      code: '',
      description: '',
      type: 'PERCENTAGE',
      value: 0,
      minPurchaseAmount: 0,
      maxDiscountAmount: 0,
      maxRedemptions: 100, // Added to track usage inventory
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
      targeting: {
        type: 'ALL',
        geographic: {
          cities: [],
          areas: []
        }
      },
      productRules: {
        type: 'ALL_PRODUCTS',
        categories: [],
        brands: []
      },
      status: 'ACTIVE'
    }
  });

  const targetingType = watch('targeting.type');
  const selectedCities = watch('targeting.geographic.cities');
  const couponType = watch('type');

  /* =========================
      FETCH CITIES + AREAS
  ========================= */
  useEffect(() => {
    if (open) {
      dispatch(fetchAllCitiesWithAreasAdmin());
    }
  }, [open, dispatch]);

  /* =========================
      DERIVED AREAS FROM CITIES
  ========================= */
  const availableAreas = useMemo(() => {
    if (!selectedCities || selectedCities.length === 0) return [];

    return allCitiesWithAreas.filter((city) => selectedCities.includes(city._id)).flatMap((city) => city.areas || []);
  }, [selectedCities, allCitiesWithAreas]);

  /* =========================
      NORMALIZE PAYLOAD
  ========================= */
  const normalizePayload = (data) => {
    // 1. Convert numeric fields to actual Numbers
    const numericData = {
      ...data,
      value: Number(data.value),
      minPurchaseAmount: Number(data.minPurchaseAmount),
      maxDiscountAmount: Number(data.maxDiscountAmount),
      maxRedemptions: Number(data.maxRedemptions),
      code: data.code.toUpperCase().trim()
    };

    // 2. Normalize Targeting
    if (numericData.targeting.type !== 'GEOGRAPHIC') {
      return {
        ...numericData,
        targeting: { type: numericData.targeting.type }
      };
    }

    const cities = numericData.targeting.geographic.cities || [];
    const areas = numericData.targeting.geographic.areas || [];

    return {
      ...numericData,
      targeting: {
        type: 'GEOGRAPHIC',
        geographic: {
          cities: cities.includes('__ALL__') ? [] : cities,
          areas: areas.includes('__ALL__') ? [] : areas
        }
      }
    };
  };

  /* =========================
      SUBMIT LOGIC
  ========================= */
  const onSubmit = async (formData) => {
    try {
      const payload = normalizePayload(formData);
      await dispatch(createCouponAdmin(payload)).unwrap();
      reset();
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error('Create coupon error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
      <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', px: 4, py: 3 }}>Create New Campaign Offer</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ px: 4, py: 3 }}>
          <Grid container spacing={3}>
            {/* ================= BASIC INFO ================= */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <TextField {...field} label="Campaign Title" fullWidth placeholder="e.g. Summer Sale 2024" />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Coupon Code"
                    fullWidth
                    placeholder="SUMMER50"
                    sx={{ '& input': { textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 } }}
                  />
                )}
              />
            </Grid>

            {/* ================= VALUES & LIMITS ================= */}
            <Grid size={{ xs: 12 }}>
              <Divider textAlign="left">
                <Chip label="Value & Inventory" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Discount Type" fullWidth>
                    <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
                    <MenuItem value="FIXED_AMOUNT">Flat Amount (₹)</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name="value"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Value"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{couponType === 'PERCENTAGE' ? '%' : '₹'}</InputAdornment>
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name="maxRedemptions"
                control={control}
                render={({ field }) => <TextField {...field} type="number" label="Total Usage Limit" fullWidth placeholder="100" />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name="minPurchaseAmount"
                control={control}
                render={({ field }) => <TextField {...field} type="number" label="Min Bill ₹" fullWidth />}
              />
            </Grid>

            {couponType === 'PERCENTAGE' && (
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="maxDiscountAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Max Discount Cap (₹)"
                      fullWidth
                      placeholder="Limit the discount amount e.g. 50% off up to ₹200"
                    />
                  )}
                />
              </Grid>
            )}

            {/* ================= VALIDITY ================= */}
            <Grid item xs={6}>
              <Controller
                name="validFrom"
                control={control}
                render={({ field }) => <TextField {...field} type="date" label="Valid From" InputLabelProps={{ shrink: true }} fullWidth />}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="validUntil"
                control={control}
                render={({ field }) => (
                  <TextField {...field} type="date" label="Valid Until" InputLabelProps={{ shrink: true }} fullWidth />
                )}
              />
            </Grid>

            {/* ================= TARGETING ================= */}
            <Grid size={{ xs: 12 }}>
              <Divider textAlign="left">
                <Chip label="Audience Targeting" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="targeting.type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Targeting Type" fullWidth>
                    <MenuItem value="ALL">All App Users</MenuItem>
                    <MenuItem value="GEOGRAPHIC">Geographic (City / Area)</MenuItem>
                    <MenuItem value="INDIVIDUAL">Selected Private Users</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {targetingType === 'GEOGRAPHIC' && (
              <>
                <Grid item xs={6}>
                  <Controller
                    name="targeting.geographic.cities"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} select fullWidth label="Cities" SelectProps={{ multiple: true }} disabled={isLocationLoading}>
                        <MenuItem value="__ALL__">All Cities</MenuItem>
                        {allCitiesWithAreas.map((city) => (
                          <MenuItem key={city._id} value={city._id}>
                            {city.city}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    name="targeting.geographic.areas"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Areas"
                        SelectProps={{ multiple: true }}
                        disabled={!selectedCities?.length}
                      >
                        <MenuItem value="__ALL__">All Areas</MenuItem>
                        {availableAreas.map((area) => (
                          <MenuItem key={area._id} value={area._id}>
                            {area.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </>
            )}

            {/* ================= PRODUCT RULES ================= */}
            <Grid size={{ xs: 12 }}>
              <Divider textAlign="left">
                <Chip label="Product Eligibility" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="productRules.type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Applicable On" fullWidth>
                    <MenuItem value="ALL_PRODUCTS">Entire Catalog</MenuItem>
                    <MenuItem value="CATEGORY">Specific Categories</MenuItem>
                    <MenuItem value="BRAND">Specific Brands</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 4, bgcolor: '#F8FAFC' }}>
          <Button onClick={onClose} sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" size="large" disableElevation sx={{ borderRadius: '12px', px: 6, fontWeight: 800 }}>
            Launch Campaign
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
