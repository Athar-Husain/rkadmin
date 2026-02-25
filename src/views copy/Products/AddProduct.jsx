import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  InputAdornment
} from '@mui/material';
import { AddPhotoAlternateRounded } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../redux/features/Products/ProductSlice';
// import { createProduct } from '@/redux/features/product/ProductSlice';

const defaultValues = {
  sku: '',
  name: '',
  category: '',
  subcategory: '',
  brand: '',
  model: '',
  description: '',
  mrp: '',
  sellingPrice: '',
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: false,
  images: []
};

const AddProduct = () => {
  const dispatch = useDispatch();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({ defaultValues });

  const images = watch('images');

  const onSubmit = (data) => {
    const payload = {
      ...data,
      mrp: Number(data.mrp),
      sellingPrice: Number(data.sellingPrice)
    };

    // console.log('CREATE PRODUCT PAYLOAD:', payload);
    dispatch(addProduct(payload));
  };

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);

    const mappedImages = files.map((file, index) => ({
      url: URL.createObjectURL(file),
      alt: file.name,
      isPrimary: index === 0
    }));

    setValue('images', [...images, ...mappedImages]);
  };

  return (
    <Box sx={{ bgcolor: '#F4F7FE', minHeight: '100vh', p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1100,
          mx: 'auto',
          p: 4,
          borderRadius: '24px'
        }}
      >
        <Typography variant="h4" fontWeight={800} color="#1B2559">
          Add New Product
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Enter product details carefully before publishing
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* BASIC INFO */}
          <Typography fontWeight={800} mb={2}>
            Basic Information
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="SKU" fullWidth {...register('sku')} error={!!errors.sku} helperText={errors.sku?.message} />
            </Grid>

            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Product Name"
                fullWidth
                {...register('name', { required: 'Product name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Category"
                fullWidth
                {...register('category', { required: 'Category is required' })}
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Subcategory" fullWidth {...register('subcategory')} />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Brand"
                fullWidth
                {...register('brand', { required: 'Brand is required' })}
                error={!!errors.brand}
                helperText={errors.brand?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Model"
                fullWidth
                {...register('model', { required: 'Model is required' })}
                error={!!errors.model}
                helperText={errors.model?.message}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* PRICING */}
          <Typography fontWeight={800} mb={2}>
            Pricing
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="MRP"
                type="number"
                fullWidth
                {...register('mrp', { required: 'MRP is required', min: 0 })}
                error={!!errors.mrp}
                helperText={errors.mrp?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Selling Price"
                type="number"
                fullWidth
                {...register('sellingPrice', { required: 'Selling price is required', min: 0 })}
                error={!!errors.sellingPrice}
                helperText={errors.sellingPrice?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* DESCRIPTION */}
          <Typography fontWeight={800} mb={2}>
            Description
          </Typography>

          <TextField multiline minRows={4} fullWidth placeholder="Product description..." {...register('description')} />

          <Divider sx={{ my: 4 }} />

          {/* FLAGS */}
          <Typography fontWeight={800} mb={2}>
            Product Tags
          </Typography>

          <Stack direction="row" spacing={3}>
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Featured" />}
            />

            <Controller
              name="isBestSeller"
              control={control}
              render={({ field }) => <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Best Seller" />}
            />

            <Controller
              name="isNewArrival"
              control={control}
              render={({ field }) => <FormControlLabel control={<Switch {...field} checked={field.value} />} label="New Arrival" />}
            />
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* IMAGES */}
          <Typography fontWeight={800} mb={2}>
            Product Images
          </Typography>

          <Button variant="outlined" startIcon={<AddPhotoAlternateRounded />} component="label">
            Upload Images
            <input hidden multiple type="file" accept="image/*" onChange={handleImageAdd} />
          </Button>

          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {images.map((img, index) => (
              <Chip key={index} label={img.alt} color={img.isPrimary ? 'primary' : 'default'} />
            ))}
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* ACTIONS */}
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#4318FF', fontWeight: 700 }}>
              Create Product
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AddProduct;
