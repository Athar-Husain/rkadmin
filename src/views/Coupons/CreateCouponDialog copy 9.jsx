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
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';
import { createCouponAdmin, dynamicOptions } from '../../redux/features/Coupons/CouponSlice';

import CsvUploadDropzone from './CsvUploadDropzone';
import CampaignPreviewDialog from './CampaignPreviewDialog';
import { downloadInvalidCSV } from './csvHelpers';

export default function CreateCouponDialog({ open, onClose, onRefresh }) {
  const dispatch = useDispatch();

  const { allCitiesWithAreas = [], isLocationLoading } = useSelector((state) => state.location);
  const { dynamicCategories = [], dynamicBrands = [] } = useSelector((state) => state.coupon);

  const [csvData, setCsvData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

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
      targeting: {
        type: 'ALL',
        geographic: { cities: [], areas: [] }
      },
      productRules: {
        type: 'ALL_PRODUCTS',
        categories: [],
        brands: []
      },
      notification: {
        title: '',
        body: ''
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
      dispatch(dynamicOptions());
    }
  }, [open, dispatch]);

  const availableAreas = useMemo(() => {
    if (!selectedCities?.length) return [];
    return allCitiesWithAreas.filter((city) => selectedCities.includes(city._id)).flatMap((city) => city.areas || []);
  }, [selectedCities, allCitiesWithAreas]);

  const normalizePayload = (data) => {
    const normalized = {
      ...data,
      value: Number(data.value),
      minPurchaseAmount: Number(data.minPurchaseAmount),
      maxDiscountAmount: Number(data.maxDiscountAmount),
      maxRedemptions: Number(data.maxRedemptions),
      code: data.code.toUpperCase().trim(),
      productRules: {
        ...data.productRules,
        categories: data.productRules.categories?.map((c) => c.trim()),
        brands: data.productRules.brands?.map((b) => b.trim())
      }
    };

    if (targetingType === 'INDIVIDUAL' && csvData?.valid?.length) {
      normalized.targeting.csvMobiles = csvData.valid;
    }

    if (normalized.productRules.type === 'ALL_PRODUCTS') {
      normalized.productRules.categories = [];
      normalized.productRules.brands = [];
    }

    if (normalized.productRules.type === 'CATEGORY') {
      normalized.productRules.brands = [];
    }

    if (normalized.productRules.type === 'BRAND') {
      normalized.productRules.categories = [];
    }

    return normalized;
  };

  const onSubmit = (formData) => {
    const payload = normalizePayload(formData);
    setPendingPayload(payload);
    setPreviewOpen(true);
  };

  const handleConfirmLaunch = async () => {
    try {
      await dispatch(createCouponAdmin(pendingPayload)).unwrap();
      setPreviewOpen(false);
      setCsvData(null);
      reset();
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error('Campaign launch failed:', error);
    }
  };

  const downloadSampleCSV = () => {
    const sampleContent = `mobile
9876543210
9123456789
9988776655
9012345678`;

    const blob = new Blob([sampleContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_users.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Create Campaign</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* BASIC INFO */}
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
                    <TextField {...field} label="Coupon Code" fullWidth sx={{ '& input': { textTransform: 'uppercase' } }} />
                  )}
                />
              </Grid>

              {/* DISCOUNT */}
              <Grid item xs={12} sm={3}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Type" fullWidth>
                      <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                      <MenuItem value="FIXED_AMOUNT">Flat</MenuItem>
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

              {/* PRODUCT RULES */}
              <Grid item xs={12}>
                <Divider>
                  <Chip label="Product Eligibility" />
                </Divider>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="productRules.type"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select fullWidth label="Applicable On">
                      <MenuItem value="ALL_PRODUCTS">All Products</MenuItem>
                      <MenuItem value="CATEGORY">Category</MenuItem>
                      <MenuItem value="BRAND">Brand</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              {/* CATEGORY CREATABLE */}
              {productRuleType === 'CATEGORY' && (
                <Grid item xs={12}>
                  <Controller
                    name="productRules.categories"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        freeSolo
                        options={dynamicCategories}
                        value={field.value || []}
                        onChange={(e, newValue) => field.onChange(newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => <Chip label={option} {...getTagProps({ index })} key={index} />)
                        }
                        renderInput={(params) => <TextField {...params} label="Select or Add Categories" />}
                      />
                    )}
                  />
                </Grid>
              )}

              {/* BRAND CREATABLE */}
              {productRuleType === 'BRAND' && (
                <Grid item xs={12}>
                  <Controller
                    name="productRules.brands"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        freeSolo
                        options={dynamicBrands}
                        value={field.value || []}
                        onChange={(e, newValue) => field.onChange(newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => <Chip label={option} {...getTagProps({ index })} key={index} />)
                        }
                        renderInput={(params) => <TextField {...params} label="Select or Add Brands" />}
                      />
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

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Preview Campaign
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <CampaignPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onConfirm={handleConfirmLaunch}
        formData={watch()}
        csvSummary={
          csvData
            ? {
                total: csvData.total,
                valid: csvData.valid.length,
                invalid: csvData.invalid.length
              }
            : null
        }
      />
    </>
  );
}
