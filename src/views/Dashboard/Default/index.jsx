import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSalesAnalytics,
  fetchUserAnalytics,
  fetchStoreAnalytics,
  fetchCouponAnalytics
} from '../../../redux/features/Analytics/AnalyticsSlice';

import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Divider,
  IconButton,
  Tooltip as MuiTooltip,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import { TrendingUp, People, Storefront, LocalActivity, MoreVert, FileDownload, Assessment } from '@mui/icons-material';

import { DataGrid } from '@mui/x-data-grid';
import Chart from 'react-apexcharts';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { salesAnalytics, userAnalytics, storeAnalytics, couponAnalytics } = useSelector((state) => state.analytics);

  const [dateRange] = useState({
    start: dayjs().subtract(30, 'day').toISOString(),
    end: dayjs().toISOString()
  });

  useEffect(() => {
    dispatch(fetchSalesAnalytics(dateRange));
    dispatch(fetchUserAnalytics());
    dispatch(fetchStoreAnalytics());
    dispatch(fetchCouponAnalytics());
  }, [dispatch, dateRange]);

  const isReady = salesAnalytics && userAnalytics && storeAnalytics && couponAnalytics;

  /* ================= CHARTS CONFIG ================= */

  const salesTrendConfig = useMemo(
    () => ({
      series: [{ name: 'Revenue', data: salesAnalytics?.trend?.map((d) => d.totalSales) || [] }],
      options: {
        chart: { type: 'area', sparkline: { enabled: false }, toolbar: { show: false } },
        colors: [theme.palette.primary.main],
        fill: {
          type: 'gradient',
          gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [20, 100] }
        },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories: salesAnalytics?.trend?.map((d) => `${d._id.day}/${d._id.month}`) || [] },
        yaxis: { labels: { formatter: (val) => `₹${(val / 1000).toFixed(1)}k` } },
        dataLabels: { enabled: false },
        tooltip: { theme: 'light', x: { show: true } }
      }
    }),
    [salesAnalytics, theme]
  );

  const userStatusConfig = useMemo(
    () => ({
      series: userAnalytics?.userStatus?.map((s) => s.count) || [],
      options: {
        labels: ['Purchased', 'Lead/Browsing'],
        colors: [theme.palette.success.main, theme.palette.info.main],
        legend: { position: 'bottom' },
        plotOptions: { pie: { donut: { size: '75%' } } },
        dataLabels: { enabled: false }
      }
    }),
    [userAnalytics, theme]
  );

  /* ================= STORE DATA ================= */

  const storeColumns = [
    {
      field: 'name',
      headerName: 'Store Name',
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: theme.palette.primary.light, width: 32, height: 32, fontSize: '0.8rem' }}>{params.value.charAt(0)}</Avatar>
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Stack>
      )
    },
    { field: 'city', headerName: 'City', flex: 1 },
    {
      field: 'sales',
      headerName: 'Revenue',
      flex: 1,
      renderCell: (p) => (
        <Typography variant="body2" color="primary.main" fontWeight={700}>
          {p.value}
        </Typography>
      )
    },
    { field: 'customers', headerName: 'Customers', flex: 0.8, align: 'center' },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: () => <Chip label="Operational" size="small" color="success" variant="outlined" />
    }
  ];

  const storeRows = useMemo(
    () =>
      storeAnalytics?.storePerformance?.map((s) => ({
        id: s.storeId,
        name: s.store?.name || 'Unknown',
        city: s.store?.location?.city || 'N/A',
        sales: `₹${s.totalSales.toLocaleString()}`,
        customers: s.uniqueCustomersCount
      })) || [],
    [storeAnalytics]
  );

  if (!isReady)
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress thickness={4} size={50} />
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Preparing your data...
        </Typography>
      </Box>
    );

  return (
    <Box p={{ xs: 2, md: 5 }} bgcolor="#f8fafc" minHeight="100vh">
      {/* HEADER SECTION */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={5}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="slate.900" gutterBottom>
            Executive Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Insights for the period:{' '}
            <span style={{ fontWeight: 600 }}>
              {dayjs(dateRange.start).format('MMM D')} - {dayjs(dateRange.end).format('MMM D, YYYY')}
            </span>
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <IconButton sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
            <FileDownload />
          </IconButton>
          <IconButton sx={{ bgcolor: theme.palette.primary.main, color: '#fff', '&:hover': { bgcolor: theme.palette.primary.dark } }}>
            <Assessment />
          </IconButton>
        </Stack>
      </Stack>

      {/* KPI GRID */}
      <Grid container spacing={3} mb={5}>
        <KpiCard
          title="Gross Revenue"
          value={`₹${salesAnalytics.summary.totalSales.toLocaleString()}`}
          icon={<TrendingUp />}
          color="#6366f1"
        />
        <KpiCard title="Total Customers" value={userAnalytics.totalUsers} icon={<People />} color="#10b981" />
        <KpiCard
          title="Avg. Order Value"
          value={`₹${Math.round(salesAnalytics.summary.avgTransaction)}`}
          icon={<Storefront />}
          color="#f59e0b"
        />
        <KpiCard title="Coupon Redemptions" value={couponAnalytics.totalRedemptions} icon={<LocalActivity />} color="#ec4899" />
      </Grid>

      <Grid container spacing={4}>
        {/* MAIN REVENUE CHART */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
            <Stack direction="row" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={700}>
                Revenue Trajectory
              </Typography>
              <MuiTooltip title="Options">
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </MuiTooltip>
            </Stack>
            <Chart options={salesTrendConfig.options} series={salesTrendConfig.series} type="area" height={350} />
          </Paper>
        </Grid>

        {/* CUSTOMER SEGMENTATION */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Customer Conversion
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" height={280}>
              <Chart options={userStatusConfig.options} series={userStatusConfig.series} type="donut" width="100%" />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                Refining marketing spend based on active browsing count (10) vs conversion count (1).
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* STORE PERFORMANCE TABLE */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Branch Performance Benchmarking
            </Typography>
            <Box sx={{ width: '100%', height: 400 }}>
              <DataGrid
                rows={storeRows}
                columns={storeColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': { bgcolor: '#f1f5f9', borderRadius: 2 },
                  '& .MuiDataGrid-cell:focus': { outline: 'none' }
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

/* --- ENHANCED KPI CARD COMPONENT --- */
const KpiCard = ({ title, value, icon, color }) => (
  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, position: 'relative', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Stack>
            <Typography variant="caption" fontWeight={600} color="text.secondary" textTransform="uppercase" letterSpacing={1}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 1, color: '#1e293b' }}>
              {value}
            </Typography>
          </Stack>
          <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 48, height: 48, borderRadius: 3 }}>{icon}</Avatar>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '4px', height: '100%', bgcolor: color }} />
      </Paper>
    </motion.div>
  </Grid>
);

export default Dashboard;
