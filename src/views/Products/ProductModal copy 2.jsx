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
  Typography,
  IconButton,
  Box,
  Autocomplete,
  InputAdornment,
  alpha,
  useTheme,
  Paper
} from '@mui/material';
import {
  CloseRounded as CloseIcon,
  AddPhotoAlternateTwoTone as AddImageIcon,
  DeleteOutlineRounded as RemoveImageIcon,
  Inventory2TwoTone as SkuIcon,
  BusinessTwoTone as BrandIcon
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct } from '../../redux/features/Products/ProductSlice';

const formatSlug = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

const ProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { categoriesList } = useSelector((state) => state.product);
  const isEdit = Boolean(product);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      subcategory: '',
      sku: '',
      mrp: 0,
      sellingPrice: 0,
      overallStock: 0,
      description: '',
      images: [''],
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'images' });
  const watchedImages = watch('images');
  const watchedCategory = watch('category');

  useEffect(() => {
    if (isEdit && product) {
      reset({
        ...product,
        images: product.images?.length > 0 ? product.images : ['']
      });
    }
  }, [product, isEdit, reset]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      images: data.images.filter((img) => img.trim() !== ''),
      sku: data.sku.toUpperCase(),
      mrp: Number(data.mrp),
      sellingPrice: Number(data.sellingPrice),
      overallStock: Number(data.overallStock)
    };


    if (isEdit) {
      dispatch(updateProduct({ id: product._id, data: payload }));
    } else {
      console.log("payload", payload)
      dispatch(addProduct(payload));
    }
    onClose();
  };

  const subcategorySuggestions = React.useMemo(() => {
    const match = categoriesList.find((c) => c.category === watchedCategory);
    return match ? match.subcategories : [];
  }, [watchedCategory, categoriesList]);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
      <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#F8FAFC' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ bgcolor: 'primary.main', color: '#fff', p: 1, borderRadius: '12px', display: 'flex' }}>
            <AddImageIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight={800}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} sx={{ bgcolor: '#fff', border: '1px solid #E2E8F0' }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* MEDIA SECTION */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="overline" color="primary" fontWeight={800} sx={{ mb: 2, display: 'block' }}>
                Product Media (URLs)
              </Typography>
              <Grid container spacing={2}>
                {fields.map((item, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Controller
                        name={`images.${index}`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            placeholder="https://image-url.com"
                            label={index === 0 ? 'Main Image' : `Image ${index + 1}`}
                          />
                        )}
                      />
                      {fields.length > 1 && (
                        <IconButton size="small" color="error" onClick={() => remove(index)}>
                          <RemoveImageIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Grid>
                ))}
                <Grid size={{ xs: 12 }}>
                  <Button startIcon={<AddImageIcon />} size="small" onClick={() => append('')} sx={{ fontWeight: 700 }}>
                    Add Another Image
                  </Button>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} sx={{ mt: 2, overflowX: 'auto', py: 1 }}>
                {watchedImages?.map(
                  (url, i) =>
                    url && (
                      <Paper
                        key={i}
                        variant="outlined"
                        sx={{ width: 80, height: 80, flexShrink: 0, borderRadius: '12px', overflow: 'hidden', bgcolor: '#F1F5F9' }}
                      >
                        <Box component="img" src={url} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Paper>
                    )
                )}
              </Stack>
            </Grid>

            {/* GENERAL & BRAND INFO */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2.5}>
                <Typography variant="overline" color="primary" fontWeight={800}>
                  General Info
                </Typography>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <TextField {...field} label="Product Name" fullWidth error={!!errors.name} />}
                />

                <Stack direction="row" spacing={2}>
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Brand"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BrandIcon sx={{ fontSize: 18 }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="sku"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="SKU / Model"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SkuIcon sx={{ fontSize: 18 }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="model"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Model"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SkuIcon sx={{ fontSize: 18 }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        fullWidth
                        options={categoriesList.map((c) => c.category)}
                        value={field.value}
                        onInputChange={(e, v) => field.onChange(formatSlug(v))}
                        renderInput={(params) => <TextField {...params} label="Category" />}
                      />
                    )}
                  />
                  <Controller
                    name="subcategory"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        fullWidth
                        freeSolo
                        options={subcategorySuggestions}
                        value={field.value}
                        onInputChange={(e, v) => field.onChange(formatSlug(v))}
                        renderInput={(params) => <TextField {...params} label="Sub-Category" />}
                      />
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

            {/* INVENTORY & VISIBILITY */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={2.5}>
                <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <Typography variant="overline" color="text.secondary" fontWeight={800} sx={{ mb: 2, display: 'block' }}>
                    Inventory & Pricing
                  </Typography>
                  <Stack spacing={2}>
                    <Controller
                      name="mrp"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="MRP"
                          type="number"
                          fullWidth
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                        />
                      )}
                    />
                    <Controller
                      name="sellingPrice"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Selling Price"
                          type="number"
                          fullWidth
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                        />
                      )}
                    />
                    <Controller
                      name="overallStock"
                      control={control}
                      render={({ field }) => <TextField {...field} label="Stock Quantity" type="number" fullWidth />}
                    />
                  </Stack>
                </Box>

                <Box sx={{ px: 1 }}>
                  <Typography variant="overline" color="text.secondary" fontWeight={800} sx={{ mb: 1, display: 'block' }}>
                    Store Visibility
                  </Typography>
                  <Stack>
                    <FormControlLabel
                      control={
                        <Controller
                          name="isFeatured"
                          control={control}
                          render={({ field }) => <Switch {...field} checked={field.value} />}
                        />
                      }
                      label="Featured Product"
                    />
                    <FormControlLabel
                      control={
                        <Controller
                          name="isBestSeller"
                          control={control}
                          render={({ field }) => <Switch {...field} checked={field.value} color="warning" />}
                        />
                      }
                      label="Best Seller"
                    />
                    <FormControlLabel
                      control={
                        <Controller
                          name="isNewArrival"
                          control={control}
                          render={({ field }) => <Switch {...field} checked={field.value} color="success" />}
                        />
                      }
                      label="New Arrival"
                    />
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ px: 4, borderRadius: '10px', fontWeight: 800 }}>
            {isEdit ? 'Update Product' : 'Publish Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductModal;
