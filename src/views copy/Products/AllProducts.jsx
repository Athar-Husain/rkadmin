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
  Container,
  TextField,
  MenuItem,
  IconButton,
  Button,
  InputAdornment
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import {
  Inventory2TwoTone as ProductIcon,
  AutoAwesomeTwoTone as FeaturedIcon,
  LayersTwoTone as StockIcon,
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon,
  AddRounded as AddIcon,
  SearchRounded as SearchIcon,
  FilterAltTwoTone as FilterIcon,
  RestartAltRounded as ResetIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategoriesList } from '../../redux/features/Products/ProductSlice';
import ProductModal from './ProductModal';
// import theme from '../../themes';

const CustomToolbar = () => (
  <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
    <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
      PRODUCT INVENTORY
    </Typography>
    <GridToolbarExport />
  </GridToolbarContainer>
);

const AllProducts = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { products = [], categoriesList = [], isProductLoading } = useSelector((state) => state.product);

  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchCategoriesList());
  }, [dispatch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchProducts({ category, search }));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, category, search]);

  const handleResetFilters = () => {
    setCategory('');
    setSearch('');
  };

  const rows = useMemo(
    () =>
      products.map((p, index) => ({
        ...p,
        id: p._id,
        sl: index + 1,
        stock: p.overallStock ?? 0
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
    { field: 'sl', headerName: '#', width: 60 },
    {
      field: 'name',
      headerName: 'Product Info',
      flex: 2,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 800,
              fontSize: '0.875rem'
            }}
          >
            {params.value.charAt(0)}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {params.row.brand} •{' '}
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                {params.row.category}
              </Box>
            </Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'price',
      headerName: 'Pricing',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={800} color="success.main">
            ₹{params.row.sellingPrice?.toLocaleString('en-IN')}
          </Typography>
          {params.row.discountPercentage > 0 && (
            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
              ₹{params.row.mrp?.toLocaleString('en-IN')}
            </Typography>
          )}
        </Box>
      )
    },
    {
      field: 'stock',
      headerName: 'Stock Status',
      width: 150,
      renderCell: (params) => {
        const isLow = params.value < 5 && params.value > 0;
        const isOut = params.value === 0;
        return (
          <Chip
            label={isOut ? 'Out of Stock' : isLow ? `Low: ${params.value}` : `${params.value} In Stock`}
            size="small"
            variant={isOut ? 'filled' : 'outlined'}
            color={isOut ? 'error' : isLow ? 'warning' : 'success'}
            sx={{ fontWeight: 700, borderRadius: '6px', minWidth: '100px' }}
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit Product">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedProduct(params.row);
                setShowModal(true);
              }}
            >
              <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small">
              <DeleteIcon fontSize="small" sx={{ color: 'error.light' }} />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ bgcolor: '#F4F7FA', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} sx={{ color: '#1A2027' }}>
              Catalog Manager
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your store products and inventory levels
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedProduct(null);
              setShowModal(true);
            }}
            sx={{ borderRadius: '12px', px: 3, py: 1, textTransform: 'none', fontWeight: 700 }}
          >
            Add New Product
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <KPICard title="Live Items" value={stats.total} icon={<ProductIcon />} color={theme.palette.primary.main} />
          <KPICard title="Featured" value={stats.featured} icon={<FeaturedIcon />} color="#ed6c02" />
          <KPICard title="Critical Stock" value={stats.lowStock} icon={<StockIcon />} color="#d32f2f" />
        </Stack>

        <Paper sx={{ p: 2, mb: 3, borderRadius: '16px', border: '1px solid #E0E4E8', boxShadow: 'none' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search by name, brand, or SKU..."
              fullWidth
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.disabled' }} />,
                sx: { borderRadius: '10px' }
              }}
            />
            <TextField
              select
              size="small"
              label="Category Filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              InputProps={{ startAdornment: <FilterIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 18 }} /> }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categoriesList.map((item) => (
                <MenuItem key={item.category} value={item.category}>
                  {item.category.replace(/-/g, ' ').toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
            <IconButton onClick={handleResetFilters} color="primary" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <ResetIcon />
            </IconButton>
          </Stack>
        </Paper>

        <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E0E4E8', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isProductLoading}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            slots={{ toolbar: CustomToolbar }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', borderBottom: '1px solid #E0E4E8' },
              '& .MuiDataGrid-cell': { borderBottom: '1px solid #F1F5F9' }
            }}
          />
        </Paper>
      </Container>
      {showModal && <ProductModal product={selectedProduct} onClose={() => setShowModal(false)} />}
    </Box>
  );
};

const KPICard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2.5,
      flex: 1,
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      border: '1px solid',
      borderColor: alpha(color, 0.2),
      bgcolor: '#fff'
    }}
  >
    <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 48, height: 48, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={900}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

export default AllProducts;
