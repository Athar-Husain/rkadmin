import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, MenuItem, Button, Grid, Box } from '@mui/material';

const CouponForm = ({ initialData = {}, onClose }) => {
  // Convert ISO date string to YYYY-MM-DD
  const formatDate = (isoDate) => (isoDate ? isoDate.split('T')[0] : '');

  const defaultValues = {
    code: initialData.code || '',
    title: initialData.title || '',
    description: initialData.description || '',
    type: initialData.type === 'FIXED_AMOUNT' ? 'FIXED' : initialData.type || 'PERCENTAGE',
    value: initialData.value || '',
    minPurchaseAmount: initialData.minPurchaseAmount || 0,
    validFrom: formatDate(initialData.validFrom),
    validUntil: formatDate(initialData.validUntil),
    maxRedemptions: initialData.maxRedemptions || '',
    perUserLimit: initialData.perUserLimit || 1,
    targeting: {
      type: initialData.targeting?.type || 'ALL',
      geographic: initialData.targeting?.geographic || { cities: [], areas: [], stores: [] },
      purchaseHistory: initialData.targeting?.purchaseHistory || { minPurchases: 0, categories: [], minTotalSpent: 0 },
      users: initialData.targeting?.users || [],
      segments: initialData.targeting?.segments || []
    }
  };

  const { control, handleSubmit, watch, register } = useForm({
    defaultValues
  });

  const targetingType = watch('targeting.type');

  const onSubmit = (data) => {
    // Map type back to API format
    if (data.type === 'FIXED') data.type = 'FIXED_AMOUNT';
    console.log('Payload to API:', data);
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} p={2}>
      <Grid container spacing={3}>
        {/* Coupon Code */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller name="code" control={control} render={({ field }) => <TextField {...field} label="Coupon Code" fullWidth />} />
        </Grid>

        {/* Title */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller name="title" control={control} render={({ field }) => <TextField {...field} label="Title" fullWidth />} />
        </Grid>

        {/* Description */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <TextField {...field} label="Description" fullWidth multiline rows={2} />}
          />
        </Grid>

        {/* Type */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Type" fullWidth>
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                <MenuItem value="FIXED">Fixed Amount</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        {/* Value */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="value"
            control={control}
            render={({ field }) => <TextField {...field} type="number" label="Value" fullWidth />}
          />
        </Grid>

        {/* Min Purchase Amount */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="minPurchaseAmount"
            control={control}
            render={({ field }) => <TextField {...field} type="number" label="Minimum Purchase Amount" fullWidth />}
          />
        </Grid>

        {/* Valid From */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="validFrom"
            control={control}
            render={({ field }) => <TextField {...field} type="date" label="Valid From" fullWidth InputLabelProps={{ shrink: true }} />}
          />
        </Grid>

        {/* Valid Until */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="validUntil"
            control={control}
            render={({ field }) => <TextField {...field} type="date" label="Valid Until" fullWidth InputLabelProps={{ shrink: true }} />}
          />
        </Grid>

        {/* Max Redemptions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="maxRedemptions"
            control={control}
            render={({ field }) => <TextField {...field} type="number" label="Max Redemptions" fullWidth />}
          />
        </Grid>

        {/* Per User Limit */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="perUserLimit"
            control={control}
            render={({ field }) => <TextField {...field} type="number" label="Per User Limit" fullWidth />}
          />
        </Grid>

        {/* Target Audience */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="targeting.type"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Target Audience" fullWidth>
                <MenuItem value="ALL">All Users</MenuItem>
                <MenuItem value="GEOGRAPHIC">City / Area</MenuItem>
                <MenuItem value="PURCHASE_HISTORY">Purchase History</MenuItem>
                <MenuItem value="INDIVIDUAL">Specific Users</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        {/* Conditional Targeting Fields */}
        {targetingType === 'GEOGRAPHIC' && (
          <>
            <Grid size={{ xs: 12 }}>
              <TextField label="Cities" fullWidth placeholder="Enter cities comma separated" {...register('targeting.geographic.cities')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Areas" fullWidth placeholder="Enter areas comma separated" {...register('targeting.geographic.areas')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Stores"
                fullWidth
                placeholder="Enter store names comma separated"
                {...register('targeting.geographic.stores')}
              />
            </Grid>
          </>
        )}

        {targetingType === 'PURCHASE_HISTORY' && (
          <>
            <Grid size={{ xs: 12 }}>
              <TextField label="Minimum Purchases" type="number" fullWidth {...register('targeting.purchaseHistory.minPurchases')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Minimum Total Spent" type="number" fullWidth {...register('targeting.purchaseHistory.minTotalSpent')} />
            </Grid>
          </>
        )}

        {/* Submit Button */}
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {initialData?.code ? 'Update Coupon' : 'Create Coupon'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CouponForm;
