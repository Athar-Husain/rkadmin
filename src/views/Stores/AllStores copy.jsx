import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Avatar,
  alpha,
  useTheme
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  StorefrontTwoTone as StoreIcon,
  AddRounded as AddIcon,
  MapTwoTone as MapIcon,
  LocationOnTwoTone as PinIcon,
  PowerSettingsNewRounded as PowerIcon,
  EditTwoTone as EditIcon,
  SearchRounded as SearchIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStoresAdmin, toggleStoreStatusAdmin } from '../../redux/features/Stores/StoreSlice';
import StoreModal from './StoreModal'; // We will create this next

const AllStores = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { stores = [], isStoreLoading } = useSelector((state) => state.store);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    dispatch(fetchAllStoresAdmin());
  }, [dispatch]);

  const columns = [
    {
      field: 'name',
      headerName: 'Store Name',
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: '12px' }}>
            <StoreIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.type}
            </Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1.2,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" noWrap>
            {params.value?.city}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {params.value?.area}
          </Typography>
        </Box>
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Offline'}
          color={params.value ? 'success' : 'default'}
          size="small"
          sx={{ fontWeight: 700, borderRadius: '8px' }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedStore(params.row);
              setShowModal(true);
            }}
          >
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => dispatch(toggleStoreStatusAdmin(params.row._id))}
            sx={{ color: params.row.isActive ? 'error.main' : 'success.main' }}
          >
            <PowerIcon fontSize="small" />
          </IconButton>
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
              Outlet Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage physical store locations and staff access
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedStore(null);
              setShowModal(true);
            }}
            sx={{ borderRadius: '12px', px: 3 }}
          >
            Add New Store
          </Button>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
          <KPICard title="Total Outlets" value={stores.length} icon={<MapIcon />} color="#2196f3" />
          <KPICard title="Active Stores" value={stores.filter((s) => s.isActive).length} icon={<PinIcon />} color="#4caf50" />
        </Stack>

        <Paper sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #E0E4E8' }}>
          <DataGrid
            rows={stores}
            columns={columns}
            getRowId={(row) => row._id}
            loading={isStoreLoading}
            autoHeight
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            sx={{ border: 'none', '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC' } }}
          />
        </Paper>
      </Container>
      {showModal && <StoreModal store={selectedStore} onClose={() => setShowModal(false)} />}
    </Box>
  );
};

const KPICard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 2.5, flex: 1, borderRadius: '16px', display: 'flex', alignItems: 'center', bgcolor: '#fff' }}>
    <Avatar sx={{ bgcolor: alpha(color, 0.1), color, mr: 2 }}>{icon}</Avatar>
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
