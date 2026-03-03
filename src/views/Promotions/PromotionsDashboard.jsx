import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Stack, Typography, Button, Paper, Chip, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { AddRounded as AddIcon, EditTwoTone as EditIcon, DeleteTwoTone as DeleteIcon } from '@mui/icons-material';
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
    if (window.confirm('Delete this promotion?')) {
      dispatch(deletePromotion(id));
    }
  };

  const columns = [
    {
      field: 'image',
      headerName: '',
      width: 90,
      sortable: false,
      renderCell: (params) => (
        <Box
          component="img"
          src={params.row.imageUrl}
          alt={params.row.title}
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            objectFit: 'cover',
            border: '1px solid #e2e8f0'
          }}
        />
      )
    },
    {
      field: 'title',
      headerName: 'Promotion',
      flex: 1.5,
      renderCell: (params) => (
        <Stack spacing={0.5}>
          <Typography fontWeight={700}>{params.row.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            Order: {params.row.displayOrder}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(params.row.startDate).toLocaleDateString()} — {new Date(params.row.endDate).toLocaleDateString()}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.isActive ? 'ACTIVE' : 'DRAFT'}
          color={params.row.isActive ? 'success' : 'default'}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      )
    },
    {
      field: 'impressions',
      headerName: 'Impressions',
      width: 130
    },
    {
      field: 'clicks',
      headerName: 'Clicks',
      width: 100
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
            <Typography variant="h4" fontWeight={900}>
              Promotions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage promotional campaigns and banners.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedPromo(null);
              setModalOpen(true);
            }}
            sx={{ borderRadius: 3, px: 3, textTransform: 'none', fontWeight: 700 }}
          >
            Create Promotion
          </Button>
        </Stack>

        <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <DataGrid
            rows={promotions}
            columns={columns}
            getRowId={(row) => row._id}
            loading={isPromotionLoading}
            autoHeight
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'displayOrder', sort: 'asc' }]
              }
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#F1F5F9'
              }
            }}
          />
        </Paper>
      </Container>

      {modalOpen && (
        <PromotionModal
          open={modalOpen}
          promotion={selectedPromo}
          onClose={() => setModalOpen(false)}
          onRefresh={() => dispatch(fetchAllPromotions())}
        />
      )}
    </Box>
  );
};

export default PromotionsDashboard;
