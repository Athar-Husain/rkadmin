import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Stack,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  useTheme,
  alpha,
  Button,
  Divider,
  Container
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import {
  PeopleAltTwoTone as PeopleIcon,
  ConfirmationNumberTwoTone as CouponIcon,
  BadgeTwoTone as StoreIcon,
  TrendingUpTwoTone as SalesIcon,
  NotificationsActiveTwoTone as NotificationIcon,
  LocalOfferTwoTone as DiscountIcon,
  LocalFireDepartmentTwoTone as HotIcon
} from '@mui/icons-material';
import { getDashboard } from '../../../redux/features/Admin/adminSlice';

// ==============================
// Reusable Metric Card
// ==============================
const MetricCard = ({ title, value, icon, color, subtitle }) => (
  <Card
    sx={{
      p: 2.5,
      borderRadius: '20px',
      border: '1px solid #F1F4F9',
      boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
      bgcolor: '#fff',
      height: '100%'
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar
        sx={{
          bgcolor: alpha(color, 0.1),
          color: color,
          width: 56,
          height: 56,
          borderRadius: '16px'
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={900} color="#1B2559">
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="success.main" fontWeight={700}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  </Card>
);

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { Admin, dashboard, dashboardLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  if (dashboardLoading) return <Typography sx={{ p: 4 }}>Loading dashboard...</Typography>;

  if (!dashboard?.dashboard) return <Typography sx={{ p: 4 }}>No dashboard data available.</Typography>;

  const { overview, trends, quickStats } = dashboard.dashboard;

  // ==============================
  // Derived Data
  // ==============================
  const totalRevenue = overview.totalRevenue || 0;
  const totalUsers = overview.totalUsers || 0;
  const activeCoupons = overview.activeCoupons || 0;
  const totalStores = overview.totalStores || 0;

  const topProducts = trends.topProducts || [];
  const cityDistribution = trends.cityDistribution || [];

  // ==============================
  // Chart Configuration (Top Products Revenue)
  // ==============================
  const chartOptions = {
    chart: { toolbar: { show: false } },
    colors: ['#4318FF'],
    stroke: { curve: 'smooth', width: 4 },
    xaxis: {
      categories: topProducts.map((p, i) => p.name || `Product ${i + 1}`)
    },
    grid: {
      borderColor: alpha(theme.palette.divider, 0.1),
      strokeDashArray: 5
    }
  };

  const chartSeries = [
    {
      name: 'Revenue',
      data: topProducts.map((p) => p.revenue || 0)
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* HEADER */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} color="#1B2559">
              Intelligence Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, <span style={{ color: '#4318FF', fontWeight: 700 }}>{Admin?.firstName || 'Admin'}</span>
            </Typography>
          </Box>
        </Stack>

        {/* METRICS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString()}`}
              icon={<SalesIcon />}
              color="#4318FF"
              subtitle={`User Growth: ${overview.userGrowth}`}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Platform Users" value={totalUsers} icon={<PeopleIcon />} color="#05CD99" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Active Coupons" value={activeCoupons} icon={<CouponIcon />} color="#FFB547" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Total Stores" value={totalStores} icon={<StoreIcon />} color="#6AD2FF" />
          </Grid>
        </Grid>

        {/* CHART + TOP PRODUCTS */}
        <Grid container spacing={3}>
          {/* Revenue Chart */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #E9EDF7' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={800} color="#1B2559">
                  Top Products Revenue
                </Typography>
                <Chip
                  label="Live Data"
                  size="small"
                  icon={<HotIcon />}
                  sx={{
                    fontWeight: 700,
                    bgcolor: alpha('#FFB547', 0.1),
                    color: '#FFB547'
                  }}
                />
              </Stack>

              <Chart options={chartOptions} series={chartSeries} type="area" height={350} />
            </Paper>
          </Grid>

          {/* Top Products List */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #E9EDF7' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Top Selling Products
              </Typography>

              <List disablePadding>
                {topProducts.map((product, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: '#F4F7FE',
                            color: '#4318FF',
                            fontWeight: 800
                          }}
                        >
                          {(product.name || 'P')[0]}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={<Typography fontWeight={700}>{product.name || 'Unnamed Product'}</Typography>}
                        secondary={
                          <Typography variant="caption">
                            {product.quantity} sold • ₹{product.revenue}
                          </Typography>
                        }
                      />
                    </ListItem>

                    {index < topProducts.length - 1 && <Divider sx={{ opacity: 0.4 }} />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #E9EDF7' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
                Quick Stats
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <MetricCard
                    title="Avg Transaction"
                    value={`₹${quickStats.avgTransaction?.toFixed(2) || 0}`}
                    icon={<SalesIcon />}
                    color="#05CD99"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <MetricCard title="Redemption Rate" value={`${quickStats.redemptionRate || 0}%`} icon={<CouponIcon />} color="#FFB547" />
                </Grid>

                <Grid item xs={12} md={4}>
                  <MetricCard
                    title="User Activation"
                    value={`${quickStats.userActivation?.toFixed(1) || 0}%`}
                    icon={<PeopleIcon />}
                    color="#4318FF"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* City Distribution */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #E9EDF7' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                City Distribution
              </Typography>

              <Stack direction="row" spacing={3} flexWrap="wrap">
                {cityDistribution.map((city, index) => (
                  <Chip key={index} label={`City ID: ${city._id} • ${city.users} users`} sx={{ mb: 1 }} />
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* System Health */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #E9EDF7' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                System Health
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: alpha('#4318FF', 0.1), color: '#4318FF' }}>
                      <NotificationIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={800}>{overview.todayRedemptions}</Typography>
                      <Typography variant="caption">Today Redemptions</Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={6}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: alpha('#EE5D50', 0.1), color: '#EE5D50' }}>
                      <DiscountIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={800}>{overview.todayDiscounts}</Typography>
                      <Typography variant="caption">Today Discounts</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
