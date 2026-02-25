// src/pages/Default.jsx
import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ApexCharts from 'react-apexcharts';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Using MUI icons
import GroupIcon from '@mui/icons-material/Group';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// Mock Data for Dashboard
const mockDashboardData = {
  totalCustomers: 1250,
  activeConnections: 980,
  openTickets: 45,
  newLeadsToday: 12,
  monthlyRevenue: 75000,
  leadsConvertedThisMonth: 88,
  ticketResolutionRate: '92%',
  leadSources: {
    labels: ['Website', 'Referral', 'Social Media', 'Partnership'],
    series: [44, 55, 13, 43],
  },
  ticketStatusDistribution: {
    labels: ['Open', 'In Progress', 'Pending', 'Resolved'],
    series: [20, 30, 15, 35],
  },
  recentActivity: [
    { id: 'act1', icon: <GroupIcon color="primary" />, text: 'New customer "Alice Smith" registered.', timestamp: 'Just now' },
    { id: 'act2', icon: <AssignmentIcon color="warning" />, text: 'Ticket #T123 status updated to "In Progress".', timestamp: '5 mins ago' },
    { id: 'act3', icon: <LeaderboardIcon color="success" />, text: 'New lead "Global Innovations" received.', timestamp: '1 hour ago' },
    { id: 'act4', icon: <NetworkCheckIcon color="secondary" />, text: 'Connection outage in "Sector B".', timestamp: '2 hours ago' },
    { id: 'act5', icon: <AttachMoneyIcon color="info" />, text: 'Invoice #INV456 paid by "John Doe".', timestamp: 'Yesterday' },
  ],
};

const Default = () => {
  const theme = useTheme();

  // ApexCharts options for Lead Sources (Donut Chart)
  const leadSourcesChartOptions = {
    chart: {
      type: 'donut',
    },
    labels: mockDashboardData.leadSources.labels,
    colors: [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.info.main, theme.palette.success.main],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
    legend: {
      labels: {
        colors: theme.palette.text.primary, // Ensure legend text color adapts to theme
      },
    },
  };

  // ApexCharts options for Ticket Status Distribution (Pie Chart)
  const ticketStatusChartOptions = {
    chart: {
      type: 'pie',
    },
    labels: mockDashboardData.ticketStatusDistribution.labels,
    colors: [theme.palette.error.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.success.main],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
    legend: {
      labels: {
        colors: theme.palette.text.primary, // Ensure legend text color adapts to theme
      },
    },
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 6, fontWeight: 'bold', color: 'text.primary' }}>
        Dashboard Overview
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {[
          { title: 'Total Customers', value: mockDashboardData.totalCustomers, icon: <GroupIcon />, color: 'primary' },
          { title: 'Active Connections', value: mockDashboardData.activeConnections, icon: <NetworkCheckIcon />, color: 'success' },
          { title: 'Open Tickets', value: mockDashboardData.openTickets, icon: <AssignmentIcon />, color: 'error' },
          { title: 'New Leads Today', value: mockDashboardData.newLeadsToday, icon: <LeaderboardIcon />, color: 'info' },
//           {
//             title: 'Monthly Revenue', value: `₹
// ${mockDashboardData.monthlyRevenue.toLocaleString()}`, icon: <AttachMoneyIcon />, color: 'secondary'
//           },
          {
            title: 'Monthly Revenue', value: `₹
${mockDashboardData.monthlyRevenue.toLocaleString()}`, icon: <AttachMoneyIcon />, color: 'secondary'
          },
          { title: 'Leads Converted', value: mockDashboardData.leadsConvertedThisMonth, icon: <PeopleOutlineIcon />, color: 'success' },
          { title: 'Ticket Resolution', value: mockDashboardData.ticketResolutionRate, icon: <CheckCircleOutlineIcon />, color: 'primary' },
        ].map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                height: '100%',
                transition: 'box-shadow 0.3s',
                '&:hover': { boxShadow: 6 },
                bgcolor: 'background.paper',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    mb: 2,
                    boxShadow: 3,
                    bgcolor: theme.palette[item.color].light,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { color: theme.palette[item.color].dark, fontSize: 30 } })}
                </Box>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4} sx={{ mt: 8, mb: 8 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ borderRadius: 3, boxShadow: 3, p: 4, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" component="h2" sx={{ mb: 4, fontWeight: 'semibold', color: 'text.primary' }}>
              Lead Sources
            </Typography>
            <ApexCharts
              options={leadSourcesChartOptions}
              series={mockDashboardData.leadSources.series}
              type="donut"
              height={300}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ borderRadius: 3, boxShadow: 3, p: 4, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" component="h2" sx={{ mb: 4, fontWeight: 'semibold', color: 'text.primary' }}>
              Ticket Status Distribution
            </Typography>
            <ApexCharts
              options={ticketStatusChartOptions}
              series={mockDashboardData.ticketStatusDistribution.series}
              type="pie"
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Paper sx={{ borderRadius: 3, boxShadow: 3, p: 4, bgcolor: 'background.paper' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 4, fontWeight: 'semibold', color: 'text.primary' }}>
          Recent Activity
        </Typography>
        <List>
          {mockDashboardData.recentActivity.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem disablePadding>
                <ListItemIcon>{activity.icon}</ListItemIcon>
                <ListItemText
                  primary={<Typography sx={{ color: 'text.primary' }}>{activity.text}</Typography>}
                  secondary={<Typography variant="body2" color="text.secondary">{activity.timestamp}</Typography>}
                />
              </ListItem>
              {index < mockDashboardData.recentActivity.length - 1 && (
                <Divider component="li" sx={{ my: 2 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Default;
