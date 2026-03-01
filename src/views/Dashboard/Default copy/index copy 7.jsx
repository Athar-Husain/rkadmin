import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Card, Typography, Stack, Avatar, CircularProgress, Paper, Divider, MenuItem, TextField } from '@mui/material';
import { TrendingUp, People, ConfirmationNumber, ShoppingCart } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import ApexCharts from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminDashboard } from '../../../redux/features/Admin/adminSlice';

// ===============================
// KPI Card Component
// ===============================
const KPI = ({ title, value, icon, color }) => (
  <Card
    sx={{
      p: 3,
      borderRadius: 4,
      boxShadow: '0px 10px 30px rgba(0,0,0,0.05)'
    }}
  >
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar sx={{ bgcolor: `${color}20`, color }}>{icon}</Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {value ?? 0}
        </Typography>
      </Box>
    </Stack>
  </Card>
);

// ===============================
// Dashboard Component
// ===============================
const Dashboard = () => {
  const dispatch = useDispatch();

  const { dashboard, dashboardLoading } = useSelector((state) => state.admin);

  const [startDate, setStartDate] = useState(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState(dayjs());
  const [storeId, setStoreId] = useState('');

  // ===============================
  // Fetch Dashboard Data
  // ===============================
  useEffect(() => {
    dispatch(
      getAdminDashboard({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        storeId
      })
    );
  }, [dispatch, startDate, endDate, storeId]);

  // ===============================
  // Revenue Chart Data
  // ===============================
  const revenueSeries = useMemo(() => {
    if (!dashboard?.revenueTrend?.length) return [];

    return [
      {
        name: 'Revenue',
        data: dashboard.revenueTrend.map((r) => r.revenue || 0)
      }
    ];
  }, [dashboard]);

  const revenueOptions = useMemo(
    () => ({
      chart: { type: 'area', toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 3 },
      colors: ['#4318FF'],
      xaxis: {
        categories: dashboard?.revenueTrend?.map((r) => `${r?._id?.month}/${r?._id?.year}`) || []
      },
      fill: {
        type: 'gradient',
        gradient: { opacityFrom: 0.4, opacityTo: 0.05 }
      }
    }),
    [dashboard]
  );

  // ===============================
  // Loading State
  // ===============================
  if (dashboardLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!dashboard) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6" color="text.secondary">
          No dashboard data available.
        </Typography>
      </Box>
    );
  }

  // ===============================
  // Render
  // ===============================
  return (
    <Box sx={{ p: 4, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={800}>
          Enterprise Analytics Dashboard
        </Typography>

        <Stack direction="row" spacing={2}>
          <DatePicker label="Start Date" value={startDate} onChange={(val) => setStartDate(val)} />
          <DatePicker label="End Date" value={endDate} onChange={(val) => setEndDate(val)} />
          <TextField select label="Store" value={storeId} onChange={(e) => setStoreId(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="">All Stores</MenuItem>
            {dashboard?.topStores?.map((store) => (
              <MenuItem key={store?._id} value={store?._id}>
                {store?.storeName}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Stack>

      {/* KPI Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <KPI
            title="Total Revenue"
            value={`₹${dashboard?.revenueStats?.totalRevenue?.toFixed?.(2) || 0}`}
            icon={<TrendingUp />}
            color="#4318FF"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <KPI title="Total Orders" value={dashboard?.revenueStats?.totalOrders || 0} icon={<ShoppingCart />} color="#05CD99" />
        </Grid>

        <Grid item xs={12} md={3}>
          <KPI title="Active Users" value={dashboard?.activeUsers || 0} icon={<People />} color="#FFB547" />
        </Grid>

        <Grid item xs={12} md={3}>
          <KPI title="Active Coupons" value={dashboard?.activeCoupons || 0} icon={<ConfirmationNumber />} color="#EE5D50" />
        </Grid>
      </Grid>

      {/* Revenue Trend + Top Stores */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" mb={2} fontWeight={700}>
              Revenue Trend
            </Typography>
            <ApexCharts options={revenueOptions} series={revenueSeries} type="area" height={350} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" mb={2} fontWeight={700}>
              Top Performing Stores
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {dashboard?.topStores?.map((store) => (
              <Box key={store?._id} mb={2}>
                <Typography fontWeight={600}>{store?.storeName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Revenue: ₹{store?.revenue?.toFixed?.(2) || 0} | Orders: {store?.orders || 0}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Coupon + Referral */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" mb={2} fontWeight={700}>
              Coupon Performance
            </Typography>
            {dashboard?.couponRedemption?.map((c, i) => (
              <Box key={i} mb={1}>
                <Typography>Redemption Rate: {c?.redemptionRate?.toFixed?.(2) || 0}%</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" mb={2} fontWeight={700}>
              Referral Overview
            </Typography>
            {dashboard?.referralStats?.map((r, i) => (
              <Box key={i} mb={1}>
                <Typography>
                  {r?._id}: {r?.count}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Purchases */}
      <Paper sx={{ p: 3, borderRadius: 4, mt: 4 }}>
        <Typography variant="h6" mb={2} fontWeight={700}>
          Recent Purchases
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {dashboard?.recentPurchases?.map((p, index) => (
          <Box key={index} mb={2}>
            <Typography fontWeight={600}>
              {p?.userId?.firstName || 'User'} — ₹{p?.finalAmount || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Store: {p?.storeId?.name || 'N/A'}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default Dashboard;
