import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { saveAs } from 'file-saver';

import PurchaseTable from './PurchaseTable';
import PurchaseSalesChart from './PurchaseSalesChart';
import { calculatePurchaseStats, KpiCard } from './PurchaseHelper';

import { getAllPurchases } from '../../redux/features/Purchases/PurchaseSlice';

const PurchaseDashboard = () => {
  const dispatch = useDispatch();

  const { purchases, isPurchaseLoading } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(getAllPurchases());
  }, [dispatch]);

  const stats = calculatePurchaseStats(purchases || []);

  const handleExport = async () => {
    try {
      //   const res = await dispatch(exportPurchases()).unwrap();
      //   saveAs(res.data, `Purchases_${Date.now()}.xlsx`);
      console.log('handleExport');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Purchase Dashboard
        </Typography>

        <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={handleExport} disabled={isPurchaseLoading}>
          Export Excel
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <KpiCard title="Total Revenue" value={`₹${stats.totalRevenue}`} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <KpiCard title="Total Orders" value={stats.totalOrders} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <KpiCard title="Today's Sales" value={`₹${stats.todaySales}`} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <KpiCard title="Cancelled / Refunded" value={`${stats.cancelled} / ${stats.refunded}`} />
        </Grid>
      </Grid>

      {/* Chart */}
      <Box mt={4}>
        <Typography variant="h6" mb={2}>
          Sales Overview
        </Typography>
        <PurchaseSalesChart purchases={purchases} />
      </Box>

      {/* Table */}
      <Box mt={4}>
        <Typography variant="h6" mb={2}>
          Recent Purchases
        </Typography>
        <PurchaseTable purchases={purchases?.slice(0, 20)} onView={() => {}} loading={isPurchaseLoading} />
      </Box>
    </Box>
  );
};

export default PurchaseDashboard;
