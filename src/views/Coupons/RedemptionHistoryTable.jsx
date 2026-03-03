import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography, Chip, Avatar, alpha } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedemptionHistoryAdmin } from '../../redux/features/Coupons/CouponSlice';

const RedemptionHistoryTable = ({ couponId }) => {
  const dispatch = useDispatch();
  // Ensure we fallback to an empty array to avoid .map errors
  const { redemptionHistory = [], isCouponLoading } = useSelector((state) => state.coupon);

  useEffect(() => {
    if (couponId) {
      dispatch(fetchRedemptionHistoryAdmin({ id: couponId }));
    }
  }, [couponId, dispatch]);

  const columns = [
    {
      field: 'id',
      headerName: '#',
      width: 70,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      field: 'user',
      headerName: 'Customer',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#6366F1', 0.1), color: '#6366F1', fontWeight: 700 }}>
            {params.row.user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {params.row.user?.name || 'Unknown User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.user?.email || 'No Email'}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'amountUsed',
      headerName: 'Discount Applied',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>
          -₹{params.value || 0}
        </Typography>
      )
    },
    {
      field: 'redeemedAt',
      headerName: 'Date & Time',
      flex: 1,
      minWidth: 180,
      valueGetter: (params) => (params.value ? new Date(params.value) : null),
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? params.value.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
        </Typography>
      )
    }
  ];

  if (isCouponLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
        <CircularProgress size={30} />
        <Typography variant="body2" color="text.secondary">
          Loading redemptions...
        </Typography>
      </Box>
    );
  }

  if (!redemptionHistory || redemptionHistory.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" fontWeight={600} color="text.secondary">
          No redemptions found
        </Typography>
        <Typography variant="caption" color="text.disabled">
          This coupon hasn't been used yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={redemptionHistory}
        columns={columns}
        getRowId={(row) => row._id || Math.random()}
        autoHeight
        pageSizeOptions={[5, 10]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' },
          '& .MuiDataGrid-cell': { borderBottom: '1px solid #F1F5F9' }
        }}
      />
    </Box>
  );
};

export default RedemptionHistoryTable;
