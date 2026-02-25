import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Modal,
  Fade,
  Backdrop,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  Chip,
  alpha,
  Card,
  CardContent
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  VisibilityOutlined as VisibilityIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  AddRounded as AddIcon,
  CellTowerRounded as NetworkIcon,
  CheckCircleRounded as ActiveIcon,
  ErrorOutlineRounded as InactiveIcon,
  SignalCellularAltRounded as SignalIcon
} from '@mui/icons-material';
import AddRegion from './AddRegion';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServiceAreas, deleteServiceArea } from '../../redux/features/Area/AreaSlice';

// ==============================|| SUMMARY CARD COMPONENT ||============================== //

const SummaryCard = ({ title, value, icon: IconComponent, color }) => (
  <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #E9EDF7' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', p: '24px !important' }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          bgcolor: alpha(color, 0.1),
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2
        }}
      >
        {/* Fixed the 'type' error by rendering the component directly */}
        <IconComponent sx={{ fontSize: 24 }} />
      </Box>
      <Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={800} color="#1B2559">
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// ==============================|| MAIN REGION LIST ||============================== //

const RegionList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { areas = [], isAreaLoading } = useSelector((state) => state.serviceArea || state.area || { areas: [] });

  useEffect(() => {
    dispatch(getAllServiceAreas());
  }, [dispatch]);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const activeAreasCount = areas?.filter((a) => a.isActive).length || 0;
  const criticalCount = areas?.filter((a) => a.networkStatus === 'Down' || a.networkStatus === 'Low').length || 0;

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Region?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      confirmButtonText: 'Yes, delete'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteServiceArea(id)).then(() => dispatch(getAllServiceAreas()));
      }
    });
  };

  const columns = [
    {
      field: 'region',
      headerName: 'Area Name',
      flex: 1.2,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="body2" fontWeight={700} color="primary.main">
            {params.value || 'Unnamed Region'}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          variant="tonal" // or "outlined" if your theme doesn't support tonal
          sx={{ fontWeight: 700, borderRadius: '6px' }}
        />
      )
    },
    {
      field: 'networkStatus',
      headerName: 'Network Health',
      width: 160,
      renderCell: (params) => {
        const status = params.value || 'Good';
        const color = status === 'Good' ? 'success.main' : status === 'Down' ? 'error.main' : 'warning.main';
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, boxShadow: `0 0 8px ${alpha(theme.palette.divider, 0.5)}` }}
            />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {status}
            </Typography>
          </Stack>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => navigate(`/areas/${params.row._id}/view`)} color="primary">
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => navigate(`/areas/${params.row._id}/edit`)} color="info">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row._id)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ p: 4, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#1B2559">
            Region Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and configure service distribution areas.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{ borderRadius: '12px', bgcolor: '#4318FF', px: 3, py: 1, textTransform: 'none', fontWeight: 700 }}
        >
          Create New
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Total Areas" value={areas.length} icon={NetworkIcon} color="#4318FF" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Active Now" value={activeAreasCount} icon={ActiveIcon} color="#05CD99" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Network Alerts" value={criticalCount} icon={SignalIcon} color="#FFB547" />
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: '20px', p: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: 'none' }}>
        <DataGrid
          rows={areas.map((r, i) => ({ ...r, id: r._id || i }))}
          columns={columns}
          loading={isAreaLoading}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { borderBottom: '1px solid #F4F7FE', bgcolor: '#FCFDFF' },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #F4F7FE' },
            '& .MuiDataGrid-row:hover': { bgcolor: '#F9FAFF' }
          }}
        />
      </Paper>

      <Modal open={open} onClose={handleCloseModal} closeAfterTransition slots={{ backdrop: Backdrop }}>
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: '20px',
              p: 4,
              outline: 'none'
            }}
          >
            <AddRegion onClose={handleCloseModal} />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default RegionList;
