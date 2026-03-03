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
  Grid,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCitiesWithAreasAdmin } from '../../redux/features/Locations/LocationSlice';
import { createCouponAdmin, updateCouponAdmin, dynamicOptions } from '../../redux/features/Coupons/CouponSlice';

import CsvUploadDropzone from './CsvUploadDropzone';
import CampaignPreviewDialog from './CampaignPreviewDialog';
import { downloadInvalidCSV } from './csvHelpers';

export default function CreateCouponDialog({ open, onClose, onRefresh, editData = null }) {
  const dispatch = useDispatch();
  const isEdit = !!editData?._id;

  const { allCitiesWithAreas, isLocationLoading } = useSelector((state) => state.location);
  const { dynamicCategories = [], dynamicBrands = [] } = useSelector((state) => state.coupon);

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
      neverExpires: false,
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
  const neverExpires = watch('neverExpires');

  useEffect(() => {
    if (open) {
      dispatch(fetchAllCitiesWithAreasAdmin());
      dispatch(dynamicOptions());

      if (editData) {
        const formattedEditData = {
          ...editData,
          validFrom: editData.validFrom ? new Date(editData.validFrom).toISOString().split('T')[0] : '',
          validUntil: editData.validUntil ? new Date(editData.validUntil).toISOString().split('T')[0] : '',
          neverExpires: editData.neverExpires || false
        };
        reset(formattedEditData);
      } else {
        reset({
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
          neverExpires: false,
          targeting: { type: 'ALL', geographic: { cities: [], areas: [] }, csvMobiles: [] },
          productRules: { type: 'ALL_PRODUCTS', categories: [], brands: [] },
          notification: { title: '', body: '' },
          status: 'ACTIVE'
        });
      }
    }
  }, [open, editData, reset, dispatch]);

  const availableAreas = useMemo(() => {
    if (!selectedCities || selectedCities.length === 0) return [];
    return allCitiesWithAreas.filter((city) => selectedCities.includes(city._id)).flatMap((city) => city.areas || []);
  }, [selectedCities, allCitiesWithAreas]);

  useEffect(() => {
    const currentAreas = watch('targeting.geographic.areas') || [];
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

    if (normalized.neverExpires) {
      normalized.validUntil = null;
    }

    if (targetingType !== 'GEOGRAPHIC') {
      normalized.targeting.geographic = { cities: [], areas: [] };
    }

    if (targetingType === 'INDIVIDUAL' && csvData?.valid?.length) {
      normalized.targeting.csvMobiles = csvData.valid;
    } else if (targetingType !== 'INDIVIDUAL') {
      normalized.targeting.csvMobiles = [];
    }

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
    setPreviewOpen(true);
  };

  const handleConfirmLaunch = async () => {
    try {
      if (isEdit) {
        await dispatch(updateCouponAdmin({ id: editData._id, data: pendingPayload })).unwrap();
      } else {
        await dispatch(createCouponAdmin(pendingPayload)).unwrap();
      }
      setPreviewOpen(false);
      setCsvData(null);
      reset();
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error('Operation failed:', error);
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
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem' }}>{isEdit ? 'Update Campaign' : 'Create Campaign'}</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* All your existing fields remain unchanged above */}

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

              {!neverExpires && (
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
              )}

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="neverExpires"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                      label="Never Expires"
                    />
                  )}
                />
              </Grid>

              {/* Rest of your form remains exactly same below */}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="large" sx={{ borderRadius: '12px', px: 4 }}>
              {isEdit ? 'Preview & Update' : 'Preview & Launch'}
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
