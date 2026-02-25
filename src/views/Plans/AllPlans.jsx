import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Paper,
  Avatar,
  alpha,
  useTheme,
  Chip,
  Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Icons
import {
  VisibilityOutlined as VisibilityIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  AddRounded as AddIcon,
  Inventory2Outlined as PlanIcon,
  AccountBalanceWalletOutlined as PriceIcon,
  CategoryOutlined as CategoryIcon,
  SpeedRounded as SpeedIcon,
  // InfinityRounded as UnlimitedIcon,
  // UnlimitedIcon,
  CheckCircleOutlineRounded as FeatureIcon,
  CloseRounded as CloseIcon
} from '@mui/icons-material';

import { getAllPlans, deletePlan } from '../../redux/features/Plan/PlanSlice';
import ConfirmDialog from '../../component/ConfirmDialog/ConfirmDialog';
import { ToastContainer, toast } from 'react-toastify';

const AllPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const { allPlans = [], categories = [], isPlanLoading } = useSelector((state) => state.plan);

  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  // KPI Logic
  const avgPrice = allPlans.length > 0 ? (allPlans.reduce((acc, curr) => acc + (curr.price || 0), 0) / allPlans.length).toFixed(0) : 0;

  const handleView = (plan) => {
    setSelectedPlan(plan);
    setViewModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deletePlan(planToDelete._id)).unwrap();
      toast.success('Plan deleted successfully!');
      dispatch(getAllPlans());
    } catch (err) {
      toast.error('Failed to delete plan.');
    } finally {
      setConfirmDeleteOpen(false);
      setPlanToDelete(null);
    }
  };

  const KPICard = ({ title, value, icon, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#fff',
        boxShadow: '0px 12px 30px rgba(112, 144, 176, 0.06)',
        border: '1px solid #F4F7FE'
      }}
    >
      <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 56, height: 56, mr: 2 }}>{icon}</Avatar>
      <Box>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={800} color="#1B2559">
          {value}
        </Typography>
      </Box>
    </Paper>
  );

  const columns = [
    { field: 'sl', headerName: 'SL', width: 70, headerAlign: 'center', align: 'center' },
    {
      field: 'name',
      headerName: 'PLAN NAME',
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={700} color="#1B2559">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'categoryName',
      headerName: 'CATEGORY',
      flex: 1,
      renderCell: (params) => <Chip label={params.value} size="small" sx={{ bgcolor: '#F4F7FE', color: '#4318FF', fontWeight: 700 }} />
    },
    { field: 'duration', headerName: 'DURATION', flex: 0.8 },
    {
      field: 'price',
      headerName: 'PRICE',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={800} color="#01B574">
          ₹{params.value?.toLocaleString('en-IN')}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 150,
      headerAlign: 'right',
      align: 'right',
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleView(params.row)} sx={{ color: '#4318FF', bgcolor: alpha('#4318FF', 0.05) }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => navigate(`/plan/edit/${params.row._id}`)}
              sx={{ color: '#01B574', bgcolor: alpha('#01B574', 0.05) }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => {
                setPlanToDelete(params.row);
                setConfirmDeleteOpen(true);
              }}
              sx={{ color: '#EE5D50', bgcolor: alpha('#EE5D50', 0.05) }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  const rows =
    allPlans?.map((plan, index) => ({
      ...plan,
      id: plan._id,
      sl: index + 1,
      categoryName: categories?.find((cat) => cat._id === plan.category)?.name || 'N/A'
    })) || [];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1B2559', letterSpacing: '-0.02em' }}>
            Service Plans
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Manage subscription packages and pricing tiers
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/plan/create')}
          sx={{
            bgcolor: '#4318FF',
            borderRadius: '12px',
            px: 3,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.2)',
            '&:hover': { bgcolor: '#3311CC' }
          }}
        >
          Create New Plan
        </Button>
      </Stack>

      {/* KPI Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KPICard title="Total Plans" value={allPlans.length} icon={<PlanIcon />} color="#4318FF" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KPICard title="Avg. Monthly Price" value={`₹${avgPrice}`} icon={<PriceIcon />} color="#01B574" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KPICard title="Active Categories" value={categories.length} icon={<CategoryIcon />} color="#FFB547" />
        </Grid>
      </Grid>

      {/* Data Table */}
      <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, bgcolor: '#fff', boxShadow: '0px 20px 50px rgba(112, 144, 176, 0.08)' }}>
        {isPlanLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            autoHeight
            disableRowSelectionOnClick
            rowHeight={70}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '1px solid #F4F7FE',
                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 800, color: 'text.disabled', fontSize: '0.75rem' }
              },
              '& .MuiDataGrid-cell': { borderBottom: '1px solid #F4F7FE' },
              '& .MuiDataGrid-row:hover': { bgcolor: alpha('#F4F7FE', 0.5) }
            }}
          />
        )}
      </Paper>

      {/* View Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={800} color="#1B2559">
            Plan Details
          </Typography>
          <IconButton onClick={() => setViewModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <Box sx={{ mt: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: alpha('#4318FF', 0.1), color: '#4318FF', width: 60, height: 60 }}>
                  <SpeedIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    {selectedPlan.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPlan.duration} Subscription
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', textAlign: 'center', borderColor: '#F4F7FE' }}>
                    <Typography variant="caption" color="text.disabled" fontWeight={700}>
                      SPEED
                    </Typography>
                    <Typography variant="h6" fontWeight={800} color="#4318FF">
                      {selectedPlan.internetSpeed} {selectedPlan.internetSpeedUnit}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', textAlign: 'center', borderColor: '#F4F7FE' }}>
                    <Typography variant="caption" color="text.disabled" fontWeight={700}>
                      DATA LIMIT
                    </Typography>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
                      {selectedPlan.dataLimitType === 'unlimited' && <AddIcon sx={{ fontSize: 18, color: '#01B574' }} />}
                      <Typography variant="h6" fontWeight={800} color="#01B574">
                        {selectedPlan.dataLimitType === 'limited' ? `${selectedPlan.dataLimit} GB` : 'Unlimited'}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ my: 3 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={800}
                  color="text.disabled"
                  gutterBottom
                  sx={{ textTransform: 'uppercase', fontSize: '0.7rem' }}
                >
                  Included Features
                </Typography>
                <Grid container spacing={1}>
                  {selectedPlan.features?.map((f, i) => (
                    <Grid size={{ xs: 12 }} key={i}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FeatureIcon sx={{ color: '#01B574', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={500}>
                          {f}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Monthly Billing
                </Typography>
                <Typography variant="h5" fontWeight={900} color="#1B2559">
                  ₹{selectedPlan.price}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        message="Deleting this plan will prevent new users from subscribing to it. Continue?"
      />
      <ToastContainer position="bottom-right" />
    </Box>
  );
};

export default AllPlans;
