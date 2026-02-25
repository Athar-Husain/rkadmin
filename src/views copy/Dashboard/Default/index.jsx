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
  IconButton
} from '@mui/material';
import { useSelector } from 'react-redux';
import ApexCharts from 'react-apexcharts';

// Icons
import {
  PeopleAltTwoTone as PeopleIcon,
  RouterTwoTone as RouterIcon,
  AccountBalanceWalletTwoTone as WalletIcon,
  ConfirmationNumberTwoTone as TicketIcon,
  MapTwoTone as MapIcon,
  TrendingUp as TrendingIcon,
  ErrorOutlineTwoTone as ErrorIcon,
  ShoppingBagTwoTone as PurchaseIcon,
  FlashOnTwoTone as SystemIcon,
  ArrowForwardRounded as ArrowIcon,
  GroupWorkTwoTone as TeamIcon,
  InventoryTwoTone as PlanIcon,
  ShareTwoTone as ReferralIcon,
  MoreVertRounded as MoreIcon
} from '@mui/icons-material';

// --- Secondary Mini KPI Component ---
const MiniResourceCard = ({ title, value, icon, color }) => (
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
      '&:hover': { boxShadow: '0 10px 20px rgba(0,0,0,0.05)', transform: 'translateY(-2px)' },
      transition: 'all 0.3s ease'
    }}
  >
    <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 42, height: 42, borderRadius: '10px' }}>
      {React.cloneElement(icon, { sx: { fontSize: 22 } })}
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
  const { stats, isLoading } = useSelector((state) => state.Dashboard || {});
  const { Admin } = useSelector((state) => state.admin || {});

  // Combined Data Object
  const data = stats || {
    totalCustomers: '1,280',
    revenue: '₹75,000',
    activeNodes: '980',
    pendingTickets: '12',
    totalTeam: '18',
    activePlans: '08',
    referrals: '142',
    totalAreas: '24',
    outages: ['Fire Station', 'Durgamma Gudi'],
    recentPurchases: [
      { id: 1, user: 'Amit Sharma', plan: 'Gold Unlimited', time: '2m ago' },
      { id: 2, user: 'Sneha Rao', plan: 'Fiber Pro', time: '15m ago' },
      { id: 3, user: 'John Doe', plan: 'Enterprise 1GB', time: '1h ago' }
    ]
  };

  const chartOptions = {
    chart: { toolbar: { show: false }, sparkline: { enabled: false } },
    colors: ['#4318FF'],
    stroke: { curve: 'smooth', width: 3 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], axisBorder: { show: false } },
    yaxis: { labels: { show: false } },
    grid: { borderColor: alpha(theme.palette.divider, 0.1), strokeDashArray: 4 }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      {/* 1. Header Area */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#1B2559">
            Command Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Systems overview for <b>{Admin?.firstName || 'Admin'}</b>
          </Typography>
        </Box>
        <Chip
          label={data.outages.length > 0 ? 'System Alert' : 'System Healthy'}
          onDelete={() => {}}
          deleteIcon={
            <Box
              className={data.outages.length > 0 ? 'pulse-red' : 'pulse-green'}
              sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: data.outages.length > 0 ? '#EE5D50' : '#05CD99' }}
            />
          }
          sx={{ bgcolor: '#fff', fontWeight: 700, p: 1, borderRadius: '10px', border: '1px solid #E9EDF7' }}
        />
      </Stack>

      {/* 2. Tier 1: Primary KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Revenue', value: data.revenue, icon: <WalletIcon />, color: '#4318FF', trend: 8.2 },
          { title: 'Total Customers', value: data.totalCustomers, icon: <PeopleIcon />, color: '#6AD2FF', trend: 12 },
          { title: 'Active Nodes', value: data.activeNodes, icon: <RouterIcon />, color: '#05CD99', trend: 2.4 },
          { title: 'Operational Areas', value: data.totalAreas, icon: <MapIcon />, color: '#FFB547', trend: 0 }
        ].map((kpi, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card sx={{ p: 2.5, borderRadius: '20px', border: '1px solid #F1F4F9', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: '#F4F7FE', color: kpi.color, width: 56, height: 56, borderRadius: '15px' }}>{kpi.icon}</Avatar>
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

      {/* 3. Tier 2: Secondary Resource Metrics (The missing cards) */}
      <Typography variant="subtitle1" fontWeight={800} color="#1B2559" sx={{ mb: 2, ml: 1 }}>
        Resource Overview
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniResourceCard title="Team Members" value={data.totalTeam} icon={<TeamIcon />} color="#4318FF" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniResourceCard title="Active Plans" value={data.activePlans} icon={<PlanIcon />} color="#05CD99" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniResourceCard title="Referrals" value={data.referrals} icon={<ReferralIcon />} color="#6AD2FF" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MiniResourceCard title="Support Tickets" value={data.pendingTickets} icon={<TicketIcon />} color="#EE5D50" />
        </Grid>
      </Grid>

      {/* 4. Tier 3: Charts & Feeds */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3, borderRadius: '24px', border: 'none', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
              Revenue Growth Trend
            </Typography>
            <ApexCharts
              options={chartOptions}
              series={[{ name: 'Revenue', data: [31, 40, 28, 51, 42, 109, 100] }]}
              type="area"
              height={320}
            />
          </Paper>
        </Grid>

        {/* Network Alerts */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3, borderRadius: '24px', height: '100%' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorIcon color="error" /> Outage Monitor
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {data.outages.length > 0 ? (
                data.outages.map((outage, i) => (
                  <Box key={i} sx={{ p: 2, bgcolor: '#FFF5F5', borderRadius: '15px', border: '1px solid #FFE5E5' }}>
                    <Typography fontWeight={700} color="#EE5D50">
                      {outage}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Connectivity issue detected via Node Cluster B
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 5, opacity: 0.5 }}>
                  <Typography>No alerts today</Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Purchases (From your file) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: '24px' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={800}>
                Recent Plan Purchases
              </Typography>
              <Button size="small" endIcon={<ArrowIcon />}>
                View All
              </Button>
            </Stack>
            <List disablePadding>
              {data.recentPurchases.map((item) => (
                <ListItem key={item.id} divider sx={{ py: 1.5, px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#F4F7FE', color: '#4318FF', fontWeight: 700 }}>{item.user[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography fontWeight={700}>{item.user}</Typography>} secondary={`Purchased ${item.plan}`} />
                  <Chip label={item.time} size="small" variant="outlined" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* System Activity Feed (From your file) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: '24px' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              System Logs
            </Typography>
            <List disablePadding>
              {[
                { title: 'Version 2.4 Deployed', time: '2m ago', color: '#05CD99', icon: <SystemIcon /> },
                { title: 'Server Migration', time: '45m ago', color: '#4318FF', icon: <TrendingIcon /> },
                { title: 'Security Patch', time: '3h ago', color: '#FFB547', icon: <ErrorIcon /> }
              ].map((log, i) => (
                <ListItem key={i} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: alpha(log.color, 0.1), color: log.color }}>
                      <ArrowIcon sx={{ transform: 'rotate(-45deg)' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography fontWeight={600}>{log.title}</Typography>} secondary={log.time} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Pulse Animations */}
      <style>
        {`
                    @keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(238, 93, 80, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(238, 93, 80, 0); } 100% { box-shadow: 0 0 0 0 rgba(238, 93, 80, 0); } }
                    @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(5, 205, 153, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(5, 205, 153, 0); } 100% { box-shadow: 0 0 0 0 rgba(5, 205, 153, 0); } }
                    .pulse-red { animation: pulse-red 2s infinite; }
                    .pulse-green { animation: pulse-green 2s infinite; }
                `}
      </style>
    </Box>
  );
};

export default Dashboard;
