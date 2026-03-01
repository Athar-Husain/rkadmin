import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  DialogActions,
  Autocomplete
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as XLSX from 'xlsx';

export default function CreateCouponDialog({ open, onClose, onSubmitApi }) {
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      code: '',
      title: '',
      description: '',
      targeting: { type: 'ALL', targetedMobiles: [], users: [] },
      productRules: { type: 'ALL_PRODUCTS', categories: [], brands: [], products: [] },
      status: 'ACTIVE',
      type: 'FIXED_AMOUNT'
    }
  });

  const [fileName, setFileName] = useState('');
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [brandsOptions, setBrandsOptions] = useState([]);
  const [productsOptions, setProductsOptions] = useState([]);
  const productType = watch('productRules.type');
  const targetType = watch('targeting.type');

  // Fetch dynamic options from backend
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('/api/coupons/product-rules-options');
        const data = await res.json();
        if (data.success) {
          setCategoriesOptions(data.categories);
          setBrandsOptions(data.brands);
        }
      } catch (err) {
        console.error('Error fetching coupon options:', err);
      }
    };
    fetchOptions();
  }, []);

  // Optional: fetch products if PRODUCT type is used
  useEffect(() => {
    if (productType === 'PRODUCT') {
      const fetchProducts = async () => {
        try {
          const res = await fetch('/api/products?limit=50'); // adjust limit if needed
          const data = await res.json();
          if (data.success) setProductsOptions(data.products);
        } catch (err) {
          console.error('Error fetching products:', err);
        }
      };
      fetchProducts();
    }
  }, [productType]);

  // Handle Excel upload for individual targeting
  const handleExcel = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const mobiles = data.map((r) => String(r.mobile || r.phone || '')).filter(Boolean);
      setValue('targeting.targetedMobiles', mobiles);
    };
    reader.readAsBinaryString(file);
  };

  // Handle multi-value change for comma-separated input
  const handleCommaChange = (fieldName, value) => {
    const arr =
      typeof value === 'string'
        ? value
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)
        : value;
    setValue(fieldName, arr);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Marketing Campaign</DialogTitle>
      <form onSubmit={handleSubmit(onSubmitApi)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Coupon Info */}
            <Grid item xs={6}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => <TextField {...field} label="Coupon Code" fullWidth required />}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <TextField {...field} label="Campaign Title" fullWidth required />}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <TextField {...field} label="Notification Message" fullWidth multiline rows={2} />}
              />
            </Grid>

            {/* Targeting */}
            <Grid item xs={12}>
              <Divider>
                <Chip label="TARGETING" />
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="targeting.type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Target Type" fullWidth>
                    <MenuItem value="ALL">All Users</MenuItem>
                    <MenuItem value="INDIVIDUAL">Excel Upload (Mobiles)</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            {targetType === 'INDIVIDUAL' && (
              <Grid item xs={12}>
                <Box sx={{ border: '1px dashed grey', p: 2, textAlign: 'center' }}>
                  <Button variant="outlined" component="label">
                    Upload Excel <input type="file" hidden onChange={handleExcel} />
                  </Button>
                  <Typography variant="caption" display="block">
                    {fileName || "Column must be named 'mobile'"}
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Product Rules */}
            <Grid item xs={12}>
              <Divider>
                <Chip label="PRODUCT SCOPE" />
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="productRules.type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Restriction Type" fullWidth>
                    <MenuItem value="ALL_PRODUCTS">Store Wide</MenuItem>
                    <MenuItem value="CATEGORY">By Category</MenuItem>
                    <MenuItem value="BRAND">By Brand</MenuItem>
                    <MenuItem value="PRODUCT">Specific Products</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {productType !== 'ALL_PRODUCTS' && (
              <Grid item xs={12}>
                {productType === 'CATEGORY' && (
                  <Controller
                    name="productRules.categories"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={categoriesOptions}
                        value={field.value}
                        onChange={(e, newValue) => field.onChange(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Categories" />}
                      />
                    )}
                  />
                )}
                {productType === 'BRAND' && (
                  <Controller
                    name="productRules.brands"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={brandsOptions}
                        value={field.value}
                        onChange={(e, newValue) => field.onChange(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Brands" />}
                      />
                    )}
                  />
                )}
                {productType === 'PRODUCT' && (
                  <Controller
                    name="productRules.products"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={productsOptions}
                        getOptionLabel={(option) => option.name}
                        value={field.value}
                        onChange={(e, newValue) => field.onChange(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Products" />}
                      />
                    )}
                  />
                )}
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create Coupon
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
