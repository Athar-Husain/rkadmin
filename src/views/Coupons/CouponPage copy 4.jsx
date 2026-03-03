import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Stack,
  Typography,
  Button,
  Box,
  alpha,
  useTheme,
  IconButton,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import {
  AddRounded as AddIcon,
  ConfirmationNumberTwoTone as CouponIcon,
  CloseRounded as CloseIcon,
  AutoGraphTwoTone as AnalyticsIcon,
  FlashOnTwoTone as ActiveIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import CouponList from './CouponList';
import RedemptionHistoryTable from './RedemptionHistoryTable';
import CreateCouponDialog from './CreateCouponDialog';
import { fetchAllCouponsAdmin } from '../../redux/features/Coupons/CouponSlice';

const CouponsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { coupons = [], isCouponLoading } = useSelector((state) => state.coupon);

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchAllCouponsAdmin());
  }, [dispatch]);

  const today = new Date();

  const filteredCoupons = useMemo(() => {
    if (!Array.isArray(coupons)) return [];

    return coupons.filter((coupon) => {
      const isExpiredByDate = coupon?.validUntil && new Date(coupon.validUntil).setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);

      if (tabValue === 0) {
        // Active
        return coupon?.status === 'ACTIVE' && (!isExpiredByDate || coupon?.neverExpires);
      }

      if (tabValue === 1) {
        // Expired
        return coupon?.status === 'EXPIRED' || isExpiredByDate;
      }

      // All
      return true;
    });
  }, [coupons, tabValue]);

  const stats = useMemo(() => {
    if (!Array.isArray(coupons)) return { active: 0, totalRedeemed: 0 };
    const active = coupons.filter((c) => c?.status === 'ACTIVE').length;
    const totalRedeemed = coupons.reduce((acc, curr) => acc + (curr?.currentRedemptions || 0), 0);
    return { active, totalRedeemed };
  }, [coupons]);

  const handleOpenCreate = () => {
    setSelectedCoupon(null);
    setIsCreateDialogOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setIsCreateDialogOpen(true);
  };

  const handleCloseHistory = () => {
    setSelectedCoupon(null);
    setIsHistoryOpen(false);
  };

  return (
    <Box
      sx={{
        bgcolor: '#F8FAFC',
        minHeight: '100vh',
        background: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.05)} 0, transparent 50%)`
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={3} sx={{ mb: 6 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} sx={{ color: '#0F172A', letterSpacing: '-0.02em', mb: 1 }}>
              Marketing Hub
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Monitor performance and manage high-conversion discount campaigns.
            </Typography>
          </Box>

          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              borderRadius: '14px',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
            }}
          >
            Create New Coupon
          </Button>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <KPICard title="Total Campaigns" value={coupons?.length || 0} icon={<CouponIcon />} color="#6366F1" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <KPICard title="Live Now" value={stats.active} icon={<ActiveIcon />} color="#10B981" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <KPICard title="Total Redemptions" value={stats.totalRedeemed} icon={<AnalyticsIcon />} color="#F59E0B" />
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ borderBottom: '1px solid #F1F5F9' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ px: 2 }}>
              <Tab label="Active" />
              <Tab label="Expired" />
              <Tab label="All" />
            </Tabs>
          </Box>

          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6" fontWeight={800} color="#1E293B">
              {tabValue === 0 && 'Active Coupons'}
              {tabValue === 1 && 'Expired Coupons'}
              {tabValue === 2 && 'All Coupons'}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                bgcolor: '#F1F5F9',
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                fontWeight: 700,
                color: '#64748B'
              }}
            >
              {isCouponLoading ? 'Updating...' : 'Real-time data'}
            </Typography>
          </Box>

          <CouponList
            coupons={filteredCoupons}
            onEdit={handleOpenEdit}
            onViewHistory={(c) => {
              setSelectedCoupon(c);
              setIsHistoryOpen(true);
            }}
          />
        </Paper>

        <Dialog
          open={isHistoryOpen}
          onClose={handleCloseHistory}
          fullWidth
          maxWidth="lg"
          PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={900}>
              Redemption Analytics
            </Typography>
            <IconButton onClick={handleCloseHistory} sx={{ bgcolor: '#F8FAFC' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <RedemptionHistoryTable couponId={selectedCoupon?._id} />
          </DialogContent>
        </Dialog>

        <CreateCouponDialog
          open={isCreateDialogOpen}
          editData={selectedCoupon}
          onClose={() => {
            setIsCreateDialogOpen(false);
            setSelectedCoupon(null);
          }}
          onRefresh={() => dispatch(fetchAllCouponsAdmin())}
        />
      </Container>
    </Box>
  );
};

const KPICard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: '24px',
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #F1F5F9',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 20px 25px -5px ${alpha(color, 0.1)}`
      }
    }}
  >
    <Avatar
      sx={{
        bgcolor: alpha(color, 0.1),
        color,
        width: 60,
        height: 60,
        mr: 2.5,
        borderRadius: '18px'
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 32 } })}
    </Avatar>
    <Box>
      <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={900} sx={{ color: '#0F172A' }}>
        {value.toLocaleString()}
      </Typography>
    </Box>
  </Paper>
);

export default CouponsPage;
