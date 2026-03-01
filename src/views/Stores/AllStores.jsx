import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Paper,
  Avatar,
  alpha,
  useTheme,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import {
  StorefrontTwoTone as StoreIcon,
  AddRounded as AddIcon,
  EditTwoTone as EditIcon,
  ToggleOnTwoTone as ActiveIcon,
  ToggleOffTwoTone as InactiveIcon,
  LocationOnTwoTone as PinIcon,
  MapTwoTone as MapIcon,
  SearchRounded as SearchIcon,
  PhoneInTalkTwoTone as PhoneIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStoresAdmin, toggleStoreStatusAdmin } from '../../redux/features/Stores/StoreSlice';
import StoreModal from './StoreModal';

// Custom Toolbar for DataGrid
const CustomToolbar = () => (
  <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
    <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
      OUTLET REGISTER
    </Typography>
    <GridToolbarExport sx={{ borderRadius: '8px', fontWeight: 700 }} />
  </GridToolbarContainer>
);

// Reusable Stat Card
const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      bgcolor: '#fff',
      border: '1px solid #E2E8F0',
      transition: '0.3s',
      '&:hover': { boxShadow: '0 10px 20px rgba(0,0,0,0.05)', borderColor: alpha(color, 0.4) }
    }}
  >
    <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 56, height: 56, mr: 2.5 }}>{icon}</Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={900} sx={{ color: '#1E293B' }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const AllStores = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { stores = [], isStoreLoading } = useSelector((state) => state.store);

  const [showModal, setShowModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAllStoresAdmin());
  }, [dispatch]);

  // Filter stores by search
  const filteredRows = useMemo(() => {
    return stores.filter(
      (store) =>
        store.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stores, searchQuery]);

  const columns = [
    {
      field: 'code',
      headerName: 'Store Code',
      width: 130,
      renderCell: (params) => (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            px: 1.5,
            py: 0.5,
            borderRadius: '6px',
            textTransform: 'uppercase'
          }}
        >
          {params.value || 'N/A'}
        </Typography>
      )
    },
    {
      field: 'name',
      headerName: 'Store Details',
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1, height: '100%' }}>
          <Avatar variant="rounded" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 40, height: 40 }}>
            <StoreIcon fontSize="small" />
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon sx={{ fontSize: 10 }} /> {params.row.contact?.phone || 'No Contact'}
            </Typography>
          </Box>
        </Stack>
      )
    },
    // {
    //   field: 'location',
    //   headerName: 'Location',
    //   flex: 1.2,
    //   renderCell: (params) => (
    //     <Box sx={{ py: 1 }}>
    //       <Typography variant="body2" fontWeight={600} color="text.primary">
    //         {params.value?.city || 'Unknown City'}
    //       </Typography>
    //       <Typography variant="caption" color="text.secondary">
    //         {params.value?.area || 'Address not set'}
    //       </Typography>
    //     </Box>
    //   )
    // },
    {
  field: 'location',
  headerName: 'Location',
  flex: 1.2,
  sortable: false,
  renderCell: (params) => {
    const location = params.value || {};
    return (
      <Box sx={{ py: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body2" fontWeight={600} color="text.primary" noWrap>
          {location.city || 'Unknown City'}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {location.area || 'Address not set'}
        </Typography>
      </Box>
    );
  }
},
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          variant={params.value ? 'filled' : 'outlined'}
          color={params.value ? 'success' : 'error'}
          size="small"
          sx={{ fontWeight: 800, minWidth: '80px', borderRadius: '8px' }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="Edit Details">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedStore(params.row);
                setShowModal(true);
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.isActive ? 'Deactivate Store' : 'Activate Store'}>
            <IconButton size="small" onClick={() => dispatch(toggleStoreStatusAdmin(params.row._id))}>
              {params.row.isActive ? (
                <ActiveIcon sx={{ color: theme.palette.success.main }} />
              ) : (
                <InactiveIcon sx={{ color: theme.palette.text.disabled }} />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ py: 4 }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={900} sx={{ color: '#1E293B', letterSpacing: '-0.5px' }}>
              Store Management
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Monitor and manage physical outlet locations and operational status.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedStore(null);
              setShowModal(true);
            }}
            sx={{ borderRadius: '12px', px: 4, py: 1.2, fontWeight: 700, textTransform: 'none', boxShadow: 3 }}
          >
            Add New Store
          </Button>
        </Stack>

        {/* Stats Section */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <StatCard title="Total Outlets" value={stores.length} icon={<MapIcon />} color="#3B82F6" />
          <StatCard
            title="Regional Units"
            value={stores.filter((s) => s.location?.state?.toUpperCase() === 'KARNATAKA').length}
            icon={<PinIcon />}
            color="#EF4444"
          />
          <StatCard title="Operational" value={stores.filter((s) => s.isActive).length} icon={<ActiveIcon />} color="#10B981" />
        </Stack>

        {/* Search */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <TextField
            placeholder="Search by store name, code, or city..."
            fullWidth
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px', bgcolor: '#fff' }
            }}
          />
        </Paper>

        {/* DataGrid */}
        <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 4px 25px rgba(0,0,0,0.02)' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row._id}
            loading={isStoreLoading}
            autoHeight
            rowHeight={70}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            slots={{ toolbar: CustomToolbar }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' },
              '& .MuiDataGrid-cell': { borderBottom: '1px solid #F1F5F9' },
              '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #E2E8F0' }
            }}
          />
        </Paper>
      </Container>

      {showModal && <StoreModal store={selectedStore} onClose={() => setShowModal(false)} />}
    </Box>
  );
};

export default AllStores;
