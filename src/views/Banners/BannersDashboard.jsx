import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Stack, Typography, Button, Paper, Avatar, alpha, useTheme, Chip, IconButton, Tooltip, Card } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import {
  ViewCarouselTwoTone as BannerIcon,
  AddRounded as AddIcon,
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon,
  FiberManualRecord as StatusIcon,
  TrendingUpTwoTone as AnalyticsIcon,
  CalendarMonthTwoTone as DateIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { fetchAllBanners, deleteBanner } from '../../redux/features/Banners/BannerSlice';
import BannerModal from './BannerModal.jsx';

const CustomToolbar = () => (
  <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
    <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
      PROMOTIONAL CAMPAIGNS
    </Typography>
    <GridToolbarExport sx={{ borderRadius: '8px', fontWeight: 700 }} />
  </GridToolbarContainer>
);

const BannersDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { banners = [], isBannerLoading } = useSelector((state) => state.banner);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBanners());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this campaign?')) {
      try {
        await dispatch(deleteBanner(id)).unwrap();
        toast.success('Campaign removed');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const columns = [
    {
      field: 'imageUrl',
      headerName: 'Preview',
      width: 120,
      renderCell: (params) => (
        <Avatar src={params.value} variant="rounded" sx={{ width: 80, height: 45, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }} />
      )
    },
    {
      field: 'title',
      headerName: 'Campaign Details',
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={700} color="text.primary">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            {params.row.description || 'No description provided'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'actionType',
      headerName: 'Click Action',
      width: 130,
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.65rem', borderRadius: '4px' }} />
      )
    },
    {
      field: 'validity',
      headerName: 'Schedule',
      width: 200,
      renderCell: (params) => (
        <Stack spacing={0.2}>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StatusIcon sx={{ fontSize: 8, color: 'success.main' }} /> {new Date(params.row.startDate).toLocaleDateString()}
          </Typography>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StatusIcon sx={{ fontSize: 8, color: 'error.main' }} /> {new Date(params.row.endDate).toLocaleDateString()}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const isLive = params.value && new Date(params.row.endDate) > new Date();
        return (
          <Chip
            label={isLive ? 'Live' : 'Inactive'}
            color={isLive ? 'success' : 'default'}
            size="small"
            sx={{ fontWeight: 800, borderRadius: '6px' }}
          />
        );
      }
    },
    {
      field: 'analytics',
      headerName: 'Performance',
      width: 130,
      renderCell: (params) => (
        <Stack direction="row" spacing={2}>
          <Tooltip title="Impressions">
            <Typography variant="caption" fontWeight={700}>
              {params.row.impressions || 0}👁️
            </Typography>
          </Tooltip>
          <Tooltip title="Clicks">
            <Typography variant="caption" fontWeight={700} color="primary.main">
              {params.row.clicks || 0}🖱️
            </Typography>
          </Tooltip>
        </Stack>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      align: 'right',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedBanner(params.row);
              setModalOpen(true);
            }}
          >
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
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
              Banner Management
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Create and schedule promotional banners for your target audience.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedBanner(null);
              setModalOpen(true);
            }}
            sx={{ borderRadius: '12px', px: 4, py: 1.2, fontWeight: 700, textTransform: 'none', boxShadow: 3 }}
          >
            Create Campaign
          </Button>
        </Stack>

        <Paper sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          <DataGrid
            rows={banners}
            columns={columns}
            getRowId={(row) => row._id}
            loading={isBannerLoading}
            autoHeight
            rowHeight={70}
            disableRowSelectionOnClick
            slots={{ toolbar: CustomToolbar }}
            sx={{ border: 'none', '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC' } }}
          />
        </Paper>
      </Container>

      {modalOpen && <BannerModal open={modalOpen} banner={selectedBanner} onClose={() => setModalOpen(false)} />}
    </Box>
  );
};

export default BannersDashboard;
