import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// import { getAllPurchases } from '..';
// import { selectAllPurchases } from '../../features/purchase/purchaseSelectors';
// import { calculatePurchaseStats } from '../../utils/purchaseStats';
// import KpiCard from '../../components/dashboard/KpiCard';
// import SalesChart from '../../components/dashboard/SalesChart';
import PurchaseTable from './PurchaseTable';
// import PurchaseService from '../../features/purchase/PurchaseService';
import { saveAs } from 'file-saver';
import { getAllPurchases } from '../../redux/features/Purchases/PurchaseSlice';
import { calculatePurchaseStats, KpiCard } from './PurchaseHelper';
import PurchaseSalesChart from './PurchaseSalesChart';

const PurchaseDashboard = () => {
  const dispatch = useDispatch();
  //   const purchases = useSelector(selectAllPurchases);

  const { purchases, isPurchaseLoading } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(getAllPurchases());
  }, [dispatch]);

  const stats = calculatePurchaseStats(purchases);

  const handleExport = async () => {
    // const res = await PurchaseService.exportPurchases();
    // saveAs(res.data, `Purchases_${Date.now()}.xlsx`);
    console.log('handleExport');
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Purchase Dashboard
        </Typography>

        <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={handleExport}>
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
        <PurchaseTable purchases={purchases.slice(0, 20)} onView={() => {}} />
      </Box>
    </Box>
  );
};

export default PurchaseDashboard;
