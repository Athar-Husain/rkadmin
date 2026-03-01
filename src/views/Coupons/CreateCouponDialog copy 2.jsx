import React, { useEffect, useState, useMemo } from 'react';
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
  Chip,
  InputAdornment,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; // For live user searching
import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';
import { createCouponAdmin } from '../../redux/features/Coupons/CouponSlice';

export default function CreateCouponDialog({ open, onClose, onRefresh }) {
  const dispatch = useDispatch();
  const { allCitiesWithAreas } = useSelector((state) => state.location);

  // States for User Searching
  const [userOptions, setUserOptions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      title: '',
      code: '',
      description: '',
      type: 'PERCENTAGE',
      value: 0,
      minPurchaseAmount: 0,
      maxDiscount: 0,
      maxRedemptions: 1000,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
      targeting: { type: 'ALL', geographic: { cities: [], areas: [] }, users: [] },
      productRules: { type: 'ALL_PRODUCTS', categories: [], brands: [] }
    }
  });

  const targetingType = watch('targeting.type');
  const prodType = watch('productRules.type');
  const selectedCities = watch('targeting.geographic.cities');

  useEffect(() => {
    if (open) dispatch(fetchAllCitiesWithAreasAdmin());
  }, [open, dispatch]);

  // Live Search Users from Backend
  const handleUserSearch = async (query) => {
    if (query.length < 3) return;
    setLoadingUsers(true);
    try {
      const { data } = await axios.get(`/api/v1/admin/users/search?query=${query}`);
      setUserOptions(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingUsers(false);
  };

  const availableAreas = useMemo(() => {
    if (!selectedCities?.length) return [];
    return allCitiesWithAreas.filter((city) => selectedCities.includes(city._id)).flatMap((city) => city.areas || []);
  }, [selectedCities, allCitiesWithAreas]);

  const onSubmit = async (data) => {
    try {
      // Ensure numeric values
      const payload = {
        ...data,
        value: Number(data.value),
        maxRedemptions: Number(data.maxRedemptions),
        minPurchaseAmount: Number(data.minPurchaseAmount)
      };
      await dispatch(createCouponAdmin(payload)).unwrap();
      reset();
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 900, fontSize: '1.4rem' }}>Launch Marketing Campaign</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* NOTIFICATION CONTENT */}
            <Grid item xs={12} md={7}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Push Notification Title" fullWidth placeholder="e.g. Special Weekend Offer!" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Coupon Code" fullWidth sx={{ input: { fontWeight: 800, color: 'primary.main' } }} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Push Message Body"
                    multiline
                    rows={2}
                    fullWidth
                    placeholder="Write the message users will see on their phones..."
                  />
                )}
              />
            </Grid>

            {/* VALUE CONFIG */}
            <Grid item xs={12}>
              <Divider>
                <Chip label="Discount Details" />
              </Divider>
            </Grid>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <Controller
                name="value"
                control={control}
                render={({ field }) => <TextField {...field} type="number" label="Value" fullWidth />}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="maxRedemptions"
                control={control}
                render={({ field }) => <TextField {...field} type="number" label="Inventory (Limit)" fullWidth />}
              />
            </Grid>

            {/* TARGETING LOGIC */}
            <Grid item xs={12}>
              <Divider>
                <Chip label="Target Audience" />
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="targeting.type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Who should receive this?" fullWidth>
                    <MenuItem value="ALL">All App Users</MenuItem>
                    <MenuItem value="GEOGRAPHIC">By Location (City/Area)</MenuItem>
                    <MenuItem value="INDIVIDUAL">Private (Select Specific Users)</MenuItem>
                    <MenuItem value="PURCHASE_HISTORY">Existing Customers Only</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {targetingType === 'INDIVIDUAL' && (
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  loading={loadingUsers}
                  options={userOptions}
                  getOptionLabel={(option) => `${option.name} (${option.mobile})`}
                  onInputChange={(e, value) => handleUserSearch(value)}
                  onChange={(e, value) => {
                    const ids = value.map((u) => u._id);
                    control._fields['targeting.users']._f.value = ids; // Manual update for nested field
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Users by Name/Mobile"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingUsers ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
            )}

            {targetingType === 'GEOGRAPHIC' && (
              <>
                <Grid item xs={6}>
                  <Controller
                    name="targeting.geographic.cities"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} select fullWidth label="Select Cities" SelectProps={{ multiple: true }}>
                        {allCitiesWithAreas.map((c) => (
                          <MenuItem key={c._id} value={c._id}>
                            {c.city}
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
                      <TextField {...field} select fullWidth label="Select Areas" SelectProps={{ multiple: true }}>
                        {availableAreas.map((a) => (
                          <MenuItem key={a._id} value={a._id}>
                            {a.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </>
            )}

            {/* PRODUCT RULES */}
            <Grid item xs={12}>
              <Divider>
                <Chip label="Product Restrictions" />
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="productRules.type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Apply Coupon On" fullWidth>
                    <MenuItem value="ALL_PRODUCTS">Everything</MenuItem>
                    <MenuItem value="CATEGORY">Specific Categories</MenuItem>
                    <MenuItem value="BRAND">Specific Brands</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f9f9f9' }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" size="large" sx={{ px: 4 }}>
            Create & Send Push
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
