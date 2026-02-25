import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCouponsAdmin } from '../../redux/features/Coupons/CouponSlice';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, Chip, Stack, Tooltip, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Campaign, Add, LocationOn, History, CheckCircle, ErrorOutline } from '@mui/icons-material';
import TargetedCampaignDialog from '../Campaigns/TargetedCampaignDialog';
// import TargetedCampaignDialog from './TargetedCampaignDialog'; // Import the dialog we created

const CouponsDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coupons, isCouponLoading } = useSelector((state) => state.coupon);

  // State for targeting dialog
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCouponsAdmin());
  }, [dispatch]);

  const handleOpenCampaign = (coupon) => {
    setSelectedCoupon(coupon);
    setIsCampaignOpen(true);
  };

  const handleSendCampaign = (campaignData) => {
    // This is where you call your backend targeting API
    console.log('Launching Targeted Campaign:', {
      couponId: selectedCoupon?._id,
      ...campaignData
    });
    // Example: dispatch(sendTargetedPush({ ...campaignData, couponId: selectedCoupon._id }));
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Coupon Details',
      flex: 1.5,
      renderCell: (params) => (
        <Box py={1}>
          <Typography variant="body2" fontWeight="bold" sx={{ color: '#1a237e' }}>
            {params.row?.title}
          </Typography>
          <Typography variant="caption" sx={{ bgcolor: '#f5f5f5', px: 1, borderRadius: 1, fontWeight: 'bold' }}>
            {params.row?.code}
          </Typography>
        </Box>
      )
    },
    {
      field: 'value',
      headerName: 'Offer Value',
      flex: 0.8,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="primary">
          {params.row?.type === 'FIXED_AMOUNT' ? `₹${params.row?.value}` : `${params.row?.value}%`}
        </Typography>
      )
    },
    {
      field: 'targeting',
      headerName: 'Targeting Type',
      flex: 1.2,
      renderCell: (params) => {
        const type = params.row?.targeting?.type;
        return (
          <Stack direction="row" spacing={1}>
            {type === 'ALL' && <Chip size="small" label="Public" variant="outlined" />}
            {type === 'GEOGRAPHIC' && (
              <Chip icon={<LocationOn style={{ fontSize: 14 }} />} size="small" label="Geo" color="primary" variant="outlined" />
            )}
            {type === 'PURCHASE_HISTORY' && (
              <Chip icon={<History style={{ fontSize: 14 }} />} size="small" label="Retarget" color="secondary" variant="outlined" />
            )}
          </Stack>
        );
      }
    },
    {
      field: 'usage',
      headerName: 'Redemptions',
      flex: 1,
      renderCell: (params) => (
        <Tooltip title="Current / Max Limit">
          <Typography variant="body2">
            {params.row?.currentRedemptions || 0} / {params.row?.maxRedemptions || 0}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      renderCell: (params) => {
        const isLive = params.row?.isActive && !params.row?.isExpired;
        return (
          <Chip
            icon={isLive ? <CheckCircle /> : <ErrorOutline />}
            label={isLive ? 'LIVE' : 'OFF'}
            color={isLive ? 'success' : 'default'}
            size="small"
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Marketing Actions',
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            startIcon={<Campaign />}
            onClick={() => handleOpenCampaign(params.row)}
            sx={{ textTransform: 'none', borderRadius: 1.5 }}
          >
            Target Area
          </Button>
          <Button variant="outlined" size="small" onClick={() => navigate(`/admin/coupons/edit/${params.row?._id}`)}>
            Edit
          </Button>
        </Stack>
      )
    }
  ];

  return (
    <Box p={4} sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: '#2c3e50' }}>
            RK Electronics Coupons
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Target <strong>Jagruti-nagar</strong> or retarget <strong>AC Buyers</strong> from here.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/admin/coupons/create')}
          sx={{ height: 45, px: 3, borderRadius: 2, fontWeight: 'bold' }}
        >
          Create New Offer
        </Button>
      </Box>

      {/* DataGrid Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
        <Box height={650} width="100%">
          <DataGrid
            rows={coupons || []}
            columns={columns}
            getRowId={(row) => row._id || row.id}
            loading={isCouponLoading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f1f3f4',
                color: '#5f6368',
                fontWeight: 'bold'
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f3f4'
              }
            }}
          />
        </Box>
      </Paper>

      {/* Targeted Campaign Dialog Component */}
      {selectedCoupon && (
        <TargetedCampaignDialog
          open={isCampaignOpen}
          onClose={() => setIsCampaignOpen(false)}
          coupon={selectedCoupon}
          onSend={handleSendCampaign}
        />
      )}
    </Box>
  );
};

export default CouponsDashboard;
