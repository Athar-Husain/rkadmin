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

import CsvUploadDropzone from './CsvUploadDropzone';
import CampaignPreviewDialog from './CampaignPreviewDialog';
import { downloadInvalidCSV } from './csvHelpers';

export default function CreateCouponDialog({ open, onClose, onRefresh }) {
  const dispatch = useDispatch();

  const { allCitiesWithAreas, isLocationLoading } = useSelector((state) => state.location);

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
    if (!selectedCities || selectedCities.length === 0) return [];
    return allCitiesWithAreas.filter((city) => selectedCities.includes(city._id)).flatMap((city) => city.areas || []);
  }, [selectedCities, allCitiesWithAreas]);

  const normalizePayload = (data) => {
    const normalized = {
      ...data,
      value: Number(data.value),
      minPurchaseAmount: Number(data.minPurchaseAmount),
      maxDiscountAmount: Number(data.maxDiscountAmount),
      maxRedemptions: Number(data.maxRedemptions),
      code: data.code.toUpperCase().trim()
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
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem' }}>Create Campaign</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* BASIC INFO */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Campaign Title" fullWidth />}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Coupon Code" fullWidth sx={{ '& input': { textTransform: 'uppercase' } }} />
                  )}
                />
              </Grid>

              {/* DISCOUNT */}
              <Grid size={{xs:12, sm:3}}>
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

              <Grid size={{xs:12, sm:3}}>
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

              {/* VALIDITY */}
              <Grid size={{xs:6}}>
                <Controller
                  name="validFrom"
                  control={control}
                  render={({ field }) => <TextField {...field} type="date" fullWidth InputLabelProps={{ shrink: true }} />}
                />
              </Grid>

              <Grid size={{xs:6}}>
                <Controller
                  name="validUntil"
                  control={control}
                  render={({ field }) => <TextField {...field} type="date" fullWidth InputLabelProps={{ shrink: true }} />}
                />
              </Grid>

              {/* TARGETING */}
              <Grid size={{xs:12}}>
                <Divider>
                  <Chip label="Audience Targeting" />
                </Divider>
              </Grid>

              <Grid size={{xs:12}}>
                <Controller
                  name="targeting.type"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Target Type" fullWidth>
                      <MenuItem value="ALL">All Users</MenuItem>
                      <MenuItem value="GEOGRAPHIC">Geographic</MenuItem>
                      <MenuItem value="INDIVIDUAL">Private Users (CSV)</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              {/* GEOGRAPHIC */}
              {targetingType === 'GEOGRAPHIC' && (
                <>
                  <Grid size={{xs:6}}>
                    <Controller
                      name="targeting.geographic.cities"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} select fullWidth SelectProps={{ multiple: true }} label="Cities" disabled={isLocationLoading}>
                          {allCitiesWithAreas.map((city) => (
                            <MenuItem key={city._id} value={city._id}>
                              {city.city}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{xs:6}}>
                    <Controller
                      name="targeting.geographic.areas"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} select fullWidth SelectProps={{ multiple: true }} label="Areas">
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

              {/* INDIVIDUAL CSV */}
              {targetingType === 'INDIVIDUAL' && (
                <Grid size={{xs:12}}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: '#F5F7FA',
                      border: '1px solid #E0E0E0'
                    }}
                  >
                    <Typography fontWeight={700} gutterBottom>
                      CSV Upload Instructions
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      • File must be .csv format
                      <br />• Single column header must be: <b>mobile</b>
                      <br />
                      • Only 10-digit mobile numbers
                      <br />• No +91, spaces, or special characters
                    </Typography>

                    <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={downloadSampleCSV}>
                      Download Sample CSV
                    </Button>
                  </Box>
                  <CsvUploadDropzone onProcessed={(result) => setCsvData(result)} />

                  {csvData && (
                    <Box mt={2}>
                      <Typography>Total: {csvData.total}</Typography>
                      <Typography color="success.main">Valid: {csvData.valid.length}</Typography>
                      {csvData.invalid.length > 0 && (
                        <>
                          <Typography color="error.main">Invalid: {csvData.invalid.length}</Typography>
                          <Button size="small" color="error" onClick={() => downloadInvalidCSV(csvData.invalid)}>
                            Download Invalid Numbers
                          </Button>
                        </>
                      )}
                    </Box>
                  )}
                </Grid>
              )}

              {/* PRODUCT RULES */}
              <Grid size={{xs:12}}>
                <Divider>
                  <Chip label="Product Eligibility" />
                </Divider>
              </Grid>

              <Grid size={{xs:12}}>
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

              {productRuleType === 'CATEGORY' && (
                <Grid size={{xs:12}}>
                  <Controller
                    name="productRules.categories"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} select fullWidth SelectProps={{ multiple: true }}>
                        {dynamicCategories.map((c) => (
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
                <Grid size={{xs:12}}>
                  <Controller
                    name="productRules.brands"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} select fullWidth SelectProps={{ multiple: true }}>
                        {dynamicBrands.map((b) => (
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

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Preview Campaign
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* CAMPAIGN PREVIEW */}
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
