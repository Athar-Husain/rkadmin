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
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';
import { createCouponAdmin, dynamicOptions } from '../../redux/features/Coupons/CouponSlice';

export default function CreateCouponDialog({ open, onClose, onRefresh }) {
  const dispatch = useDispatch();
  const { allCitiesWithAreas, isLocationLoading } = useSelector((state) => state.location);
  const { coupons, dynamicOptions: options } = useSelector((state) => state.coupon);

  const { control, handleSubmit, watch, reset } = useForm({
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
      targeting: { type: 'ALL', geographic: { cities: [], areas: [] } },
      productRules: { type: 'ALL_PRODUCTS', categories: [], brands: [] },
      notification: { title: '', body: '' },
      status: 'ACTIVE'
    }
  });

  const targetingType = watch('targeting.type');
  const selectedCities = watch('targeting.geographic.cities');
  const couponType = watch('type');
  const productRuleType = watch('productRules.type');

  // -------------------------
  // Fetch cities & dynamic options for categories/brands
  // -------------------------
  useEffect(() => {
    if (open) {
      dispatch(fetchAllCitiesWithAreasAdmin());
      dispatch(dynamicOptions());
    }
  }, [open, dispatch]);

  // -------------------------
  // Derived areas from selected cities
  // -------------------------
  const availableAreas = useMemo(() => {
    if (!selectedCities || selectedCities.length === 0) return [];
    return allCitiesWithAreas.filter((city) => selectedCities.includes(city._id)).flatMap((city) => city.areas || []);
  }, [selectedCities, allCitiesWithAreas]);

  // -------------------------
  // Normalize payload before submitting
  // -------------------------
  const normalizePayload = (data) => {
    const numericData = {
      ...data,
      value: Number(data.value),
      minPurchaseAmount: Number(data.minPurchaseAmount),
      maxDiscountAmount: Number(data.maxDiscountAmount),
      maxRedemptions: Number(data.maxRedemptions),
      code: data.code.toUpperCase().trim()
    };

    // Normalize targeting
    if (numericData.targeting.type !== 'GEOGRAPHIC') {
      numericData.targeting = { type: numericData.targeting.type };
    } else {
      const cities = numericData.targeting.geographic.cities || [];
      const areas = numericData.targeting.geographic.areas || [];
      numericData.targeting.geographic = {
        cities: cities.includes('__ALL__') ? [] : cities,
        areas: areas.includes('__ALL__') ? [] : areas
      };
    }

    // Normalize product rules
    const pr = numericData.productRules || { type: 'ALL_PRODUCTS', categories: [], brands: [] };
    pr.type = pr.type || 'ALL_PRODUCTS';
    pr.categories = Array.isArray(pr.categories) ? pr.categories.filter(Boolean) : [];
    pr.brands = Array.isArray(pr.brands) ? pr.brands.filter(Boolean) : [];
    if (pr.type === 'ALL_PRODUCTS') {
      pr.categories = [];
      pr.brands = [];
    }
    numericData.productRules = pr;

    return numericData;
  };

  // -------------------------
  // Submit handler
  // -------------------------
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
            <Grid item xs={12} md={6}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <TextField {...field} label="Campaign Title" fullWidth placeholder="e.g. Summer Sale 2026" />}
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
                    placeholder="SUMMER50"
                    sx={{ '& input': { textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 } }}
                  />
                )}
              />
            </Grid>

            {/* ================= VALUES & LIMITS ================= */}
            <Grid item xs={12}>
              <Divider textAlign="left">
                <Chip label="Value & Inventory" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>

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
                    <TextField
                      {...field}
                      select
                      label="Select Categories"
                      fullWidth
                      SelectProps={{ multiple: true }}
                      placeholder="Choose categories"
                    >
                      {options?.categories?.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
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
                    <TextField
                      {...field}
                      select
                      label="Select Brands"
                      fullWidth
                      SelectProps={{ multiple: true }}
                      placeholder="Choose brands"
                    >
                      {options?.brands?.map((b) => (
                        <MenuItem key={b} value={b}>
                          {b}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            )}

            {/* ================= ADVANCED NOTIFICATIONS ================= */}
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>Notification Settings (Advanced)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="notification.title"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Notification Title" fullWidth placeholder="New Offer for You! 🎁" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="notification.body"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Notification Body"
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Use placeholders like {code}, {value}, {type}"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
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
