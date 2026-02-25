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
  MenuItem,
  IconButton,
  Button,
  Fade
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import {
  Inventory2TwoTone as ProductIcon,
  AutoAwesomeTwoTone as FeaturedIcon,
  WhatshotTwoTone as BestsellerIcon,
  FiberNewTwoTone as NewIcon,
  LayersTwoTone as StockIcon,
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon,
  AddRounded as AddIcon,
  SearchRounded as SearchIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/features/Products/ProductSlice';
import ProductModal from './ProductModal';

// Custom Toolbar for a Pro look
const CustomToolbar = () => (
  <GridToolbarContainer sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
    <GridToolbarExport />
  </GridToolbarContainer>
);

const AllProducts = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { products = [], isProductLoading, isProductError, message } = useSelector((state) => state.product);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchProducts({ category, search }));
    }, 500); // Debounce search to save API hits
    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, category, search]);

  const rows = useMemo(
    () =>
      products.map((p, index) => ({
        id: p._id,
        sl: index + 1,
        name: p.name || 'Unnamed Product',
        brand: p.brand || 'Generic',
        category: p.category || 'Uncategorized',
        price: p.sellingPrice || 0,
        mrp: p.mrp || 0,
        discount: p.discountPercentage || 0,
        stock: p.overallStock ?? 0,
        isFeatured: !!p.isFeatured,
        isBestSeller: !!p.isBestSeller,
        isNewArrival: !!p.isNewArrival
      })),
    [products]
  );

  const stats = useMemo(
    () => ({
      total: rows.length,
      featured: rows.filter((r) => r.isFeatured).length,
      lowStock: rows.filter((r) => r.stock < 5).length
    }),
    [rows]
  );

  const columns = [
    { field: 'sl', headerName: '#', width: 50, sortable: false },
    {
      field: 'name',
      headerName: 'Product Details',
      flex: 2,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
          <Avatar
            variant="rounded"
            sx={{
              width: 42,
              height: 42,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {params.value.charAt(0)}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={600} noWrap color="text.primary">
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {params.row.brand} • {params.row.category}
            </Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'price',
      headerName: 'Pricing',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={700}>
            ₹{params.value.toLocaleString('en-IN')}
          </Typography>
          {params.row.discount > 0 && (
            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
              ₹{params.row.mrp.toLocaleString('en-IN')}
            </Typography>
          )}
        </Box>
      )
    },
    {
      field: 'stock',
      headerName: 'Inventory',
      flex: 1,
      renderCell: (params) => {
        const isLow = params.value < 5;
        return (
          <Chip
            label={params.value === 0 ? 'Out of Stock' : `${params.value} Units`}
            size="small"
            variant="outlined"
            color={params.value === 0 ? 'error' : isLow ? 'warning' : 'success'}
            sx={{ fontWeight: 600, borderRadius: '6px' }}
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedProduct(params.row);
                setShowModal(true);
              }}
            >
              <EditIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            {/* <IconButton size="small" onClick={() => dispatch(deleteProduct(params.row.id))}> */}
            <IconButton size="small">
              <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.light }} />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pb: 5 }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ py: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
              Inventory Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Managing {stats.total} products across 4 categories
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedProduct(null);
              setShowModal(true);
            }}
            sx={{ borderRadius: '12px', px: 3, py: 1.2, boxShadow: theme.shadows[4] }}
          >
            New Product
          </Button>
        </Stack>

        {/* Stats Row */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <KPICard title="Live Catalog" value={stats.total} icon={<ProductIcon />} color={theme.palette.primary.main} />
          <KPICard title="Featured Items" value={stats.featured} icon={<FeaturedIcon />} color="#ed6c02" />
          <KPICard title="Critical Stock" value={stats.lowStock} icon={<StockIcon />} color="#d32f2f" />
        </Stack>

        {/* Filter Bar */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <Stack direction="row" spacing={2}>
            <TextField
              placeholder="Search by name or SKU..."
              fullWidth
              size="small"
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.disabled' }} /> }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <TextField
              select
              size="small"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="mobile">Mobile Devices</MenuItem>
              <MenuItem value="laptop">Laptops & PC</MenuItem>
              <MenuItem value="accessories">Accessories</MenuItem>
            </TextField>
          </Stack>
        </Paper>

        {/* Data Grid */}
        <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isProductLoading}
            autoHeight
            pageSizeOptions={[10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            slots={{ toolbar: CustomToolbar }}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fafafa', color: 'text.secondary', fontWeight: 700 }
            }}
          />
        </Paper>
      </Container>

      {showModal && <ProductModal product={selectedProduct} onClose={() => setShowModal(false)} />}
    </Box>
  );
};

// Sub-component for KPI
const KPICard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 3,
      flex: 1,
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      background: `linear-gradient(135deg, #fff 0%, ${alpha(color, 0.02)} 100%)`,
      border: `1px solid ${alpha(color, 0.1)}`
    }}
  >
    <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 56, height: 56, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="overline" color="text.secondary" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={800}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

export default AllProducts;
