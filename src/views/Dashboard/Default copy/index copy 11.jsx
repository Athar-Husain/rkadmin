import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSalesAnalytics,
  fetchUserAnalytics,
  fetchStoreAnalytics,
  fetchCouponAnalytics
} from '../../../redux/features/Analytics/AnalyticsSlice';

import { Box, Grid, Paper, Typography, CircularProgress, Stack, Divider } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

/* =====================================================
   MAIN COMPONENT
===================================================== */

const AdminAnalyticsDashboard = () => {
  const dispatch = useDispatch();

  const { salesAnalytics, userAnalytics, storeAnalytics, couponAnalytics, isAnalyticsLoading } = useSelector((state) => state.analytics);

  console.log('salesAnalytics', salesAnalytics);
  console.log('userAnalytics', userAnalytics);
  console.log('storeAnalytics', storeAnalytics);
  console.log('couponAnalytics', couponAnalytics);

  const [dateRange] = useState({
    start: dayjs().subtract(30, 'day').toISOString(),
    end: dayjs().toISOString()
  });

  useEffect(() => {
    dispatch(fetchSalesAnalytics(dateRange));
    dispatch(fetchUserAnalytics());
    dispatch(fetchStoreAnalytics());
    dispatch(fetchCouponAnalytics());
  }, [dispatch]);

  /* =====================================================
     SALES TREND CHART
  ===================================================== */

  const salesChartOptions = useMemo(() => {
    if (!salesAnalytics?.trend) return {};

    return {
      chart: { type: 'area', toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: {
        categories: salesAnalytics.trend.map((d) => `${d._id.day}/${d._id.month}`)
      },
      colors: ['#1976d2'],
      dataLabels: { enabled: false },
      grid: { borderColor: '#eee' }
    };
  }, [salesAnalytics]);

  const salesChartSeries = [
    {
      name: 'Total Sales',
      data: salesAnalytics?.trend?.map((d) => d.totalSales) || []
    }
  ];

  /* =====================================================
     USER GROWTH CHART
  ===================================================== */

  const userChartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: {
      categories: userAnalytics?.userGrowth?.map((u) => `${u._id.month}/${u._id.year}`) || []
    },
    colors: ['#2e7d32']
  };

  const userChartSeries = [
    {
      name: 'New Users',
      data: userAnalytics?.userGrowth?.map((u) => u.newUsers) || []
    }
  ];

  /* =====================================================
     STORE PERFORMANCE GRID
  ===================================================== */

  const storeColumns = [
    { field: 'name', headerName: 'Store', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    { field: 'sales', headerName: 'Total Sales', flex: 1 },
    { field: 'transactions', headerName: 'Transactions', flex: 1 },
    { field: 'customers', headerName: 'Unique Customers', flex: 1 }
  ];

  const storeRows =
    storeAnalytics?.storePerformance?.map((s) => ({
      id: s.storeId,
      name: s.store.name,
      city: s.store.location.city,
      sales: `₹${s.totalSales}`,
      transactions: s.totalTransactions,
      customers: s.uniqueCustomersCount
    })) || [];

  if (isAnalyticsLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Analytics Overview
      </Typography>

      {/* ================= KPI SECTION ================= */}

      <Grid container spacing={3}>
        <KpiCard title="Total Sales" value={`₹${salesAnalytics?.summary?.totalSales || 0}`} />
        <KpiCard title="Transactions" value={salesAnalytics?.summary?.totalTransactions || 0} />
        <KpiCard title="Avg Transaction" value={`₹${salesAnalytics?.summary?.avgTransaction?.toFixed(2) || 0}`} />
        <KpiCard title="Active Coupons" value={couponAnalytics?.summary?.activeCoupons || 0} />
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* ================= SALES CHART ================= */}

      <Paper sx={{ p: 3, mb: 5, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Sales Trend
        </Typography>
        <Chart options={salesChartOptions} series={salesChartSeries} type="area" height={300} />
      </Paper>

      {/* ================= USER CHART ================= */}

      <Paper sx={{ p: 3, mb: 5, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          User Growth
        </Typography>
        <Chart options={userChartOptions} series={userChartSeries} type="bar" height={250} />
      </Paper>

      {/* ================= STORE TABLE ================= */}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Store Performance
        </Typography>
        <DataGrid
          rows={storeRows}
          columns={storeColumns}
          autoHeight
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } }
          }}
        />
      </Paper>
    </Box>
  );
};

/* =====================================================
   KPI CARD COMPONENT
===================================================== */

const MotionPaper = motion(Paper);

const KpiCard = ({ title, value }) => (
  <Grid item xs={12} sm={6} md={3}>
    <MotionPaper
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg,#1e3c72,#2a5298)',
        color: '#fff'
      }}
      elevation={4}
    >
      <Stack spacing={1}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
      </Stack>
    </MotionPaper>
  </Grid>
);

export default AdminAnalyticsDashboard;
