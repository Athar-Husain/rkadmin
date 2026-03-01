import React, { useEffect, useMemo, useState } from 'react';
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
  Box,
  InputAdornment,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  Grid // MUI v6 standard
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

  console.log('dynamicCategories', dynamicCategories);
  console.log('dynamicBrands', dynamicBrands);

  const [csvData, setCsvData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  const { control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      title: '',
      code: '',
      description: '',
      type: 'PERCENTAGE',
      value: 0,
      minPurchaseAmount: 0,
      maxDiscountAmount: 0,
      maxRedemptions: 1000,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
      targeting: {
        type: 'ALL',
        geographic: { cities: [], areas: [] },
        csvMobiles: []
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
  const validFromDate = watch('validFrom');

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

  // Clean up areas if cities are removed
  useEffect(() => {
    const currentAreas = watch('targeting.geographic.areas');
    const validAreaIds = availableAreas.map((a) => a._id);
    const filteredAreas = currentAreas.filter((id) => validAreaIds.includes(id));
    if (filteredAreas.length !== currentAreas.length) {
      setValue('targeting.geographic.areas', filteredAreas);
    }
  }, [availableAreas, setValue, watch]);

  const normalizePayload = (data) => {
    const normalized = {
      ...data,
      value: Number(data.value),
      minPurchaseAmount: Number(data.minPurchaseAmount),
      maxDiscountAmount: Number(data.maxDiscountAmount),
      maxRedemptions: Number(data.maxRedemptions),
      code: data.code.toUpperCase().trim()
    };

    // 1. Sanitize Targeting
    if (targetingType !== 'GEOGRAPHIC') {
      normalized.targeting.geographic = { cities: [], areas: [] };
    }

    if (targetingType === 'INDIVIDUAL' && csvData?.valid?.length) {
      normalized.targeting.csvMobiles = csvData.valid;
    } else {
      normalized.targeting.csvMobiles = [];
    }

    // 2. Sanitize Product Rules
    if (normalized.productRules.type === 'ALL_PRODUCTS') {
      normalized.productRules.categories = [];
      normalized.productRules.brands = [];
    } else if (normalized.productRules.type === 'CATEGORY') {
      normalized.productRules.brands = [];
    } else if (normalized.productRules.type === 'BRAND') {
      normalized.productRules.categories = [];
    }

    return normalized;
  };

  const onSubmit = (formData) => {
    const payload = normalizePayload(formData);
    setPendingPayload(payload);
    console.log('formData', formData);

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
    const sampleContent = `mobile\n9876543210\n9123456789`;
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
                  rules={{ required: 'Title is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Campaign Title"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="code"
                  control={control}
                  rules={{ required: 'Code is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Coupon Code"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{ '& input': { textTransform: 'uppercase' } }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Coupon Description" fullWidth multiline rows={2} />}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider textAlign="left">
                  <Chip label="Value & Inventory" sx={{ fontWeight: 700 }} />
                </Divider>
              </Grid>

              {/* DISCOUNT */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Type" fullWidth>
                      <MenuItem value="PERCENTAGE">Percentage</MenuItem>
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
                      label="Discount Value"
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
                  render={({ field }) => <TextField {...field} type="number" label="Total Usage Limit" fullWidth />}
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
                      <TextField {...field} type="number" label="Max Discount Cap (₹)" fullWidth placeholder="e.g. 50% off up to ₹200" />
                    )}
                  />
                </Grid>
              )}

              {/* VALIDITY */}
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="validFrom"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField {...field} label="Starts From" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Controller
                  name="validUntil"
                  control={control}
                  rules={{ required: 'Expiry date is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Expires On"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      slotProps={{ htmlInput: { min: validFromDate } }}
                    />
                  )}
                />
              </Grid>

              {/* TARGETING */}
              <Grid size={{ xs: 12 }}>
                <Divider>
                  <Chip label="Audience Targeting" />
                </Divider>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="targeting.type"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Target Type" fullWidth>
                      <MenuItem value="ALL">All Users</MenuItem>
                      <MenuItem value="GEOGRAPHIC">Geographic (City/Area)</MenuItem>
                      <MenuItem value="INDIVIDUAL">Specific Users (CSV Upload)</MenuItem>
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
                        <TextField
                          {...field}
                          select
                          fullWidth
                          SelectProps={{ multiple: true }}
                          label="Select Cities"
                          disabled={isLocationLoading}
                        >
                          {allCitiesWithAreas.map((city) => (
                            <MenuItem key={city._id} value={city._id}>
                              {city.city}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Controller
                      name="targeting.geographic.areas"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          SelectProps={{ multiple: true }}
                          label="Select Areas"
                          disabled={!selectedCities.length}
                        >
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
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: '#F5F7FA', border: '1px solid #E0E0E0' }}>
                    <Typography fontWeight={700} variant="subtitle2">
                      CSV Requirements:
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • Column Header: <b>mobile</b> | • Format: 10 digits only (e.g. 9876543210)
                    </Typography>
                    <br />
                    <Button variant="text" size="small" onClick={downloadSampleCSV}>
                      Download Sample
                    </Button>
                  </Box>
                  <CsvUploadDropzone onProcessed={(result) => setCsvData(result)} />
                  {csvData && (
                    <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">
                        Valid Numbers: <b>{csvData.valid.length}</b>
                      </Typography>
                      {csvData.invalid.length > 0 && (
                        <Button size="small" color="error" onClick={() => downloadInvalidCSV(csvData.invalid)}>
                          Download {csvData.invalid.length} Invalid
                        </Button>
                      )}
                    </Box>
                  )}
                </Grid>
              )}

              {/* PRODUCT RULES */}
              <Grid size={{ xs: 12 }}>
                <Divider>
                  <Chip label="Product Eligibility" />
                </Divider>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="productRules.type"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select fullWidth label="Applicable On">
                      <MenuItem value="ALL_PRODUCTS">Entire Store</MenuItem>
                      <MenuItem value="CATEGORY">Specific Categories</MenuItem>
                      <MenuItem value="BRAND">Specific Brands</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              {/* {productRuleType === 'CATEGORY' && (
                <Grid size={{ xs: 12 }}>
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
                        onChange={(_, val) => field.onChange(val)}
                        renderTags={(val, getTagProps) =>
                          val.map((opt, idx) => <Chip label={opt} {...getTagProps({ index: idx })} key={idx} />)
                        }
                        renderInput={(params) => <TextField {...params} label="Categories" placeholder="Type and press enter" />}
                      />
                    )}
                  />
                </Grid>
              )}

              {productRuleType === 'BRAND' && (
                <Grid size={{ xs: 12 }}>
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
                        onChange={(_, val) => field.onChange(val)}
                        renderTags={(val, getTagProps) =>
                          val.map((opt, idx) => <Chip label={opt} {...getTagProps({ index: idx })} key={idx} />)
                        }
                        renderInput={(params) => <TextField {...params} label="Brands" placeholder="Type and press enter" />}
                      />
                    )}
                  />
                </Grid>
              )} */}

              {productRuleType === 'CATEGORY' && (
                <Grid size={{ xs: 12 }}>
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
                        // Handles both selection from dropdown and custom typing
                        onChange={(_, newValue) => {
                          field.onChange(newValue);
                        }}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip label={option} {...getTagProps({ index })} key={index} color="primary" variant="outlined" />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select or Add Categories"
                            placeholder="Search existing or type new"
                            helperText="You can select from the list or type a custom category and press Enter"
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              )}

              {productRuleType === 'BRAND' && (
                <Grid size={{ xs: 12 }}>
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
                        onChange={(_, newValue) => {
                          field.onChange(newValue);
                        }}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip label={option} {...getTagProps({ index })} key={index} color="secondary" variant="outlined" />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select or Add Brands"
                            placeholder="Search existing or type new"
                            helperText="Search for a brand or create a new one by typing"
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              )}

              {/* NOTIFICATIONS */}
              <Grid size={{ xs: 12 }}>
                <Accordion variant="outlined" sx={{ borderRadius: '12px !important' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 700 }}>Push Notification (Optional)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="notification.title"
                          control={control}
                          render={({ field }) => <TextField {...field} label="Title" fullWidth placeholder="New Surprise! 🎁" />}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="notification.body"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Notification Message"
                              fullWidth
                              multiline
                              rows={3}
                              placeholder="Use code {code} to get {value} off!"
                              helperText={
                                <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                                  Available tags:
                                  <Chip label="{code}" size="small" sx={{ ml: 0.5, height: 18 }} />
                                  <Chip label="{value}" size="small" sx={{ ml: 0.5, height: 18 }} />
                                  <Chip label="{title}" size="small" sx={{ ml: 0.5, height: 18 }} />
                                </Box>
                              }
                            />
                          )}
                        />
                      </Grid>
                      {/* <Grid size={{ xs: 12 }}>
                        <Controller
                          name="notification.body"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Message Body"
                              fullWidth
                              multiline
                              rows={2}
                              placeholder="Get {value} off on your next order!"
                            />
                          )}
                        />
                      </Grid> */}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="large" sx={{ borderRadius: '12px', px: 4 }}>
              Preview & Launch
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <CampaignPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onConfirm={handleConfirmLaunch}
        formData={watch()}
        csvSummary={csvData ? { total: csvData.total, valid: csvData.valid.length, invalid: csvData.invalid.length } : null}
      />
    </>
  );
}
