import React, { useEffect, useState } from 'react';
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
  FormControlLabel,
  Switch,
  Chip,
  Box
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
// import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';

export default function CreateCouponDialog({ open, onClose, onRefresh }) {
  const dispatch = useDispatch();

  const { allCitiesWithAreas, isLocationLoading } = useSelector((state) => state.location);

  console.log('allCitiesWithAreas', allCitiesWithAreas);
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      title: '',
      code: '',
      type: 'PERCENTAGE',
      value: 0,
      minPurchaseAmount: 0,
      maxDiscount: 0,
      targeting: { type: 'ALL', geographic: { cities: [], areas: [] } },
      productRules: { type: 'ALL_PRODUCTS', categories: [], brands: [] },
      status: 'ACTIVE'
    }
  });

  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true); // To show loading state

  const targetingType = watch('targeting.type');

  useEffect(() => {
    if (open) {
      setLoadingLocations(true); // Start loading
      dispatch(fetchAllCitiesWithAreasAdmin())
        .then(() => {
          setLocations(allCitiesWithAreas); // assuming payload has the cities data
          setLoadingLocations(false); // Finished loading
        })
        .catch((error) => {
          console.error('Error fetching locations:', error);
          setLoadingLocations(false); // Stop loading even on error
        });
    }
  }, [open, dispatch]);

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/coupons', data);
      reset();
      onRefresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating coupon');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Campaign Offer</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <TextField {...field} label="Coupon Title" fullWidth placeholder="E.g. Diwali Dhamaka" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => <TextField {...field} label="Coupon Code" fullWidth placeholder="DIWALI2024" />}
              />
            </Grid>

            {/* Values */}
            <Grid size={{ xs: 4 }}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Type" fullWidth>
                    <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                    <MenuItem value="FLAT">Flat Discount</MenuItem>
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
                render={({ field }) => <TextField {...field} type="number" label="Min Purchase (₹)" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider>
                <Chip label="Targeting" />
              </Divider>
            </Grid>

            {/* Geographic Targeting */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="targeting.type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Targeting Type" fullWidth>
                    <MenuItem value="ALL">All Users</MenuItem>
                    <MenuItem value="GEOGRAPHIC">Geographic (City/Area)</MenuItem>
                    <MenuItem value="INDIVIDUAL">Specific Users</MenuItem>
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
                      <TextField
                        {...field}
                        select
                        label="Select Cities"
                        fullWidth
                        SelectProps={{ multiple: true }}
                        disabled={loadingLocations}
                      >
                        {loadingLocations ? (
                          <MenuItem disabled>Loading Cities...</MenuItem>
                        ) : (
                          locations.map((loc) => (
                            <MenuItem key={loc._id} value={loc._id}>
                              {loc.city}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="primary">
                    Users in these cities will receive an FCM Push Notification immediately.
                  </Typography>
                </Grid>
              </>
            )}

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
                    <MenuItem value="CATEGORY">Specific Categories</MenuItem>
                    <MenuItem value="BRAND">Specific Brands</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" size="large">
            Create & Notify Users
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
