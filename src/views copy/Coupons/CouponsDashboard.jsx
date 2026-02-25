import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import Chart from 'react-apexcharts';
import { getCouponAnalyticsAdmin } from '../../redux/features/Coupons/CouponSlice';
// import { getCouponAnalyticsAdmin } from '../../store/slices/couponSlice';

const CouponDashboard = () => {
  const dispatch = useDispatch();
  const { analytics, isCouponLoading } = useSelector((state) => state.coupon);

  useEffect(() => {
    dispatch(getCouponAnalyticsAdmin());
  }, [dispatch]);

  // Transform data for charts
  const chartData = {
    series: analytics.map((item) => item.redemptions),
    options: {
      labels: analytics.map((item) => item.coupon.code),
      chart: { type: 'donut' },
      responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Coupon Analytics
      </Typography>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Coupons</Typography>
              <Typography variant="h3">{analytics.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Redemption Distribution Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Redemption per Coupon
            </Typography>
            <Chart options={chartData.options} series={chartData.series} type="donut" height={350} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CouponDashboard;
