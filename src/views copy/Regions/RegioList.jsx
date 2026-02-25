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
  ErrorOutlineRounded as InactiveIcon
} from '@mui/icons-material';
import AddRegion from './AddRegion';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServiceAreas, deleteServiceArea } from '../../redux/features/Area/AreaSlice';

const RegionList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Safety fallbacks for theme colors to prevent alpha() crashes
  const colors = {
    primary: theme.palette?.primary?.main || '#4318FF',
    success: theme.palette?.success?.main || '#05CD99',
    error: theme.palette?.error?.main || '#EE5D50',
    info: theme.palette?.info?.main || '#01B574',
    grey: theme.palette?.grey?.[400] || '#A3AED0'
  };

  const { areas = [], isAreaLoading } = useSelector((state) => state.serviceArea || state.area || {});

  useEffect(() => {
    dispatch(getAllServiceAreas());
  }, [dispatch]);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const activeAreasCount = areas.filter((a) => a.isActive).length;

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Region?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.error,
      cancelButtonColor: theme.palette?.grey?.[500] || '#707EAE',
      confirmButtonText: 'Yes, delete',
      buttonsStyling: true
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteServiceArea(id)).then(() => {
          dispatch(getAllServiceAreas());
          Swal.fire('Deleted!', 'Region deleted successfully.', 'success');
        });
      }
    });
  };

  const columns = [
    {
      field: 'region',
      headerName: 'Service Area',
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ height: '100%' }}>
          <Box
            sx={{
              p: 1,
              bgcolor: alpha(colors.primary, 0.1),
              borderRadius: 1.5,
              display: 'flex'
            }}
          >
            <NetworkIcon sx={{ fontSize: 18, color: colors.primary }} />
          </Box>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {params.value}
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
          icon={params.value ? <ActiveIcon style={{ fontSize: 14 }} /> : <InactiveIcon style={{ fontSize: 14 }} />}
          label={params.value ? 'Active' : 'Inactive'}
          sx={{
            fontWeight: 700,
            fontSize: '0.75rem',
            bgcolor: params.value ? alpha(colors.success, 0.1) : alpha(colors.grey, 0.1),
            color: params.value ? 'success.main' : 'text.secondary',
            border: '1px solid',
            borderColor: params.value ? alpha(colors.success, 0.2) : alpha(colors.grey, 0.2)
          }}
        />
      )
    },
    {
      field: 'networkStatus',
      headerName: 'Health',
      width: 150,
      renderCell: (params) => {
        const status = params.value || 'Good';
        const statusColors = {
          Good: colors.success,
          Low: theme.palette?.warning?.main || '#FFB800',
          Moderate: colors.info,
          Down: colors.error
        };
        return (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColors[status] || statusColors.Good }} />
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              {status.toUpperCase()}
            </Typography>
          </Stack>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Management',
      flex: 1,
      sortable: false,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center" sx={{ height: '100%' }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => navigate(`/areas/${params.row._id}/view`)}
              sx={{ color: 'primary.main', bgcolor: alpha(colors.primary, 0.05) }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Area">
            <IconButton
              size="small"
              onClick={() => navigate(`/areas/${params.row._id}/edit`)}
              sx={{ color: 'info.main', bgcolor: alpha(colors.info, 0.05) }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row._id)}
              sx={{ color: 'error.main', bgcolor: alpha(colors.error, 0.05) }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f7fe', minHeight: '100vh' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1B2559', letterSpacing: '-0.02em' }}>
            Service Areas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
            Manage network regions and team allocations across your infrastructure.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{
            bgcolor: '#4318FF',
            borderRadius: '12px',
            px: 3,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 700,
            '&:hover': { bgcolor: '#3311CC' },
            boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.2)'
          }}
        >
          Add New Region
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard title="Total Regions" value={areas.length} icon={<NetworkIcon />} color={colors.primary} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard title="Active Areas" value={activeAreasCount} icon={<ActiveIcon />} color={colors.success} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard
            title="Critical Issues"
            value={areas.filter((a) => a.networkStatus === 'Down').length}
            icon={<InactiveIcon />}
            color={colors.error}
          />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          p: 2,
          bgcolor: '#fff',
          boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
        }}
      >
        <DataGrid
          rows={areas.map((r) => ({ ...r, id: r._id || Math.random() }))}
          columns={columns}
          loading={isAreaLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'transparent',
              borderBottom: `1px solid ${theme.palette?.divider || '#E9EDF7'}`,
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, color: 'text.secondary' }
            },
            '& .MuiDataGrid-cell': { borderBottom: `1px solid #F4F7FE` },
            '& .MuiDataGrid-row:hover': { bgcolor: '#F4F7FE', cursor: 'pointer' }
          }}
        />
      </Paper>

      <Modal
        open={open}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <AddRegion onClose={handleCloseModal} />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

const SummaryCard = ({ title, value, icon, color }) => (
  <Card sx={{ borderRadius: '20px', boxShadow: 'none', border: '1px solid #E9EDF7' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', p: '20px !important' }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: alpha(color || '#000', 0.1),
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2
        }}
      >
        {icon ? React.cloneElement(icon, { fontSize: 'medium' }) : null}
      </Box>
      <Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={800} color="#1B2559">
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  borderRadius: '24px',
  boxShadow: '0px 20px 50px rgba(0,0,0,0.1)',
  p: 4,
  outline: 'none'
};

export default RegionList;
