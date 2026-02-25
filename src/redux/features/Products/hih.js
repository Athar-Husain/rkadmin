src/pages/admin/products/AllProducts.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  alpha,
  useTheme,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Container,
  TextField,
  MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Inventory2Rounded as ProductIcon,
  StarRounded as FeaturedIcon,
  LocalFireDepartmentRounded as BestsellerIcon,
  NewReleasesRounded as NewIcon,
  InventoryRounded as StockIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../redux/features/Product/ProductSlice';

const AllProducts = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { products = [], isProductLoading, isProductError, message } =
    useSelector((state) => state.product);

  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ category, search }));
  }, [dispatch, category, search]);

  // ===============================
  // Data Transformation
  // ===============================
  const rows = useMemo(
    () =>
      products.map((p, index) => ({
        id: p._id,
        sl: index + 1,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.sellingPrice,
        discount: p.discountPercentage,
        stock: p.overallStock,
        isFeatured: p.isFeatured,
        isBestSeller: p.isBestSeller,
        isNewArrival: p.isNewArrival,
        status: p.overallStock > 0 ? 'In Stock' : 'Out of Stock'
      })),
    [products]
  );

  // ===============================
  // KPI Calculations
  // ===============================
  const totalProducts = rows.length;
  const featuredProducts = rows.filter((r) => r.isFeatured).length;
  const outOfStock = rows.filter((r) => r.stock === 0).length;

  // ===============================
  // Columns
  // ===============================
  const columns = [
    { field: 'sl', headerName: 'SL', width: 60 },
    {
      field: 'name',
      headerName: 'PRODUCT',
      flex: 1.6,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 700
            }}
          >
            {params.value.charAt(0)}
          </Avatar>
          <Box>
            <Typography fontWeight={700}>{params.value}</Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.brand}
            </Typography>
          </Box>
        </Stack>
      )
    },
    { field: 'category', headerName: 'CATEGORY', flex: 1 },
    {
      field: 'price',
      headerName: 'PRICE',
      flex: 0.8,
      renderCell: (params) => `₹${params.value.toLocaleString('en-IN')}`
    },
    {
      field: 'discount',
      headerName: 'DISCOUNT',
      flex: 0.7,
      renderCell: (params) =>
        params.value ? `${params.value}%` : '—'
    },
    {
      field: 'stock',
      headerName: 'STOCK',
      flex: 0.6,
      renderCell: (params) => (
        <Chip
          icon={<StockIcon />}
          label={params.value}
          size="small"
          color={params.value > 0 ? 'success' : 'error'}
        />
      )
    },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha(
              params.value === 'In Stock' ? '#01B574' : '#FF4D4F',
              0.1
            ),
            color:
              params.value === 'In Stock' ? '#01B574' : '#FF4D4F',
            fontWeight: 700
          }}
        />
      )
    },
    {
      field: 'badges',
      headerName: 'TAGS',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {params.row.isFeatured && (
            <Tooltip title="Featured">
              <FeaturedIcon color="warning" />
            </Tooltip>
          )}
          {params.row.isBestSeller && (
            <Tooltip title="Best Seller">
              <BestsellerIcon color="error" />
            </Tooltip>
          )}
          {params.row.isNewArrival && (
            <Tooltip title="New Arrival">
              <NewIcon color="success" />
            </Tooltip>
          )}
        </Stack>
      )
    }
  ];

  // ===============================
  // KPI Card
  // ===============================
  const KPICard = ({ title, value, icon, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #F4F7FE'
      }}
    >
      <Avatar sx={{ bgcolor: alpha(color, 0.1), color, mr: 2 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="caption" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={800}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ bgcolor: '#F4F7FE', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Product Management
              </Typography>
              <Typography color="text.secondary">
                Monitor and manage your catalog
              </Typography>
            </Box>
          </Stack>

          {/* Filters */}
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <TextField
              select
              size="small"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="MOBILE">Mobile</MenuItem>
              <MenuItem value="LAPTOP">Laptop</MenuItem>
              <MenuItem value="ACCESSORIES">Accessories</MenuItem>
            </TextField>
          </Stack>

          {/* KPI */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <KPICard title="Total Products" value={totalProducts} icon={<ProductIcon />} color="#4318FF" />
            <KPICard title="Featured" value={featuredProducts} icon={<FeaturedIcon />} color="#FFB547" />
            <KPICard title="Out of Stock" value={outOfStock} icon={<StockIcon />} color="#FF4D4F" />
          </Stack>

          {/* Table */}
          <Paper sx={{ borderRadius: '20px', p: 2 }}>
            {isProductLoading ? (
              <Box textAlign="center" p={6}>
                <CircularProgress />
              </Box>
            ) : isProductError ? (
              <Alert severity="error">{message}</Alert>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                rowHeight={72}
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': {
                    borderBottom: '1px solid #F4F7FE'
                  }
                }}
              />
            )}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default AllProducts;
