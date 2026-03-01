import React, { useEffect, useMemo, useState } from 'react';
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
  Box,
  InputAdornment,
  Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';
import { createCouponAdmin, dynamicOptions } from '../../redux/features/Coupons/CouponSlice';
import { debounce } from 'lodash';

export default function CreateCouponDialog({ open, onClose, onRefresh }) {
  const dispatch = useDispatch();
  const { allCitiesWithAreas, isLocationLoading } = useSelector((state) => state.location);
  const { dynamicCategories, dynamicBrands, dynamicUsers } = useSelector((state) => state.coupon);

  const [userSearchResults, setUserSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      title: '',
      code: '',
      description: '',
      type: 'PERCENTAGE',
      value: 0,
      minPurchaseAmount: 0,
      maxDiscountAmount: 0,
      maxRedemptions: 100,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
      targeting: {
        type: 'ALL',
        geographic: { cities: [], areas: [] },
        users: []
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
  const productRuleType = watch('productRules.type');

  useEffect(() => {
    if (open) {
      dispatch(fetchAllCitiesWithAreasAdmin());
      dispatch(dynamicOptions()); // fetch categories, brands, and optionally users
    }
  }, [open, dispatch]);

  const availableAreas = useMemo(() => {
    if (!selectedCities || selectedCities.length === 0) return [];
    return allCitiesWithAreas.filter((city) => selectedCities.includes(city._id)).flatMap((city) => city.areas || []);
  }, [selectedCities, allCitiesWithAreas]);

  /* =========================
      USER SEARCH FOR PRIVATE TARGETING
  ========================= */
  const handleUserSearch = debounce(async (query) => {
    if (!query) {
      setUserSearchResults([]);
      return;
    }
    const results = dynamicUsers?.filter(
      (u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email?.toLowerCase().includes(query.toLowerCase()) ||
        u.mobile?.includes(query)
    );
    setUserSearchResults(results);
  }, 300);

  const addUser = (user) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      const newSelected = [...selectedUsers, user];
      setSelectedUsers(newSelected);
      setValue(
        'targeting.users',
        newSelected.map((u) => u._id)
      );
    }
    setUserSearchResults([]);
  };

  const removeUser = (userId) => {
    const newSelected = selectedUsers.filter((u) => u._id !== userId);
    setSelectedUsers(newSelected);
    setValue(
      'targeting.users',
      newSelected.map((u) => u._id)
    );
  };

  /* =========================
      PAYLOAD NORMALIZATION
  ========================= */
  const normalizePayload = (data) => {
    const numericData = {
      ...data,
      value: Number(data.value),
      minPurchaseAmount: Number(data.minPurchaseAmount),
      maxDiscountAmount: Number(data.maxDiscountAmount),
      maxRedemptions: Number(data.maxRedemptions),
      code: data.code.toUpperCase().trim()
    };

    const { targeting, productRules } = numericData;

    // Targeting
    if (targeting.type === 'GEOGRAPHIC') {
      numericData.targeting.geographic = {
        cities: targeting.geographic.cities.includes('__ALL__') ? [] : targeting.geographic.cities,
        areas: targeting.geographic.areas.includes('__ALL__') ? [] : targeting.geographic.areas
      };
    }

    // Product rules
    numericData.productRules = {
      type: productRules.type || 'ALL_PRODUCTS',
      categories: productRules.type === 'CATEGORY' ? productRules.categories.map((c) => c.trim()) : [],
      brands: productRules.type === 'BRAND' ? productRules.brands.map((b) => b.trim()) : []
    };

    return numericData;
  };

  const onSubmit = async (formData) => {
    try {
      const payload = normalizePayload(formData);
      await dispatch(createCouponAdmin(payload)).unwrap();
      reset();
      setSelectedUsers([]);
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
            <Grid item xs={12} md={6}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <TextField {...field} label="Campaign Title" fullWidth />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Coupon Code"
                    fullWidth
                    sx={{ '& input': { textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 } }}
                  />
                )}
              />
            </Grid>

            {/* ================= VALUES ================= */}
            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
              <Controller
                name="maxRedemptions"
                control={control}
                render={({ field }) => <TextField {...field} type="number" label="Total Usage Limit" fullWidth />}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Controller
                name="minPurchaseAmount"
                control={control}
                render={({ field }) => <TextField {...field} type="number" label="Min Bill ₹" fullWidth />}
              />
            </Grid>

            {couponType === 'PERCENTAGE' && (
              <Grid item xs={12}>
                <Controller
                  name="maxDiscountAmount"
                  control={control}
                  render={({ field }) => <TextField {...field} type="number" label="Max Discount Cap (₹)" fullWidth />}
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
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Chip label="Audience Targeting" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>

            <Grid item xs={12}>
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

            {targetingType === 'INDIVIDUAL' && (
              <Grid item xs={12}>
                <TextField
                  label="Search Users"
                  fullWidth
                  placeholder="Search by name, email, or mobile"
                  onChange={(e) => handleUserSearch(e.target.value)}
                />
                <Box sx={{ mt: 1, mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedUsers.map((user) => (
                    <Chip key={user._id} label={`${user.name} (${user.mobile || user.email})`} onDelete={() => removeUser(user._id)} />
                  ))}
                </Box>
                {userSearchResults.length > 0 && (
                  <Box sx={{ border: '1px solid #ccc', borderRadius: 1, mt: 1, maxHeight: 200, overflowY: 'auto' }}>
                    {userSearchResults.map((user) => (
                      <Box key={user._id} sx={{ p: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f0f0' } }} onClick={() => addUser(user)}>
                        {user.name} ({user.mobile || user.email})
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            )}

            {/* ================= PRODUCT RULES ================= */}
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Chip label="Product Eligibility" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>

            <Grid item xs={12}>
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

            {productRuleType === 'CATEGORY' && (
              <Grid item xs={12}>
                <Controller
                  name="productRules.categories"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Select Categories" fullWidth SelectProps={{ multiple: true }}>
                      {dynamicCategories?.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            )}

            {productRuleType === 'BRAND' && (
              <Grid item xs={12}>
                <Controller
                  name="productRules.brands"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Select Brands" fullWidth SelectProps={{ multiple: true }}>
                      {dynamicBrands?.map((b) => (
                        <MenuItem key={b} value={b}>
                          {b}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            )}
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
