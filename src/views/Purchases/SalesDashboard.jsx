import React, { useEffect, useState, useMemo } from 'react';
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
  Divider,
  IconButton
} from '@mui/material';
import {
  TrendingUpTwoTone,
  ReceiptLongTwoTone,
  AccountBalanceWalletTwoTone,
  StorefrontTwoTone,
  FileDownloadTwoTone as ExportIcon,
  MoreVert as MoreIcon,
  ArrowUpward
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPurchases, getStoreSalesReport } from '../../redux/features/Purchases/PurchaseSlice';
import { fetchAllStoresAdmin } from '../../redux/features/Stores/StoreSlice';
import { XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- Professional Theme Constants ---
const CARD_STYLE = {
  p: 3,
  borderRadius: '20px',
  background: '#ffffff',
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)'
  }
};

const SalesDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { purchases, reports } = useSelector((state) => state.purchase);
  const { stores } = useSelector((state) => state.store);
  const [selectedStore, setSelectedStore] = useState('ALL');

  useEffect(() => {
    dispatch(getAllPurchases());
    dispatch(fetchAllStoresAdmin());
  }, [dispatch]);

  const handleStoreChange = (e) => {
    const storeId = e.target.value;
    setSelectedStore(storeId);
    storeId === 'ALL' ? dispatch(getAllPurchases()) : dispatch(getStoreSalesReport(storeId));
  };

  const isAllStores = selectedStore === 'ALL';

  const summaryData = useMemo(() => {
    if (isAllStores) {
      const totalRevenue = purchases.reduce((sum, p) => sum + (p.finalAmount || 0), 0);
      return {
        totalSales: totalRevenue,
        totalTransactions: purchases.length,
        averageTransaction: purchases.length > 0 ? totalRevenue / purchases.length : 0
      };
    }
    return reports?.summary || {};
  }, [isAllStores, purchases, reports]);

  const chartData = useMemo(() => (isAllStores ? purchases.slice(-12) : reports?.report || []), [isAllStores, purchases, reports]);

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 8, pt: 2 }}>
      <Container maxWidth="xl">
        {/* HEADER SECTION */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" sx={{ mb: 5 }} spacing={3}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E293B', letterSpacing: '-0.5px' }}>
              Executive Overview
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Dashboard monitoring{' '}
              <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {stores.length} active locations
              </Box>
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <TextField
              select
              size="small"
              value={selectedStore}
              onChange={handleStoreChange}
              sx={{
                minWidth: 240,
                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' }
              }}
            >
              <MenuItem value="ALL">🌎 All Outlets Combined</MenuItem>
              {stores.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  📍 {s.name}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              disableElevation
              startIcon={<ExportIcon />}
              sx={{ borderRadius: '12px', px: 3, textTransform: 'none', fontWeight: 600 }}
            >
              Export
            </Button>
          </Stack>
        </Stack>

        {/* METRICS GRID */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Gross Revenue"
              value={`₹${summaryData.totalSales?.toLocaleString('en-IN')}`}
              icon={<AccountBalanceWalletTwoTone />}
              color="#6366F1"
              trend="+12.5%"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Total Orders"
              value={summaryData.totalTransactions}
              icon={<ReceiptLongTwoTone />}
              color="#F59E0B"
              trend="+5.2%"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Avg. Order Value"
              value={`₹${Math.round(summaryData.averageTransaction || 0).toLocaleString('en-IN')}`}
              icon={<TrendingUpTwoTone />}
              color="#10B981"
              trend="+2.1%"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard title="Active Stores" value={stores.length} icon={<StorefrontTwoTone />} color="#3B82F6" />
          </Grid>
        </Grid>

        {/* MAIN VISUALS */}
        <Grid container spacing={3}>
          {/* REVENUE CHART */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={CARD_STYLE}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Revenue Performance
                </Typography>
                <IconButton size="small">
                  <MoreIcon />
                </IconButton>
              </Stack>

              <Box sx={{ height: 350, width: '100%' }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey={isAllStores ? 'invoiceNumber' : 'date'}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <ChartTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area
                      type="monotone"
                      dataKey={isAllStores ? 'finalAmount' : 'totalSales'}
                      stroke={theme.palette.primary.main}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* RECENT TRANSACTIONS */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ ...CARD_STYLE, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Recent Activity
              </Typography>
              <Stack spacing={2.5}>
                {(isAllStores ? purchases : chartData).slice(0, 7).map((item, idx) => (
                  <Box key={idx}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: 'grey.50',
                          color: 'text.primary',
                          width: 40,
                          height: 40,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          border: '1px solid #f0f0f0'
                        }}
                      >
                        {idx + 1}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {isAllStores
                            ? item.invoiceNumber
                            : new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {isAllStores ? 'Instant Purchase' : 'Daily Aggregated'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>
                        +₹{(isAllStores ? item.finalAmount : item.totalSales).toLocaleString()}
                      </Typography>
                    </Stack>
                    {idx !== 6 && <Divider sx={{ mt: 2, opacity: 0.6 }} />}
                  </Box>
                ))}
              </Stack>
              <Button fullWidth sx={{ mt: 3, textTransform: 'none', fontWeight: 600 }} color="inherit">
                View All Activity
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const MetricCard = ({ title, value, icon, color, trend }) => (
  <Paper sx={CARD_STYLE}>
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Avatar sx={{ bgcolor: alpha(color, 0.12), color: color, width: 48, height: 48 }}>{icon}</Avatar>
      {trend && (
        <Box
          sx={{ ml: 'auto', display: 'flex', alignItems: 'center', bgcolor: alpha('#10B981', 0.1), px: 1, py: 0.5, borderRadius: '6px' }}
        >
          <ArrowUpward sx={{ fontSize: 14, color: '#10B981', mr: 0.5 }} />
          <Typography sx={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 700 }}>{trend}</Typography>
        </Box>
      )}
    </Stack>
    <Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B' }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

export default SalesDashboard;
