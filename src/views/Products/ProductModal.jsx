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
  Paper,
  useTheme,
  Divider
} from '@mui/material';
import {
  CloseRounded as CloseIcon,
  AddPhotoAlternateTwoTone as AddImageIcon,
  DeleteOutlineRounded as RemoveImageIcon,
  Inventory2TwoTone as SkuIcon,
  BusinessTwoTone as BrandIcon,
  AutoFixHighTwoTone as EditIcon
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
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      subcategory: '',
      sku: '',
      model: '',
      mrp: 0,
      sellingPrice: 0,
      overallStock: 0,
      description: '',
      images: [''], // We will handle conversion from Object to String here
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      isActive: true
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'images' });
  const watchedImages = watch('images');
  const watchedCategory = watch('category');

  // Sync Product Data to Form
  useEffect(() => {
    if (isEdit && product) {
      reset({
        ...product,
        // Extract URLs from the image objects array for the form fields
        images: product.images?.length > 0 ? product.images.map((img) => (typeof img === 'string' ? img : img.url)) : [''],
        mrp: product.mrp || 0,
        sellingPrice: product.sellingPrice || 0
      });
    }
  }, [product, isEdit, reset]);

  const onSubmit = (data) => {
    // Transform string URLs back into the Object format expected by your Backend/JSON
    const formattedImages = data.images
      .filter((url) => url && url.trim() !== '')
      .map((url, index) => ({
        url: url,
        alt: data.name,
        isPrimary: index === 0
      }));

    const payload = {
      ...data,
      images: formattedImages,
      sku: data.sku.toUpperCase(),
      mrp: Number(data.mrp),
      sellingPrice: Number(data.sellingPrice),
      overallStock: Number(data.overallStock),
      slug: isEdit ? product.slug : formatSlug(`${data.brand}-${data.model}-${data.sku}`)
    };

    if (isEdit) {
      dispatch(updateProduct({ id: product._id || product.id, data: payload }));
    } else {
      dispatch(addProduct(payload));
    }
    onClose();
  };

  const subcategorySuggestions = React.useMemo(() => {
    const match = categoriesList?.find((c) => c.category === watchedCategory);
    return match ? match.subcategories : [];
  }, [watchedCategory, categoriesList]);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px', boxShadow: theme.shadows[10] } }}>
      <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#F8FAFC' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ bgcolor: isEdit ? 'warning.main' : 'primary.main', color: '#fff', p: 1, borderRadius: '10px', display: 'flex' }}>
            {isEdit ? <EditIcon fontSize="small" /> : <AddImageIcon fontSize="small" />}
          </Box>
          <Typography variant="h6" fontWeight={800}>
            {isEdit ? `Edit: ${product.name}` : 'Create New Product'}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ border: '1px solid #E2E8F0' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {/* 1. MEDIA PREVIEW & INPUTS */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight={700}
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                Product Gallery
              </Typography>
              <Grid container spacing={2}>
                {fields.map((item, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                    <Stack direction="row" spacing={1}>
                      <Controller
                        name={`images.${index}`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label={index === 0 ? 'Primary Image URL' : `Gallery Image ${index + 1}`}
                            placeholder="https://..."
                          />
                        )}
                      />
                      {fields.length > 1 && (
                        <IconButton color="error" onClick={() => remove(index)}>
                          <RemoveImageIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Grid>
                ))}
                <Grid size={{ xs: 12 }}>
                  <Button size="small" variant="outlined" startIcon={<AddImageIcon />} onClick={() => append('')}>
                    Add Image URL
                  </Button>
                </Grid>
              </Grid>

              {/* Live Preview Thumbnails */}
              <Stack direction="row" spacing={2} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
                {watchedImages?.map(
                  (url, i) =>
                    url && (
                      <Paper
                        key={i}
                        variant="outlined"
                        sx={{ width: 60, height: 60, borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}
                      >
                        <Box component="img" src={url} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Paper>
                    )
                )}
              </Stack>
            </Grid>

            {/* 2. CORE DETAILS */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField {...field} label="Product Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                  )}
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
                        InputProps={{ startAdornment: <BrandIcon sx={{ mr: 1, opacity: 0.5 }} /> }}
                      />
                    )}
                  />
                  <Controller
                    name="sku"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="SKU"
                        fullWidth
                        InputProps={{ startAdornment: <SkuIcon sx={{ mr: 1, opacity: 0.5 }} /> }}
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
                        options={categoriesList?.map((c) => c.category) || []}
                        value={field.value}
                        onChange={(_, v) => field.onChange(v)}
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
                        onChange={(_, v) => field.onChange(v)}
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

            {/* 3. PRICING & STATUS */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: '15px', bgcolor: '#F8FAFC' }}>
                <Stack spacing={2}>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">
                    PRICING & STOCK
                  </Typography>
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
                    render={({ field }) => <TextField {...field} label="Total Stock" type="number" fullWidth />}
                  />

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="caption" fontWeight={800} color="text.secondary">
                    VISIBILITY
                  </Typography>
                  <FormControlLabel
                    control={
                      <Controller
                        name="isFeatured"
                        control={control}
                        render={({ field }) => <Switch {...field} checked={field.value} size="small" />}
                      />
                    }
                    label="Featured"
                  />
                  <FormControlLabel
                    control={
                      <Controller
                        name="isNewArrival"
                        control={control}
                        render={({ field }) => <Switch {...field} checked={field.value} color="success" size="small" />}
                      />
                    }
                    label="New Arrival"
                  />
                  <FormControlLabel
                    control={
                      <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => <Switch {...field} checked={field.value} color="primary" size="small" />}
                      />
                    }
                    label="Active Status"
                  />
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700 }}>
            Discard
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={isEdit ? 'warning' : 'primary'}
            sx={{ px: 4, py: 1, borderRadius: '10px', fontWeight: 800 }}
          >
            {isEdit ? 'Save Changes' : 'Publish Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductModal;
