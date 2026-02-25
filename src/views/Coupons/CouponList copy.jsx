import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Chip, IconButton, Tooltip, Box, CircularProgress, Typography } from '@mui/material';
import { Edit, History } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCouponsAdmin } from '../../redux/features/Coupons/CouponSlice';

const CouponList = ({ onEdit, onViewHistory }) => {
  const dispatch = useDispatch();
  const { coupons = [], isCouponLoading } = useSelector((state) => state.coupon);

  useEffect(() => {
    dispatch(fetchAllCouponsAdmin());
  }, [dispatch]);

  const columns = [
    { field: 'code', headerName: 'Code', width: 150 },
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
    {
      field: 'type',
      headerName: 'Type',
      width: 130,
      renderCell: (params) => <Chip label={params.value} size="small" />
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === 'ACTIVE' ? 'success' : 'default'} variant="outlined" size="small" />
      )
    },
    { field: 'currentRedemptions', headerName: 'Used', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => onEdit(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="History">
            <IconButton onClick={() => onViewHistory(params.row)}>
              <History />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (isCouponLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!coupons.length) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <Typography color="text.secondary">No coupons found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <DataGrid
        rows={coupons}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 25, 50]}
        autoHeight
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

export default CouponList;
