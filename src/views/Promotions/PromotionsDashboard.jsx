import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Stack, Typography, Button, Paper, Chip, IconButton, Tooltip, LinearProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  LocalOfferTwoTone as PromoIcon,
  AddRounded as AddIcon,
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon,
  StarRounded as FeaturedIcon,
  ConfirmationNumberTwoTone as RedemptionIcon
} from '@mui/icons-material';
import { fetchAllPromotions, deletePromotion } from '../../redux/features/Promotions/PromotionSlice';
import PromotionModal from './PromotionModal';

const PromotionsDashboard = () => {
  const dispatch = useDispatch();
  const { promotions = [], isPromotionLoading } = useSelector((state) => state.promotion);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPromotions());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Archive this promotion? This will set status to DELETED.')) {
      dispatch(deletePromotion(id));
    }
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Promotion',
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" fontWeight={700}>
              {params.value}
            </Typography>
            {params.row.featured && <FeaturedIcon sx={{ color: '#f59e0b', fontSize: 16 }} />}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {params.row.type} • {params.row.discountMessage}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const colors = { ACTIVE: 'success', DRAFT: 'warning', PAUSED: 'default', EXPIRED: 'error', DELETED: 'error' };
        return (
          <Chip
            label={params.value}
            color={colors[params.value]}
            size="small"
            sx={{ fontWeight: 800, borderRadius: '6px', fontSize: '0.65rem' }}
          />
        );
      }
    },
    {
      field: 'usage',
      headerName: 'Redemption Flow',
      width: 180,
      renderCell: (params) => {
        const progress = (params.row.currentRedemptions / params.row.maxRedemptions) * 100;
        return (
          <Box sx={{ width: '100%' }}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" fontWeight={700}>
                {params.row.currentRedemptions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                of {params.row.maxRedemptions}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { borderRadius: 3 } }}
            />
          </Box>
        );
      }
    },
    {
      field: 'validity',
      headerName: 'Duration',
      width: 180,
      valueGetter: (params, row) => `${new Date(row.validFrom).toLocaleDateString()} - ${new Date(row.validUntil).toLocaleDateString()}`
    },
    {
      field: 'performance',
      headerName: 'ROI Stats',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5}>
          <Tooltip title="Clicks">
            <Typography variant="caption">🖱️ {params.row.clicks}</Typography>
          </Tooltip>
          <Tooltip title="Redeemed">
            <Typography variant="caption">🎟️ {params.row.redemptions}</Typography>
          </Tooltip>
        </Stack>
      )
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <IconButton
            size="small"
            onClick={() => {
              setSelectedPromo(params.row);
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
            <Typography variant="h4" fontWeight={900} color="#1E293B">
              Marketing Promotions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage discounts, BOGO offers, and reward campaigns.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedPromo(null);
              setModalOpen(true);
            }}
            sx={{ borderRadius: '12px', px: 3, fontWeight: 700, textTransform: 'none' }}
          >
            Create Promotion
          </Button>
        </Stack>

        <Paper sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <DataGrid
            rows={promotions}
            columns={columns}
            getRowId={(row) => row._id}
            loading={isPromotionLoading}
            autoHeight
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            sx={{ border: 'none', '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC' } }}
          />
        </Paper>
      </Container>

      {modalOpen && <PromotionModal open={modalOpen} promotion={selectedPromo} onClose={() => setModalOpen(false)} />}
    </Box>
  );
};

export default PromotionsDashboard;
