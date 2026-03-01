// src/pages/Default.jsx
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
  Divider
} from '@mui/material';
import { useSelector } from 'react-redux';

// Icons
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import RouterTwoToneIcon from '@mui/icons-material/RouterTwoTone';
import MapTwoToneIcon from '@mui/icons-material/MapTwoTone';
import ConfirmationNumberTwoToneIcon from '@mui/icons-material/ConfirmationNumberTwoTone';
import GroupWorkTwoToneIcon from '@mui/icons-material/GroupWorkTwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import ErrorOutlineTwoToneIcon from '@mui/icons-material/ErrorOutlineTwoTone';
import ShoppingBagTwoToneIcon from '@mui/icons-material/ShoppingBagTwoTone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// --- Sub-Component: Primary KPI ---
const PrimaryKPI = ({ title, value, icon, color, loading }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 5,
        boxShadow: '0 10px 30px 0 rgba(0,0,0,0.05)',
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        background: '#fff',
        height: '100%'
      }}
    >
      <Stack spacing={2}>
        <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 56, height: 56, borderRadius: 3 }}>{icon}</Avatar>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -1 }}>
            {loading ? '...' : value}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ opacity: 0.7 }}>
            {title.toUpperCase()}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};

// --- Sub-Component: Mini KPI ---
const MiniKPI = ({ title, value, icon, color }) => (
  <Paper variant="outlined" sx={{ p: 2, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fdfeff' }}>
    <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 40, height: 40 }}>
      {React.cloneElement(icon, { sx: { fontSize: 20 } })}
    </Avatar>
    <Box>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="h6" fontWeight={700}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const Default = () => {
  const theme = useTheme();

  // REAL DATA FROM REDUX
  // Adjust these selectors based on your actual slice structure
  const { stats, isLoading } = useSelector((state) => state.Dashboard || {});
  const { Admin } = useSelector((state) => state.admin);

  // Mock data fallback for demonstration
  const data = stats || {
    totalCustomers: '1,280',
    totalConnections: '1,150',
    totalAreas: '24',
    pendingTickets: '12',
    totalTeam: '18',
    totalPlans: '08',
    referrals: '142',
    outages: ['Sector 7 - West', 'North Hub'], // Areas with issues
    recentPurchases: [
      { id: 1, user: 'Amit Sharma', plan: 'Gold Unlimited', time: '2 mins ago' },
      { id: 2, user: 'Sneha Rao', plan: 'Basic Fiber', time: '15 mins ago' },
      { id: 3, user: 'John Doe', plan: 'Enterprise 1GB', time: '1 hour ago' }
    ]
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#1B254B">
            Welcome, {Admin?.firstName || 'Admin'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here’s what’s happening with your network today.
          </Typography>
        </Box>
        <Button variant="contained" sx={{ borderRadius: 3, bgcolor: '#4318FF', textTransform: 'none', px: 3 }}>
          System Report
        </Button>
      </Stack>

      {/* ROW 1: THE BIG FOUR */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PrimaryKPI title="Customers" value={data.totalCustomers} icon={<PeopleAltTwoToneIcon />} color="#4318FF" loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PrimaryKPI title="Connections" value={data.totalConnections} icon={<RouterTwoToneIcon />} color="#6AD2FF" loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PrimaryKPI title="Operational Areas" value={data.totalAreas} icon={<MapTwoToneIcon />} color="#39B81A" loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PrimaryKPI
            title="Pending Tickets"
            value={data.pendingTickets}
            icon={<ConfirmationNumberTwoToneIcon />}
            color="#EE5D50"
            loading={isLoading}
          />
        </Grid>
      </Grid>

      {/* ROW 2: SECONDARY STATS */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#1B254B' }}>
        Resource Overview
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <MiniKPI title="Total Team" value={data.totalTeam} icon={<GroupWorkTwoToneIcon />} color="#FFB547" />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <MiniKPI title="Active Plans" value={data.totalPlans} icon={<InventoryTwoToneIcon />} color="#A3AED0" />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <MiniKPI title="Referrals" value={data.referrals} icon={<ShareTwoToneIcon />} color="#4318FF" />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          {/* Dynamic Status Card */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: data.outages.length > 0 ? alpha('#EE5D50', 0.05) : alpha('#39B81A', 0.05),
              borderColor: data.outages.length > 0 ? '#EE5D50' : '#39B81A'
            }}
          >
            <Box
              className={data.outages.length > 0 ? 'pulse-red' : ''}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: data.outages.length > 0 ? '#EE5D50' : '#39B81A'
              }}
            />
            <Typography variant="body2" fontWeight={700} color={data.outages.length > 0 ? '#EE5D50' : '#39B81A'}>
              {data.outages.length > 0 ? `${data.outages.length} Areas with Outages` : 'All Systems Nominal'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ROW 3: LIVE FEEDS */}
      <Grid container spacing={3}>
        {/* Outage Tracker */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.02)', height: '100%' }}>
            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorOutlineTwoToneIcon color="error" /> Outage Alert Monitor
            </Typography>
            <Divider sx={{ my: 2 }} />
            {data.outages.length > 0 ? (
              <List>
                {data.outages.map((area, index) => (
                  <ListItem key={index} sx={{ bgcolor: '#FFF5F5', borderRadius: 3, mb: 1 }}>
                    <ListItemText
                      primary={area}
                      primaryTypographyProps={{ fontWeight: 700, color: '#EE5D50' }}
                      secondary="Connectivity Lost - Since 12:40 PM"
                    />
                    <Button size="small" variant="outlined" color="error">
                      Fix
                    </Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5, opacity: 0.5 }}>
                <Typography>No outages detected.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Purchases Feed */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.02)', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingBagTwoToneIcon color="primary" /> Recent Plan Purchases
              </Typography>
              <Button endIcon={<ArrowForwardIcon />} sx={{ textTransform: 'none' }}>
                View All
              </Button>
            </Stack>
            <List>
              {data.recentPurchases.map((item) => (
                <ListItem key={item.id} divider sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#F4F7FE', color: '#4318FF' }}>{item.user[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography fontWeight={700}>{item.user}</Typography>} secondary={`Purchased ${item.plan}`} />
                  <Chip label={item.time} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Custom Styles for Pulse Effect */}
      <style>
        {`
          @keyframes pulse-red {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(238, 93, 80, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(238, 93, 80, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(238, 93, 80, 0); }
          }
          .pulse-red {
            animation: pulse-red 2s infinite;
          }
        `}
      </style>
    </Box>
  );
};

export default Default;
