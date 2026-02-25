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
import { fetchProducts } from '../../redux/features/Products/ProductSlice';
// import { fetchProducts } from '../../redux/features/Products/ProductSlice';

const AllProducts = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { products = [], isProductLoading, isProductError, message } = useSelector((state) => state.product);

  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ category, search }));
  }, [dispatch, category, search]);

  // ===============================
  // Data Transformation (Schema-safe)
  // ===============================
  const rows = useMemo(
    () =>
      products.map((p, index) => {
        const stock = Number(p.overallStock) || 0;

        return {
          id: p._id,
          sl: index + 1,
          name: p.name || 'Unnamed Product',
          brand: p.brand || '—',
          category: p.category || '—',
          price: Number(p.sellingPrice) || 0,
          discount: Number(p.discountPercentage) || 0,
          stock,
          isFeatured: Boolean(p.isFeatured),
          isBestSeller: Boolean(p.isBestSeller),
          isNewArrival: Boolean(p.isNewArrival),
          status: stock > 0 ? 'In Stock' : 'Out of Stock'
        };
      }),
    [products]
  );

  // ===============================
  // KPI Calculations
  // ===============================
  const totalProducts = rows.length;
  const featuredProducts = rows.filter((r) => r.isFeatured).length;
  const outOfStock = rows.filter((r) => r.stock === 0).length;

  // ===============================
  // Columns (Schema-aligned)
  // ===============================
  const columns = [
    {
      field: 'sl',
      headerName: 'SL',
      width: 60,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'name',
      headerName: 'PRODUCT',
      flex: 1.6,
      renderCell: (params) => {
        const name = params.value || 'Unnamed';

        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 700
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography fontWeight={700} color="#1B2559">
                {name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {params.row.brand}
              </Typography>
            </Box>
          </Stack>
        );
      }
    },
    {
      field: 'category',
      headerName: 'CATEGORY',
      flex: 1,
      valueFormatter: ({ value }) => value || '—'
    },
    {
      field: 'price',
      headerName: 'PRICE',
      flex: 0.8,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (params.value > 0 ? `₹${params.value.toLocaleString('en-IN')}` : '—')
    },
    {
      field: 'discount',
      headerName: 'DISCOUNT',
      flex: 0.7,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (params.value > 0 ? `${params.value}%` : '—')
    },
    {
      field: 'stock',
      headerName: 'STOCK',
      flex: 0.6,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          icon={<StockIcon />}
          label={params.value}
          size="small"
          color={params.value > 0 ? 'success' : 'error'}
          sx={{ fontWeight: 700 }}
        />
      )
    },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 0.8,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const isInStock = params.value === 'In Stock';

        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              bgcolor: alpha(isInStock ? '#01B574' : '#FF4D4F', 0.1),
              color: isInStock ? '#01B574' : '#FF4D4F',
              fontWeight: 800,
              textTransform: 'uppercase',
              fontSize: '11px'
            }}
          />
        );
      }
    },
    {
      field: 'badges',
      headerName: 'TAGS',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {params.row.isFeatured && (
            <Tooltip title="Featured Product">
              <FeaturedIcon color="warning" fontSize="small" />
            </Tooltip>
          )}
          {params.row.isBestSeller && (
            <Tooltip title="Best Seller">
              <BestsellerIcon color="error" fontSize="small" />
            </Tooltip>
          )}
          {params.row.isNewArrival && (
            <Tooltip title="New Arrival">
              <NewIcon color="success" fontSize="small" />
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
      <Avatar sx={{ bgcolor: alpha(color, 0.1), color, mr: 2 }}>{icon}</Avatar>
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
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Product Management
            </Typography>
            <Typography color="text.secondary">Monitor and manage your catalog</Typography>
          </Box>

          {/* Filters */}
          <Stack direction="row" spacing={2}>
            <TextField size="small" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <TextField
              select
              size="small"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All</MenuItem>
              {/* backend-driven categories can be plugged here later */}
              <MenuItem value="mobile">Mobile</MenuItem>
              <MenuItem value="laptop">Laptop</MenuItem>
              <MenuItem value="accessories">Accessories</MenuItem>
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
