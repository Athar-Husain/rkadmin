// src/pages/Default.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import ApexCharts from 'react-apexcharts';

// Icons
import GroupTwoToneIcon from '@mui/icons-material/GroupTwoTone';
import RouterTwoToneIcon from '@mui/icons-material/RouterTwoTone';
import ConfirmationNumberTwoToneIcon from '@mui/icons-material/ConfirmationNumberTwoTone';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// KPI Card Component for reuse and clean code
const KPICard = ({ title, value, trend, icon, color }) => {
  const theme = useTheme();
  const isPositive = trend > 0;

  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 4,
        height: '100%',
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1A1C1E' }}>
            {value}
          </Typography>
          {trend && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
              <TrendingUpIcon
                sx={{
                  fontSize: 16,
                  color: isPositive ? 'success.main' : 'error.main',
                  transform: isPositive ? 'none' : 'rotate(180deg)'
                }}
              />
              <Typography variant="caption" fontWeight={700} color={isPositive ? 'success.main' : 'error.main'}>
                {isPositive ? '+' : ''}
                {trend}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {' '}
                vs last month
              </Typography>
            </Stack>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette[color].main, 0.1),
            color: theme.palette[color].main,
            width: 50,
            height: 50,
            borderRadius: 3
          }}
        >
          {icon}
        </Avatar>
      </Stack>
      {/* Subtle background decoration */}
      <Box
        sx={{
          position: 'absolute',
          right: -10,
          bottom: -10,
          opacity: 0.03,
          transform: 'rotate(-20deg)'
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 80 } })}
      </Box>
    </Card>
  );
};

const Default = () => {
  const theme = useTheme();

  // Revenue Trend Data (Area Chart)
  const revenueChartOptions = {
    chart: { id: 'revenue-trend', toolbar: { show: false }, sparkline: { enabled: false } },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], axisBorder: { show: false } },
    yaxis: { labels: { show: false } },
    grid: { borderColor: alpha(theme.palette.divider, 0.1), strokeDashArray: 4 }
  };

  const leadSourcesOptions = {
    labels: ['Organic', 'Ads', 'Referral', 'Direct'],
    colors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.success.main],
    plotOptions: { pie: { donut: { size: '75%', labels: { show: true, total: { show: true, label: 'Total Leads', fontSize: '14px' } } } } },
    legend: { position: 'bottom' },
    stroke: { show: false }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary">
          Command Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          System overview and real-time performance metrics.
        </Typography>
      </Box>

      {/* KPI Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="TOTAL CUSTOMERS" value="1,250" trend={12} color="primary" icon={<GroupTwoToneIcon />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="ACTIVE NODES" value="980" trend={2.4} color="success" icon={<RouterTwoToneIcon />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="PENDING TICKETS" value="45" trend={-5} color="error" icon={<ConfirmationNumberTwoToneIcon />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="MONTHLY REVENUE" value="₹75,000" trend={8.1} color="secondary" icon={<AccountBalanceWalletTwoToneIcon />} />
        </Grid>
      </Grid>

      {/* Middle Section: Main Analytics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #EFF2F5', boxShadow: 'none' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                Revenue Growth
              </Typography>
              <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 32, height: 32 }}>
                <TrendingUpIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
              </Avatar>
            </Stack>
            <ApexCharts
              options={revenueChartOptions}
              series={[{ name: 'Revenue', data: [31, 40, 28, 51, 42, 109, 100] }]}
              type="area"
              height={320}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #EFF2F5', boxShadow: 'none', height: '100%' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Lead Attribution
            </Typography>
            <Box sx={{ mt: 4 }}>
              <ApexCharts options={leadSourcesOptions} series={[44, 25, 13, 18]} type="donut" height={320} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section: Operations */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ borderRadius: 4, border: '1px solid #EFF2F5', boxShadow: 'none' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #F1F4F9' }}>
              <Typography variant="h6" fontWeight={700}>
                Live Network Activity
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {[
                {
                  label: 'System Update',
                  sub: 'Version 2.4 deployment successful',
                  time: '2m ago',
                  color: 'success',
                  icon: <FlashOnIcon fontSize="small" />
                },
                {
                  label: 'Node Outage',
                  sub: 'Connection lost in Sector-7',
                  time: '14m ago',
                  color: 'error',
                  icon: <ErrorOutlineIcon fontSize="small" />
                },
                {
                  label: 'New Lead',
                  sub: 'High priority lead from Website',
                  time: '1h ago',
                  color: 'info',
                  icon: <TrendingUpIcon fontSize="small" />
                }
              ].map((activity, i) => (
                <ListItem key={i} divider={i !== 2} sx={{ py: 2 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: alpha(theme.palette[activity.color].main, 0.1), color: theme.palette[activity.color].main }}>
                      {activity.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={<Typography fontWeight={600}>{activity.label}</Typography>} secondary={activity.sub} />
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions / Summary Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #2363faff 0%, #99b6ffff 100%)',
              color: 'white',
              borderRadius: 4,
              p: 3,
              height: '100%'
            }}
          >
            <Typography variant="h5" fontWeight={700} gutterBottom>
              System Health
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 4 }}>
              All systems are currently operational. No scheduled maintenance for the next 48 hours.
            </Typography>
            <Divider sx={{ borderColor: alpha('#fff', 0.1), mb: 3 }} />
            <Grid container spacing={2}>
              <Grid size={{xs:6}}>
                <Typography variant="h4" fontWeight={800}>
                  99.9%
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Uptime
                </Typography>
              </Grid>
              <Grid size={{xs:6}}>
                <Typography variant="h4" fontWeight={800}>
                  12ms
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Latency
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Default;
