import React from 'react';
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
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';

// Icons
import {
  PeopleAltTwoTone as PeopleIcon,
  ConfirmationNumberTwoTone as CouponIcon,
  BadgeTwoTone as StaffIcon,
  TrendingUpTwoTone as SalesIcon,
  NotificationsActiveTwoTone as NotificationIcon,
  ErrorOutlineTwoTone as ErrorIcon,
  HistoryRounded as ActivityIcon,
  ArrowForwardRounded as ArrowIcon,
  LocalFireDepartmentTwoTone as HotIcon
} from '@mui/icons-material';

// --- Reusable Glass Metric Card ---
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
  const { stats } = useSelector((state) => state.Dashboard || {});
  const { Admin } = useSelector((state) => state.admin || {});

  // Integrated Data Object
  const data = stats || {
    revenue: '₹8,42,000',
    totalUsers: 1280,
    activeCoupons: 8,
    staffOnline: 5,
    notificationsSent: 4520,
    failedTasks: 12,
    salesTrend: [30, 40, 35, 50, 49, 60, 70, 91],
    topCoupons: [
      { code: 'FESTIVE50', usage: 450, impact: '₹1.2L' },
      { code: 'FIRSTBUY', usage: 210, impact: '₹45K' }
    ],
    recentLogs: [
      { id: 1, user: 'Rahul S.', action: 'Updated Stock', target: 'iPhone 15', time: '5m ago' },
      { id: 2, user: 'Priya K.', action: 'Created Coupon', target: 'WINTER20', time: '22m ago' },
      { id: 3, user: 'System', action: 'Auto-Backup', target: 'Database', time: '1h ago' }
    ]
  };

  const chartOptions = {
    chart: { toolbar: { show: false }, dropShadow: { enabled: true, top: 10, left: 0, blur: 4, opacity: 0.1 } },
    colors: ['#4318FF'],
    stroke: { curve: 'smooth', width: 4 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.1, stops: [0, 90, 100] }
    },
    markers: { size: 5, colors: ['#4318FF'], strokeColors: '#fff', strokeWidth: 2 },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    grid: { borderColor: alpha(theme.palette.divider, 0.1), strokeDashArray: 5 }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* HEADER SECTION */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} color="#1B2559" letterSpacing="-1px">
              Intelligence Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              Welcome back, <span style={{ color: '#4318FF', fontWeight: 700 }}>{Admin?.firstName || 'Chief Admin'}</span>. Here's your
              store's status.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="white" sx={{ bgcolor: '#fff', borderRadius: '12px', fontWeight: 700, px: 3, border: '1px solid #E9EDF7' }}>
              Export Report
            </Button>
            <Button variant="contained" sx={{ bgcolor: '#4318FF', borderRadius: '12px', fontWeight: 700, px: 3 }}>
              System Settings
            </Button>
          </Stack>
        </Stack>

        {/* TIER 1: PRIMARY FINANCIALS & USERS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Total Revenue" value={data.revenue} icon={<SalesIcon />} color="#4318FF" subtitle="+12.5% vs last week" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Platform Users" value={data.totalUsers} icon={<PeopleIcon />} color="#05CD99" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Active Coupons" value={data.activeCoupons} icon={<CouponIcon />} color="#FFB547" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Online Staff" value={data.staffOnline} icon={<StaffIcon />} color="#6AD2FF" />
          </Grid>
        </Grid>

        {/* TIER 2: ANALYTICS & ACTIVITY LOGS */}
        <Grid container spacing={3}>
          {/* Main Chart Card */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #E9EDF7', boxShadow: 'none' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#1B2559">
                    Revenue Analytics
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sales performance across the current week
                  </Typography>
                </Box>
                <Chip
                  label="Real-time Data"
                  size="small"
                  icon={<HotIcon sx={{ fontSize: '14px !important' }} />}
                  sx={{ fontWeight: 700, bgcolor: alpha('#FFB547', 0.1), color: '#FFB547' }}
                />
              </Stack>
              <Chart options={chartOptions} series={[{ name: 'Sales', data: data.salesTrend }]} type="area" height={350} />
            </Paper>
          </Grid>

          {/* Activity Feed */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #E9EDF7', height: '100%' }}>
              <Typography variant="h6" fontWeight={800} color="#1B2559" sx={{ mb: 3 }}>
                Staff Operations
              </Typography>
              <List disablePadding>
                {data.recentLogs.map((log, index) => (
                  <React.Fragment key={log.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#F4F7FE', color: '#4318FF', fontWeight: 800, borderRadius: '10px' }}>{log.user[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={700}>
                            {log.user} • {log.action}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Modified {log.target} • {log.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < data.recentLogs.length - 1 && <Divider component="li" sx={{ opacity: 0.5 }} />}
                  </React.Fragment>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2, borderRadius: '10px', fontWeight: 700, textTransform: 'none' }}>
                View All Activity
              </Button>
            </Paper>
          </Grid>

          {/* TIER 3: MINI PERFORMANCE CARDS */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #E9EDF7' }}>
              <Typography variant="h6" fontWeight={800} color="#1B2559" sx={{ mb: 2 }}>
                Coupon High-Performers
              </Typography>
              <Stack spacing={2}>
                {data.topCoupons.map((c, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ p: 2, bgcolor: '#F4F7FE', borderRadius: '16px' }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: '8px', border: '1px dashed #CBD5E1', fontWeight: 800 }}>{c.code}</Box>
                      <Typography variant="body2" fontWeight={600}>
                        {c.usage} Redemptions
                      </Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight={800} color="success.main">
                      +{c.impact}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* System Health Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #E9EDF7' }}>
              <Typography variant="h6" fontWeight={800} color="#1B2559" sx={{ mb: 2 }}>
                System Health
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: alpha('#4318FF', 0.1), color: '#4318FF' }}>
                      <NotificationIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        {data.notificationsSent}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Push Sent
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: alpha('#EE5D50', 0.1), color: '#EE5D50' }}>
                      <ErrorIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        {data.failedTasks}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Failed Tasks
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: alpha('#05CD99', 0.05),
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: alpha('#05CD99', 0.2)
                }}
              >
                <Typography variant="caption" color="#05CD99" fontWeight={800}>
                  ● ALL SYSTEMS OPERATIONAL
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
