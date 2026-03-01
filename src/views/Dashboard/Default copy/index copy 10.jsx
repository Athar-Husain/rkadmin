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
  Divider
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ApexCharts from 'react-apexcharts';

// Icons
import {
  PeopleAltTwoTone as PeopleIcon,
  ConfirmationNumberTwoTone as CampaignIcon,
  ShoppingBagTwoTone as RedemptionIcon,
  TrendingUp as TrendingIcon,
  NotificationsActiveTwoTone as NotificationIcon,
  ErrorOutlineTwoTone as ErrorIcon,
  GroupWorkTwoTone as PrivateIcon,
  ShareTwoTone as ReferralIcon,
  ArrowForwardRounded as ArrowIcon
} from '@mui/icons-material';
import {
  fetchCouponAnalytics,
  fetchSalesAnalytics,
  fetchStoreAnalytics,
  fetchUserAnalytics
} from '../../../redux/features/Analytics/AnalyticsSlice';

// Secondary KPI Card
const MiniMetricCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      bgcolor: '#fff',
      border: '1px solid #E9EDF7',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
        transform: 'translateY(-2px)'
      }
    }}
  >
    <Avatar
      sx={{
        bgcolor: alpha(color, 0.1),
        color: color,
        width: 42,
        height: 42,
        borderRadius: '10px'
      }}
    >
      {icon}
    </Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="h6" fontWeight={800} color="#1B2559">
        {value}
      </Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.Dashboard || {});
  const { Admin } = useSelector((state) => state.admin || {});

  // Fallback Data (Until API Connects)
  const data = stats || {
    totalUsers: 1280,
    activeCampaigns: 6,
    totalRedemptions: 342,
    redemptionRate: 18.4,
    notificationsSent: 4520,
    failedNotifications: 120,
    privateCampaigns: 2,
    referralCampaigns: 1,
    redemptionTrend: [12, 22, 18, 35, 40, 65, 80],
    topCampaigns: [
      { name: 'TV Fest Offer', redemptions: 120, rate: 24 },
      { name: 'AC Summer Sale', redemptions: 95, rate: 18 }
    ],
    recentRedemptions: [
      { id: 1, user: 'Ravi Kumar', code: 'TV500', category: 'TV', time: '5m ago' },
      { id: 2, user: 'Sneha Rao', code: 'AC2000', category: 'AC', time: '20m ago' }
    ],
    recentActivities: [
      { id: 1, title: 'Campaign TV500 Activated', time: '10m ago' },
      { id: 2, title: 'CSV Upload Processed (250 Users)', time: '45m ago' },
      { id: 3, title: 'AC Summer Sale Paused', time: '2h ago' }
    ]
  };

  const chartOptions = {
    chart: { toolbar: { show: false } },
    colors: ['#4318FF'],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      axisBorder: { show: false }
    },
    grid: {
      borderColor: alpha(theme.palette.divider, 0.1),
      strokeDashArray: 4
    }
  };

  useEffect(() => {
    dispatch(fetchSalesAnalytics());
    dispatch(fetchUserAnalytics());
    dispatch(fetchCouponAnalytics());
    dispatch(fetchStoreAnalytics());
  }, [dispatch]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#1B2559">
            Campaign Intelligence Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Performance overview for <b>{Admin?.firstName || 'Admin'}</b>
          </Typography>
        </Box>
        <Chip
          label="System Operational"
          sx={{
            bgcolor: '#fff',
            fontWeight: 700,
            borderRadius: '10px',
            border: '1px solid #E9EDF7'
          }}
        />
      </Stack>

      {/* Tier 1 - Primary KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Users', value: data.totalUsers, icon: <PeopleIcon />, color: '#4318FF' },
          { title: 'Active Campaigns', value: data.activeCampaigns, icon: <CampaignIcon />, color: '#05CD99' },
          { title: 'Total Redemptions', value: data.totalRedemptions, icon: <RedemptionIcon />, color: '#FFB547' },
          { title: 'Redemption Rate', value: `${data.redemptionRate}%`, icon: <TrendingIcon />, color: '#6AD2FF' }
        ].map((kpi, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: '20px',
                border: '1px solid #F1F4F9',
                boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: '#F4F7FE',
                    color: kpi.color,
                    width: 56,
                    height: 56,
                    borderRadius: '15px'
                  }}
                >
                  {kpi.icon}
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    {kpi.title}
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="#1B2559">
                    {kpi.value}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tier 2 - Notification Metrics */}
      <Typography variant="subtitle1" fontWeight={800} color="#1B2559" sx={{ mb: 2, ml: 1 }}>
        Campaign & Notification Overview
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniMetricCard title="Notifications Sent" value={data.notificationsSent} icon={<NotificationIcon />} color="#4318FF" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniMetricCard title="Failed Deliveries" value={data.failedNotifications} icon={<ErrorIcon />} color="#EE5D50" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniMetricCard title="Private Campaigns" value={data.privateCampaigns} icon={<PrivateIcon />} color="#6AD2FF" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniMetricCard title="Referral Campaigns" value={data.referralCampaigns} icon={<ReferralIcon />} color="#05CD99" />
        </Grid>
      </Grid>

      {/* Tier 3 - Charts & Lists */}
      <Grid container spacing={3}>
        {/* Redemption Trend */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3, borderRadius: '24px' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
              Coupon Redemptions Trend
            </Typography>
            <ApexCharts options={chartOptions} series={[{ name: 'Redemptions', data: data.redemptionTrend }]} type="area" height={320} />
          </Paper>
        </Grid>

        {/* Top Campaigns */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3, borderRadius: '24px', height: '100%' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              Top Performing Campaigns
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {data.topCampaigns.map((campaign, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    borderRadius: '15px',
                    border: '1px solid #E9EDF7'
                  }}
                >
                  <Typography fontWeight={700}>{campaign.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {campaign.redemptions} used • {campaign.rate}% success
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Redemptions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: '24px' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={800}>
                Recent Redemptions
              </Typography>
              <Button size="small" endIcon={<ArrowIcon />}>
                View All
              </Button>
            </Stack>
            <List disablePadding>
              {data.recentRedemptions.map((item) => (
                <ListItem key={item.id} divider sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#F4F7FE', color: '#4318FF', fontWeight: 700 }}>{item.user[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography fontWeight={700}>{item.user}</Typography>}
                    secondary={`Used ${item.code} on ${item.category}`}
                  />
                  <Chip label={item.time} size="small" variant="outlined" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Campaign Activity */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: '24px' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              Campaign Activity
            </Typography>
            <List disablePadding>
              {data.recentActivities.map((log) => (
                <ListItem key={log.id} sx={{ px: 0 }}>
                  <ListItemText primary={<Typography fontWeight={600}>{log.title}</Typography>} secondary={log.time} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
