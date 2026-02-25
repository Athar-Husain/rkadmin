import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedemptionHistoryAdmin } from '../../redux/features/Coupons/CouponSlice';
// import { fetchRedemptionHistoryAdmin } from '../../redux/features/Coupons/CouponSlice';

const RedemptionHistoryTable = ({ couponId }) => {
  const dispatch = useDispatch();

  const { redemptionHistory = [], isCouponLoading } = useSelector((state) => state.coupon);

  useEffect(() => {
    if (couponId) {
      dispatch(fetchRedemptionHistoryAdmin({ id: couponId }));
    }
  }, [couponId, dispatch]);

  const columns = [
    { field: 'sl', headerName: 'SL', width: 70, valueGetter: (params) => params.api.getRowIndex(params.id) + 1 },
    {
      field: 'userName',
      headerName: 'User',
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => params.row.user?.name || 'N/A'
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => params.row.user?.email || 'N/A'
    },
    { field: 'redeemedAmount', headerName: 'Amount', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Typography color={params.value === 'REDEEMED' ? 'success.main' : 'text.secondary'} fontWeight={700}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'redeemedAt',
      headerName: 'Redeemed On',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleString() : 'N/A')
    }
  ];

  if (isCouponLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!redemptionHistory.length) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <Typography color="text.secondary">No redemption history found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <DataGrid
        rows={redemptionHistory}
        columns={columns}
        getRowId={(row) => row._id}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        sx={{
          minWidth: 800,
          border: 'none',
          '& .MuiDataGrid-columnHeaders': { backgroundColor: '#F4F6FA', fontWeight: 700 },
          '& .MuiDataGrid-cell': { borderBottom: '1px solid #F4F7FE' },
          '& .MuiDataGrid-row:hover': { bgcolor: 'rgba(67, 24, 255, 0.03)' }
        }}
      />
    </Box>
  );
};

export default RedemptionHistoryTable;
