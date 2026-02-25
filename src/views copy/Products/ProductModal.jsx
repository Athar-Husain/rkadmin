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
  Divider,
  IconButton,
  Box,
  Autocomplete,
  InputAdornment,
  alpha,
  useTheme
} from '@mui/material';
import {
  CloseRounded as CloseIcon,
  InfoRounded as InfoIcon,
  LocalOfferTwoTone as PriceIcon,
  CategoryTwoTone as CatIcon,
  DescriptionTwoTone as DescIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct } from '../../redux/features/Products/ProductSlice';

// Helper: formats string to "mob-dhi" format
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
      model: '',
      sku: '',
      mrp: 0,
      sellingPrice: 0,
      overallStock: 0,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      description: ''
    }
  });

  const watchedCategory = watch('category');
  const watchedMRP = watch('mrp');
  const watchedPrice = watch('sellingPrice');

  useEffect(() => {
    if (isEdit && product) reset({ ...product });
  }, [product, isEdit, reset]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      sku: data.sku.toUpperCase(),
      category: formatSlug(data.category),
      subcategory: formatSlug(data.subcategory),
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

  // Extract relevant subcategories for the dropdown
  const subcategorySuggestions = React.useMemo(() => {
    const match = categoriesList.find((c) => c.category === watchedCategory);
    return match ? match.subcategories : [];
  }, [watchedCategory, categoriesList]);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
      <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#F8FAFC' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ bgcolor: 'primary.main', color: '#fff', p: 1, borderRadius: '10px', display: 'flex' }}>
            <CatIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight={800}>
            {isEdit ? 'Update Product' : 'Create New Product'}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} sx={{ bgcolor: '#fff' }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Left Column: Essential Details */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={3}>
                <Typography variant="overline" color="primary" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  General Information
                </Typography>

                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Product name is required' }}
                  render={({ field }) => (
                    <TextField {...field} label="Display Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                  )}
                />

                <Stack direction="row" spacing={2}>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <Autocomplete
                        fullWidth
                        freeSolo
                        options={categoriesList.map((c) => c.category)}
                        value={field.value}
                        onInputChange={(e, val) => field.onChange(formatSlug(val))}
                        onChange={(e, val) => field.onChange(formatSlug(val))}
                        renderInput={(params) => (
                          <TextField {...params} label="Category" error={!!errors.category} placeholder="e.g. mobile-phones" />
                        )}
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
                        onInputChange={(e, val) => field.onChange(formatSlug(val))}
                        onChange={(e, val) => field.onChange(formatSlug(val))}
                        renderInput={(params) => <TextField {...params} label="Sub-Category" placeholder="e.g. android" />}
                      />
                    )}
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Brand" sx={{ flex: 1 }} />}
                  />
                  <Controller
                    name="sku"
                    control={control}
                    render={({ field }) => <TextField {...field} label="SKU / Model" sx={{ flex: 1 }} />}
                  />
                </Stack>

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Product Description"
                      multiline
                      rows={4}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mt: -5 }}>
                            <DescIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Stack>
            </Grid>

            {/* Right Column: Inventory & Status */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    borderRadius: '20px',
                    border: '1px dashed',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="overline" color="text.secondary" fontWeight={800} sx={{ mb: 2, display: 'block' }}>
                    Pricing & Stock
                  </Typography>

                  <Stack spacing={2.5}>
                    <Controller
                      name="mrp"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="MRP"
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
                          type="number"
                          label="Selling Price"
                          fullWidth
                          error={Number(watchedPrice) > Number(watchedMRP)}
                          helperText={Number(watchedPrice) > Number(watchedMRP) ? 'Price exceeds MRP' : ''}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                        />
                      )}
                    />
                    <Controller
                      name="overallStock"
                      control={control}
                      render={({ field }) => <TextField {...field} type="number" label="Initial Stock Level" fullWidth />}
                    />
                  </Stack>
                </Box>

                <Box sx={{ px: 2 }}>
                  <Typography variant="overline" color="text.secondary" fontWeight={800} sx={{ mb: 1, display: 'block' }}>
                    Visibility Tags
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
                      label={<Typography variant="body2">Featured Product</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Controller
                          name="isBestSeller"
                          control={control}
                          render={({ field }) => <Switch {...field} checked={field.value} color="error" />}
                        />
                      }
                      label={<Typography variant="body2">Best Seller</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Controller
                          name="isNewArrival"
                          control={control}
                          render={({ field }) => <Switch {...field} checked={field.value} color="success" />}
                        />
                      }
                      label={<Typography variant="body2">New Arrival</Typography>}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: '#F8FAFC', borderTop: '1px solid #E0E4E8' }}>
          <Button onClick={onClose} variant="text" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Discard
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isDirty}
            sx={{ px: 4, py: 1, borderRadius: '12px', fontWeight: 800, textTransform: 'none', boxShadow: theme.shadows[4] }}
          >
            {isEdit ? 'Save Changes' : 'Confirm & Publish'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductModal;
