import React from 'react';
import { Box, Container, Grid, Chip, Typography, Paper, Stack, Avatar, Button, alpha, useTheme, Divider } from '@mui/material';
import {
  ConfirmationNumberTwoTone as CouponIcon,
  BadgeTwoTone as StaffIcon,
  TrendingUpTwoTone as SalesIcon,
  ShoppingCartTwoTone as OrderIcon,
  ArrowForwardRounded as ArrowIcon,
  HistoryRounded as LogIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} sx={{ color: '#1E293B' }}>
              Admin Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back! Here is what's happening with your store today.
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<LogIcon />} sx={{ borderRadius: '10px', fontWeight: 700 }}>
            View System Logs
          </Button>
        </Stack>

        {/* Top Level KPIs */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Total Revenue" value="₹4,25,000" icon={<SalesIcon />} color="#10B981" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Active Coupons" value="12" icon={<CouponIcon />} color="#6366F1" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Staff Online" value="4" icon={<StaffIcon />} color="#3B82F6" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Pending Orders" value="28" icon={<OrderIcon />} color="#F59E0B" />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Coupon Performance Section */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #E2E8F0', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={800}>
                  Active Campaigns
                </Typography>
                <Button endIcon={<ArrowIcon />} size="small">
                  Manage Coupons
                </Button>
              </Stack>
              <Stack spacing={2}>
                <CouponRow name="SUMMER50" usage={145} savings="₹12,400" status="Active" color="success" />
                <CouponRow name="WELCOME10" usage={890} savings="₹45,000" status="Active" color="success" />
                <CouponRow name="FLASH25" usage={12} savings="₹1,200" status="Expiring" color="warning" />
              </Stack>
            </Paper>
          </Grid>

          {/* Staff Activity Feed */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
                Staff Activity
              </Typography>
              <Stack spacing={3}>
                <ActivityItem user="Rahul S." action="Updated Product" target="iPhone 15 Pro" time="2 mins ago" />
                <ActivityItem user="Priya K." action="Created Coupon" target="DIWALI2024" time="1 hour ago" />
                <ActivityItem user="Amit V." action="Deleted Staff" target="John Doe (Editor)" time="3 hours ago" />
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Button fullWidth variant="contained" sx={{ borderRadius: '10px', py: 1.2, fontWeight: 700 }}>
                Manage Staff Members
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// --- Sub-Components ---

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center' }}>
    <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 56, height: 56, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={800}>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={900}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const CouponRow = ({ name, usage, savings, status, color }) => (
  <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ bgcolor: '#fff', px: 2, py: 0.5, borderRadius: '6px', border: '1px dashed #CBD5E1' }}>
        <Typography variant="body2" fontWeight={800} sx={{ letterSpacing: 1 }}>
          {name}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Used <b>{usage}</b> times
      </Typography>
    </Stack>
    <Stack direction="row" spacing={3} alignItems="center">
      <Typography variant="body2" fontWeight={700} color="success.main">
        -{savings}
      </Typography>
      <Chip label={status} size="small" color={color} sx={{ fontWeight: 800, fontSize: '10px' }} />
    </Stack>
  </Box>
);

const ActivityItem = ({ user, action, target, time }) => (
  <Stack direction="row" spacing={2}>
    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', fontWeight: 700 }}>{user[0]}</Avatar>
    <Box>
      <Typography variant="body2" fontWeight={600}>
        {user} <span style={{ fontWeight: 400, color: '#64748B' }}>{action}</span> {target}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        {time}
      </Typography>
    </Box>
  </Stack>
);

export default Dashboard;
