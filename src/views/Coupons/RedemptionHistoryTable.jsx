import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography, Chip, Avatar, alpha } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedemptionHistoryAdmin } from '../../redux/features/Coupons/CouponSlice';

const RedemptionHistoryTable = ({ couponId }) => {
  const dispatch = useDispatch();
  const { redemptionHistory = [], isCouponLoading } = useSelector((state) => state.coupon);

  useEffect(() => {
    if (couponId) {
      dispatch(fetchRedemptionHistoryAdmin({ id: couponId }));
    }
  }, [couponId, dispatch]);

  const rowsWithId = redemptionHistory.map((row, index) => ({
    ...row,
    id: row._id || `${row.user?._id || 'unknown'}-${row.redeemedAt || index}`
  }));

  const columns = [
    {
      field: 'sl',
      headerName: '#',
      width: 60,
      renderCell: (params) => {
        // Correct way to get index in modern DataGrid
        const index = params.api.getAllRowIds().indexOf(params.id);
        return (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {index + 1}
          </Typography>
        );
      }
    },
    {
      field: 'user',
      headerName: 'Customer',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: alpha('#6366F1', 0.1), color: '#6366F1' }}>
            {params.row.user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1 }}>
              {params.row.user?.name || 'Unknown User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {params.row.user?.email || 'N/A'}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'amountUsed',
      headerName: 'Discount Applied',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>
          -₹{params.value || 0}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: () => (
        <Chip
          label="REDEEMED"
          size="small"
          sx={{
            bgcolor: alpha('#10B981', 0.1),
            color: '#10B981',
            fontWeight: 700,
            borderRadius: '6px'
          }}
        />
      )
    },
    {
      field: 'redeemedAt',
      headerName: 'Date & Time',
      flex: 1,
      minWidth: 180,
      valueFormatter: (params) => {
        if (!params.value) return 'N/A';
        return new Date(params.value).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });
      }
    }
  ];

  if (isCouponLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
        <CircularProgress size={32} thickness={5} sx={{ color: '#6366F1' }} />
        <Typography variant="body2" color="text.secondary">
          Fetching history...
        </Typography>
      </Box>
    );
  }

  if (!redemptionHistory.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#F8FAFC', borderRadius: '16px', border: '1px dashed #E2E8F0' }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          No redemptions yet
        </Typography>
        <Typography variant="caption" color="text.disabled">
          This coupon hasn't been used by any customers.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '16px', overflow: 'hidden' }}>
      <DataGrid
        rows={rowsWithId}
        columns={columns}
        autoHeight
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } }
        }}
        pageSizeOptions={[10, 25]}
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            fontWeight: 800,
            color: 'text.secondary',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #F1F5F9',
            py: 2,
            display: 'flex',
            alignItems: 'center'
          },
          '& .MuiDataGrid-row:hover': {
            bgcolor: alpha('#6366F1', 0.02)
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #E2E8F0'
          }
        }}
      />
    </Box>
  );
};

export default RedemptionHistoryTable;
