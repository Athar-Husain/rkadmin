// src/components/products/ProductModal.jsx
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  Grid,
  InputAdornment,
  Typography,
  Divider,
  IconButton,
  Box,
  MenuItem
} from '@mui/material';
import {
  CloseRounded as CloseIcon,
  LocalOfferRounded as TagIcon,
  InventoryRounded as StockIcon,
  InfoRounded as InfoIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct } from '../../redux/features/Products/ProductSlice';

const ProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(product);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      model: '', // Added: Required by Backend
      sku: '', // Added: Required by Backend
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      overallStock: 0,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      description: ''
    }
  });

  const watchedMRP = watch('mrp');
  const watchedPrice = watch('sellingPrice');

  // Auto-calculate discount percentage
  useEffect(() => {
    if (watchedMRP > 0 && watchedPrice > 0) {
      const discount = ((watchedMRP - watchedPrice) / watchedMRP) * 100;
      setValue('discountPercentage', Math.round(discount > 0 ? discount : 0));
    }
  }, [watchedMRP, watchedPrice, setValue]);

  useEffect(() => {
    if (isEdit && product) {
      reset({ ...product });
    }
  }, [product, isEdit, reset]);

  const onSubmit = (data) => {
    // Sanitize payload for backend requirements
    const payload = {
      ...data,
      sku: data.sku.toUpperCase(),
      category: data.category.toLowerCase(), // Schema expects lowercase per your definition
      mrp: Number(data.mrp),
      sellingPrice: Number(data.sellingPrice),
      overallStock: Number(data.overallStock)
    };

    if (isEdit) {
      dispatch(updateProduct({ id: product._id, data: payload }));
    } else {
      dispatch(addProduct(payload));
    }
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={800}>
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Left Column: Core Details */}
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" /> Essential Details
                </Typography>

                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Product name is required' }}
                  render={({ field }) => (
                    <TextField {...field} label="Product Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                  )}
                />

                <Stack direction="row" spacing={2}>
                  <Controller
                    name="brand"
                    control={control}
                    rules={{ required: 'Brand is required' }}
                    render={({ field }) => <TextField {...field} label="Brand" fullWidth error={!!errors.brand} />}
                  />
                  <Controller
                    name="model"
                    control={control}
                    rules={{ required: 'Model is required' }}
                    render={({ field }) => <TextField {...field} label="Model" fullWidth error={!!errors.model} />}
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Controller
                    name="sku"
                    control={control}
                    rules={{ required: 'SKU is required' }}
                    render={({ field }) => (
                      <TextField {...field} label="SKU Code" fullWidth error={!!errors.sku} helperText="Unique identifier" />
                    )}
                  />
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <TextField {...field} label="Category" select fullWidth error={!!errors.category}>
                        <MenuItem value="mobile">Mobile</MenuItem>
                        <MenuItem value="laptop">Laptop</MenuItem>
                        <MenuItem value="accessories">Accessories</MenuItem>
                      </TextField>
                    )}
                  />
                </Stack>

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Description" multiline rows={3} fullWidth />}
                />
              </Stack>
            </Grid>

            {/* Right Column: Pricing & Stock */}
            <Grid item xs={12} md={5}>
              <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Stack spacing={3}>
                  <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TagIcon fontSize="small" /> Pricing & Inventory
                  </Typography>

                  <Controller
                    name="mrp"
                    control={control}
                    rules={{ required: 'MRP is required', min: 0 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="MRP"
                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="sellingPrice"
                    control={control}
                    rules={{
                      required: 'Selling Price is required',
                      validate: (value) => Number(value) <= Number(watchedMRP) || 'Cannot exceed MRP'
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Selling Price"
                        error={!!errors.sellingPrice}
                        helperText={errors.sellingPrice?.message}
                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="overallStock"
                    control={control}
                    render={({ field }) => <TextField {...field} type="number" label="Initial Stock" fullWidth />}
                  />

                  <Divider />

                  <Box>
                    <FormControlLabel
                      control={
                        <Controller
                          name="isFeatured"
                          control={control}
                          render={({ field }) => <Switch {...field} checked={field.value} color="primary" />}
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={600}>
                          Featured
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Controller
                          name="isBestSeller"
                          control={control}
                          render={({ field }) => <Switch {...field} checked={field.value} color="error" />}
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={600}>
                          Best Seller
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Controller
                          name="isNewArrival"
                          control={control}
                          render={({ field }) => <Switch {...field} checked={field.value} color="success" />}
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={600}>
                          New Arrival
                        </Typography>
                      }
                    />
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: '#fafafa' }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={!isDirty} sx={{ borderRadius: '12px', px: 4, fontWeight: 700 }}>
            {isEdit ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductModal;
