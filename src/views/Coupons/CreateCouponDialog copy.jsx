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
  Chip
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
      type: 'PERCENTAGE',
      value: 0,
      minPurchaseAmount: 0,
      maxDiscount: 0,
      validFrom: '',
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
    if (data.targeting.type !== 'GEOGRAPHIC') {
      return {
        ...data,
        targeting: { type: data.targeting.type }
      };
    }

    const cities = data.targeting.geographic.cities || [];
    const areas = data.targeting.geographic.areas || [];

    return {
      ...data,
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
     SUBMIT
  ========================= */
  const onSubmit = async (formData) => {
    try {
      const payload = normalizePayload(formData);
      await dispatch(createCouponAdmin(payload));
      reset();
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error('Create coupon error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>Create New Campaign Offer</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* ================= BASIC INFO ================= */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller name="title" control={control} render={({ field }) => <TextField {...field} label="Coupon Title" fullWidth />} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller name="code" control={control} render={({ field }) => <TextField {...field} label="Coupon Code" fullWidth />} />
            </Grid>

            {/* ================= VALUES ================= */}
            <Grid size={{ xs: 4 }}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Discount Type" fullWidth>
                    <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                    <MenuItem value="FIXED_AMOUNT">Flat Amount</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 4 }}>
              <Controller
                name="value"
                control={control}
                render={({ field }) => <TextField {...field} type="number" label="Value" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 4 }}>
              <Controller
                name="minPurchaseAmount"
                control={control}
                render={({ field }) => <TextField {...field} type="number" label="Min Purchase ₹" fullWidth />}
              />
            </Grid>

            {/* ================= VALIDITY ================= */}
            <Grid size={{ xs: 6 }}>
              <Controller
                name="validFrom"
                control={control}
                render={({ field }) => <TextField {...field} type="date" label="Valid From" InputLabelProps={{ shrink: true }} fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
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
                    <MenuItem value="GEOGRAPHIC">Geographic (City / Area)</MenuItem>
                    <MenuItem value="INDIVIDUAL">Specific Users</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {targetingType === 'GEOGRAPHIC' && (
              <>
                {/* ================= CITIES ================= */}
                <Grid size={{ xs: 6 }}>
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

                {/* ================= AREAS ================= */}
                <Grid size={{ xs: 6 }}>
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

                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="primary">
                    Leaving city or area empty means entire coverage.
                  </Typography>
                </Grid>
              </>
            )}

            {/* ================= PRODUCT RULES ================= */}
            <Grid size={{ xs: 12 }}>
              <Divider>
                <Chip label="Product Rules" />
              </Divider>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="productRules.type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Rule Type" fullWidth>
                    <MenuItem value="ALL_PRODUCTS">All Products</MenuItem>
                    <MenuItem value="CATEGORY">Category</MenuItem>
                    <MenuItem value="BRAND">Brand</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" size="large">
            Create & Notify Users
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
