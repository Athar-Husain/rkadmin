import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Grid,
  Paper,
  MenuItem,
  TextField,
  Button,
  Avatar,
  alpha,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUpTwoTone,
  ReceiptLongTwoTone,
  AccountBalanceWalletTwoTone,
  StorefrontTwoTone,
  FileDownloadTwoTone as ExportIcon,
  FilterListTwoTone as FilterIcon,
  CalendarTodayTwoTone as DateIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPurchases, getStoreSalesReport } from '../../redux/features/Purchases/PurchaseSlice';
import { fetchAllStoresAdmin } from '../../redux/features/Stores/StoreSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const SalesDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Selectors
  const { purchases, reports, isPurchaseLoading } = useSelector((state) => state.purchase);
  const { stores } = useSelector((state) => state.store);

  // Local State for Filters
  const [selectedStore, setSelectedStore] = useState('ALL');

  useEffect(() => {
    dispatch(getAllPurchases());
    dispatch(fetchAllStoresAdmin());
  }, [dispatch]);

  // Handler for store filtering
  const handleStoreChange = (e) => {
    const storeId = e.target.value;
    setSelectedStore(storeId);
    if (storeId === 'ALL') {
      dispatch(getAllPurchases());
    } else {
      dispatch(getStoreSalesReport(storeId));
    }
  };

  // Summary Metrics
  const totalRevenue = purchases.reduce((sum, p) => sum + p.finalAmount, 0);
  const totalOrders = purchases.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <Box sx={{ bgcolor: '#F4F7FA', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="xl">
        {/* Header & Global Filters */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" sx={{ py: 4 }} spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={900} letterSpacing={-0.5}>
              Sales Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time performance across all RK Electronics outlets
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <TextField
              select
              size="small"
              value={selectedStore}
              onChange={handleStoreChange}
              sx={{ minWidth: 200, bgcolor: '#fff', borderRadius: '12px' }}
              InputProps={{ startAdornment: <StorefrontTwoTone sx={{ mr: 1, color: 'primary.main' }} /> }}
            >
              <MenuItem value="ALL">All Outlets</MenuItem>
              {stores.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {s.name} ({s.location.city})
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" startIcon={<ExportIcon />} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
              Export Reports
            </Button>
          </Stack>
        </Stack>

        {/* Top Metrics Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Gross Revenue"
              value={`₹${totalRevenue.toLocaleString('en-IN')}`}
              icon={<AccountBalanceWalletTwoTone />}
              color="#6366F1"
              trend="+12.5%"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Total Invoices" value={totalOrders} icon={<ReceiptLongTwoTone />} color="#F59E0B" trend="+5.2%" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Average Order"
              value={`₹${Math.round(avgOrderValue).toLocaleString('en-IN')}`}
              icon={<TrendingUpTwoTone />}
              color="#10B981"
              trend="+2.1%"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Active Outlets" value={stores.length} icon={<StorefrontTwoTone />} color="#3B82F6" />
          </Grid>
        </Grid>

        {/* Main Chart Section */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E0E4E8' }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={800}>
                  Revenue Trend
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label="Daily" size="small" variant="filled" color="primary" />
                  <Chip label="Weekly" size="small" variant="outlined" />
                </Stack>
              </Stack>
              <Box sx={{ height: 350, width: '100%' }}>
                <ResponsiveContainer>
                  <AreaChart data={purchases.slice(-10)}>
                    
                    {/* Last 10 purchases for mock trend */}
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="invoiceNumber" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <ChartTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                    <Area
                      type="monotone"
                      dataKey="finalAmount"
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Side Panel: Recent Activity */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', height: '100%', border: '1px solid #E0E4E8' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
                Recent Transactions
              </Typography>
              <Stack spacing={2.5}>
                {purchases.slice(0, 6).map((item) => (
                  <Stack key={item._id} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 40, height: 40 }}>
                        <Typography variant="caption" fontWeight={900}>
                          {item.invoiceNumber.slice(-3)}
                        </Typography>
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>
                          {item.userId?.name || 'Customer'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.storeId?.name}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" fontWeight={800}>
                      ₹{item.finalAmount}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Button fullWidth sx={{ mt: 3, borderRadius: '10px', fontWeight: 700 }} color="primary">
                View All History
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Sub-component: Metric Card
const MetricCard = ({ title, value, icon, color, trend }) => (
  <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #E0E4E8', position: 'relative', overflow: 'hidden' }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 56, height: 56 }}>{icon}</Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h5" fontWeight={900}>
            {value}
          </Typography>
          {trend && (
            <Typography
              variant="caption"
              sx={{ color: '#10B981', bgcolor: alpha('#10B981', 0.1), px: 0.8, py: 0.2, borderRadius: '5px', fontWeight: 800 }}
            >
              {trend}
            </Typography>
          )}
        </Stack>
      </Box>
    </Stack>
  </Paper>
);

// Helper for Chip (standard MUI Chip used above)
const Chip = ({ label, size, variant, color }) => (
  <Box
    sx={{
      px: 2,
      py: 0.5,
      borderRadius: '8px',
      fontSize: '0.75rem',
      fontWeight: 700,
      bgcolor: variant === 'filled' ? 'primary.main' : 'transparent',
      color: variant === 'filled' ? '#fff' : 'text.secondary',
      border: variant === 'outlined' ? '1px solid #E0E4E8' : 'none',
      cursor: 'pointer'
    }}
  >
    {label}
  </Box>
);

export default SalesDashboard;
