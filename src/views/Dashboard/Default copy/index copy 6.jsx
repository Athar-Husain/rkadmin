import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Stack,
  Avatar,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  useTheme,
  alpha,
  Button,
  LinearProgress,
  Container
} from '@mui/material';
import Chart from 'react-apexcharts';

// Specific Icons for your Schemas
import {
  AdminPanelSettingsTwoTone as AdminIcon,
  BurstModeTwoTone as BannerIcon,
  LocationOnTwoTone as GeoIcon,
  LocalOfferTwoTone as CouponIcon,
  Inventory2TwoTone as ProductIcon,
  CampaignTwoTone as PromoIcon,
  TrendingUpTwoTone as GrowthIcon,
  AdsClickTwoTone as ClickIcon,
  WarningTwoTone as StockWarningIcon
} from '@mui/icons-material';

const EnterpriseDashboard = () => {
  const theme = useTheme();

  // Mapping your Schemas to actionable Dashboard Data
  const stats = {
    inventory: { total: 450, lowStock: 12, outOfStock: 5 },
    promos: { active: 8, totalImpressions: 45200, totalClicks: 1240 },
    geo: { cities: 5, areas: 42, activePincodes: 128 },
    coupons: { redemptions: 850, pendingDrafts: 3 }
  };

  // Chart: Banner vs Promotion Click-Through Rate (CTR)
  const ctrChart = {
    series: [
      { name: 'Banners', data: [31, 40, 28, 51, 42, 109, 100] },
      { name: 'Promotions', data: [11, 32, 45, 32, 34, 52, 41] }
    ],
    options: {
      chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
      colors: ['#4318FF', '#6AD2FF'],
      stroke: { curve: 'smooth', width: 3 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0 } },
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      grid: { borderColor: alpha(theme.palette.divider, 0.1) }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* HEADER: Role-Based Greeting (Based on Admin Schema) */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} color="#1B2559">
              System Intelligence
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Logged in as <Chip label="SUPERADMIN" size="small" sx={{ fontWeight: 900, bgcolor: '#4318FF', color: '#fff' }} />
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AdminIcon />} sx={{ bgcolor: '#1B2559', borderRadius: '12px' }}>
            Permission Manager
          </Button>
        </Stack>

        {/* TIER 1: CROSS-MODULE KPI CARDS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Product Schema Insight */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #E9EDF7' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: alpha('#4318FF', 0.1), color: '#4318FF' }}>
                  <ProductIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    OVERALL STOCK
                  </Typography>
                  <Typography variant="h5" fontWeight={900}>
                    24,500 Units
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="error.main" fontWeight={700}>
                  {' '}
                  {stats.inventory.lowStock} items low stock
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{ mt: 0.5, borderRadius: 5, height: 6, bgcolor: alpha('#4318FF', 0.1) }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Geo/CityArea Schema Insight */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #E9EDF7' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: alpha('#05CD99', 0.1), color: '#05CD99' }}>
                  <GeoIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    OPERATIONAL REACH
                  </Typography>
                  <Typography variant="h5" fontWeight={900}>
                    {stats.geo.cities} Cities
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
                Active in <b>{stats.geo.areas} Areas</b> across regions.
              </Typography>
            </Paper>
          </Grid>

          {/* Banner Schema Analytics */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #E9EDF7' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: alpha('#FFB547', 0.1), color: '#FFB547' }}>
                  <BannerIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    AD PERFORMANCE
                  </Typography>
                  <Typography variant="h5" fontWeight={900}>
                    {stats.promos.totalClicks}
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
                <b>2.7% CTR</b> from {stats.promos.totalImpressions} impressions.
              </Typography>
            </Paper>
          </Grid>

          {/* Coupon Schema Insight */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #E9EDF7' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: alpha('#EE5D50', 0.1), color: '#EE5D50' }}>
                  <CouponIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    COUPON USAGE
                  </Typography>
                  <Typography variant="h5" fontWeight={900}>
                    {stats.coupons.redemptions}
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
                {stats.coupons.pendingDrafts} Coupons awaiting activation.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* TIER 2: DEEP ANALYTICS */}
        <Grid container spacing={3}>
          {/* Conversion Chart (Promotion vs Banner Effectiveness) */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', height: '100%' }}>
              <Typography variant="h6" fontWeight={800} color="#1B2559" sx={{ mb: 3 }}>
                Campaign Engagement (7-Day Trend)
              </Typography>
              <Chart options={ctrChart.options} series={ctrChart.series} type="area" height={350} />
            </Paper>
          </Grid>

          {/* Promotion Priority List (Promotion Schema) */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', height: '100%' }}>
              <Typography variant="h6" fontWeight={800} color="#1B2559" sx={{ mb: 2 }}>
                High Priority Promos
              </Typography>
              <List disablePadding>
                {['Winter Sale 2024', 'BOGO - Electronics', 'City-Special: Mumbai'].map((promo, i) => (
                  <ListItem key={i} sx={{ px: 0, py: 1.5 }} divider={i !== 2}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#F4F7FE', color: '#4318FF' }}>
                        <PromoIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography fontWeight={700}>{promo}</Typography>} secondary="Expiring in 2 days" />
                    <Chip label="P-1" size="small" color="error" sx={{ fontWeight: 900 }} />
                  </ListItem>
                ))}
              </List>
              <Button fullWidth sx={{ mt: 2, textTransform: 'none', fontWeight: 700 }}>
                View All Promotions
              </Button>
            </Paper>
          </Grid>

          {/* TIER 3: GEOGRAPHIC & STOCK ALERTS */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: '24px' }}>
              <Typography variant="h6" fontWeight={800} color="#1B2559" sx={{ mb: 2 }}>
                Stock Distribution by City
              </Typography>
              <Stack spacing={2}>
                {['MUMBAI', 'PUNE', 'DELHI'].map((city) => (
                  <Box key={city}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {city}
                      </Typography>
                      <Typography variant="body2" fontWeight={800}>
                        75% Stock
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Action Log (Tracking Admin Actions from Admin Schema) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: '24px' }}>
              <Typography variant="h6" fontWeight={800} color="#1B2559" sx={{ mb: 2 }}>
                Recent Management Logs
              </Typography>
              <Stack spacing={2}>
                <Typography variant="caption" color="text.secondary">
                  <b>SuperAdmin</b> updated <b>SKU: APPLE-IPH-15</b> stock in <b>Mumbai Central Store</b>.
                </Typography>
                <Divider />
                <Typography variant="caption" color="text.secondary">
                  <b>Manager_1</b> created a <b>PERCENTAGE Coupon (FESTIVE25)</b> for <b>All Users</b>.
                </Typography>
                <Divider />
                <Typography variant="caption" color="text.secondary">
                  <b>System</b> auto-expired <b>Banner: "Summer Clearance"</b>.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EnterpriseDashboard;
