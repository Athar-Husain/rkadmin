import React, { useEffect, useState } from 'react';
import { Box, Container, Stack, Typography, Button, Paper, Avatar, alpha, useTheme, Chip, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  StorefrontTwoTone as StoreIcon,
  AddRounded as AddIcon,
  EditTwoTone as EditIcon,
  ToggleOnTwoTone as ActiveIcon,
  ToggleOffTwoTone as InactiveIcon,
  LocationOnTwoTone as PinIcon,
  MapTwoTone as MapIcon,
  ContactPhoneTwoTone as PhoneIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStoresAdmin, toggleStoreStatusAdmin } from '../../redux/features/Stores/StoreSlice';
import StoreModal from './StoreModal';

const AllStores = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { stores = [], isStoreLoading } = useSelector((state) => state.store);
  const [showModal, setShowModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  // console.log('stores', stores);

  useEffect(() => {
    dispatch(fetchAllStoresAdmin());
  }, [dispatch]);

  const columns = [
    {
      field: 'code',
      headerName: 'Store Code',
      width: 140,
      renderCell: (params) => (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            px: 1,
            py: 0.5,
            borderRadius: '6px'
          }}
        >
          {params.value || 'AUTO-GEN'}
        </Typography>
      )
    },
    {
      field: 'name',
      headerName: 'Store Details',
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
          <Avatar variant="rounded" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
            <StoreIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.type} • {params.row.contact?.managerName || 'No Manager'}
            </Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'location',
      headerName: 'Location (Area & City)',
      flex: 1.2,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {params.value?.city}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.value?.area}
          </Typography>
        </Box>
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit Details">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedStore(params.row);
                setShowModal(true);
              }}
            >
              <EditIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.isActive ? 'Deactivate' : 'Activate'}>
            <IconButton size="small" onClick={() => dispatch(toggleStoreStatusAdmin(params.row._id))}>
              {params.row.isActive ? <ActiveIcon color="success" /> : <InactiveIcon color="disabled" />}
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
            <Typography variant="h4" fontWeight={900}>
              Store Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure locations, timings, and store-specific settings
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedStore(null);
              setShowModal(true);
            }}
            sx={{ borderRadius: '12px', px: 4 }}
          >
            Add Store
          </Button>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
          <StatCard title="Total Outlets" value={stores.length} icon={<MapIcon />} color="#2196f3" />
          <StatCard
            title="In Karnataka"
            value={stores.filter((s) => s.location?.state === 'KARNATAKA').length}
            icon={<PinIcon />}
            color="#f44336"
          />
          <StatCard title="Active" value={stores?.filter((s) => s.isActive).length} icon={<ActiveIcon />} color="#4caf50" />
        </Stack>

        <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #E0E4E8', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <DataGrid
            rows={stores}
            columns={columns}
            getRowId={(row) => row._id}
            loading={isStoreLoading}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            sx={{ border: 'none', '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC' } }}
          />
        </Paper>
      </Container>
      {showModal && <StoreModal store={selectedStore} onClose={() => setShowModal(false)} />}
    </Box>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2.5,
      flex: 1,
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      bgcolor: '#fff',
      border: `1px solid ${alpha(color, 0.2)}`
    }}
  >
    <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 48, height: 48, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={800}>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={900}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

export default AllStores;
