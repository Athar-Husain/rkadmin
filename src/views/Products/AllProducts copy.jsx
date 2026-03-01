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
  Button
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
  RestartAltRounded as ResetIcon,
  ImageNotSupportedTwoTone as NoImageIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategoriesList } from '../../redux/features/Products/ProductSlice';
import ProductModal from './ProductModal';

const CustomToolbar = () => (
  <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
    <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
      PRODUCT INVENTORY
    </Typography>
    <GridToolbarExport sx={{ borderRadius: '8px', fontWeight: 700 }} />
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
        stock: p.overallStock ?? 0,
        displayImage: p.images?.[0] || ''
      })),
    [products]
  );

  const stats = useMemo(
    () => ({
      total: rows.length,
      featured: rows.filter((r) => r.isFeatured).length,
      lowStock: rows.filter((r) => r.stock < 5 && r.stock > 0).length
    }),
    [rows]
  );

  const columns = [
    { field: 'sl', headerName: '#', width: 60, align: 'center' },
    {
      field: 'displayImage',
      headerName: 'Img',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          variant="rounded"
          sx={{ width: 44, height: 44, bgcolor: '#f0f4f8', border: '1px solid #e2e8f0', mt: 1.5 }}
        >
          <NoImageIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
        </Avatar>
      )
    },
    {
      field: 'name',
      headerName: 'Product Details',
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={700} noWrap sx={{ color: '#1A2027' }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {params.row.brand} • <span style={{ color: theme.palette.primary.main }}>{params.row.category}</span>
          </Typography>
        </Box>
      )
    },
    {
      field: 'price',
      headerName: 'Pricing',
      width: 140,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={800} color="success.main">
            ₹{params.row.sellingPrice?.toLocaleString('en-IN')}
          </Typography>
          {params.row.mrp > params.row.sellingPrice && (
            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
              ₹{params.row.mrp?.toLocaleString('en-IN')}
            </Typography>
          )}
        </Box>
      )
    },
    {
      field: 'stock',
      headerName: 'Inventory',
      width: 150,
      renderCell: (params) => {
        const isOut = params.value === 0;
        const isLow = params.value < 5 && !isOut;
        return (
          <Chip
            label={isOut ? 'Sold Out' : isLow ? `Low: ${params.value}` : `${params.value} Units`}
            size="small"
            color={isOut ? 'error' : isLow ? 'warning' : 'success'}
            sx={{ fontWeight: 800, borderRadius: '6px', minWidth: '90px' }}
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
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
              <EditIcon fontSize="small" color="primary" />
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
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} sx={{ color: '#1E293B', letterSpacing: '-0.5px' }}>
              Catalog Manager
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Control your products, inventory levels, and visibility.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedProduct(null);
              setShowModal(true);
            }}
            sx={{ borderRadius: '12px', px: 4, py: 1.2, fontWeight: 700, textTransform: 'none', boxShadow: 3 }}
          >
            Create Product
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <KPICard title="Total Products" value={stats.total} icon={<ProductIcon />} color={theme.palette.primary.main} />
          <KPICard title="Featured Items" value={stats.featured} icon={<FeaturedIcon />} color="#ed6c02" />
          <KPICard title="Low Stock" value={stats.lowStock} icon={<StockIcon />} color="#d32f2f" />
        </Stack>

        <Paper sx={{ p: 2, mb: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <Stack direction="row" spacing={2}>
            <TextField
              placeholder="Search products..."
              fullWidth
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.disabled' }} />,
                sx: { borderRadius: '10px', bgcolor: '#fff' }
              }}
            />
            <TextField
              select
              size="small"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fff' } }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categoriesList.map((item) => (
                <MenuItem key={item.category} value={item.category}>
                  {item.category.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
            <IconButton onClick={handleResetFilters} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: '10px' }}>
              <ResetIcon color="primary" />
            </IconButton>
          </Stack>
        </Paper>

        <Paper sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isProductLoading}
            autoHeight
            rowHeight={70}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            slots={{ toolbar: CustomToolbar }}
            sx={{ border: 'none', '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC' } }}
          />
        </Paper>
      </Container>
      {showModal && <ProductModal product={selectedProduct} onClose={() => setShowModal(false)} />}
    </Box>
  );
};

const KPICard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 2.5, flex: 1, borderRadius: '20px', display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0' }}>
    <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 52, height: 52, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase' }}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={900}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

export default AllProducts;
