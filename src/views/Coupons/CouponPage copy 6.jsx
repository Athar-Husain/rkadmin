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
  Grid,
  Tabs,
  Tab,
  Chip,
  Skeleton
} from '@mui/material';
import {
  AddRounded as AddIcon,
  ConfirmationNumberTwoTone as CouponIcon,
  AutoGraphTwoTone as AnalyticsIcon,
  BoltRounded as LiveIcon,
  HistoryRounded as HistoryIcon,
  FilterListRounded as FilterIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCouponsAdmin } from '../../redux/features/Coupons/CouponSlice';

import CouponList from './CouponList';
import CreateCouponDialog from './CreateCouponDialog';

const KPICard = ({ title, value, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: '24px',
      bgcolor: 'white',
      border: '1px solid',
      borderColor: alpha(color, 0.1),
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 24px ${alpha(color, 0.08)}` }
    }}
  >
    <Box
      sx={{
        p: 2,
        borderRadius: '16px',
        bgcolor: alpha(color, 0.1),
        color: color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {React.cloneElement(icon, { fontSize: 'large' })}
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={800} sx={{ color: '#1E293B' }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const CouponsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const coupons = useSelector((state) => state.coupon.coupons) || [];
  const isCouponLoading = useSelector((state) => state.coupon.isCouponLoading);

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchAllCouponsAdmin());
  }, [dispatch]);

  /**
   * STRICT STATUS LOGIC
   * This is the "Source of Truth" for what defines an Active vs Expired coupon.
   */
  const getCalculatedStatus = (coupon) => {
    if (!coupon) return 'EXPIRED';

    const now = new Date();
    const expiryDate = new Date(coupon.validUntil);

    // A coupon is ONLY active if:
    // 1. Backend status is literally "ACTIVE"
    // 2. The isExpired flag from backend is false
    // 3. The current time is BEFORE the expiry date
    const isActive = coupon.status === 'ACTIVE' && coupon.isExpired === false && now < expiryDate;

    return isActive ? 'ACTIVE' : 'EXPIRED';
  };

  /**
   * UPDATED FILTERING LOGIC
   * We filter the list BEFORE sending it to CouponList
   */
  const filteredCoupons = useMemo(() => {
    if (tabValue === 2) return coupons; // "All" tab - show everything

    return coupons.filter((coupon) => {
      const status = getCalculatedStatus(coupon);
      if (tabValue === 0) return status === 'ACTIVE'; // Tab: Active
      if (tabValue === 1) return status === 'EXPIRED'; // Tab: Expired
      return true;
    });
  }, [coupons, tabValue]);

  const stats = useMemo(() => {
    const total = coupons?.length || 0;
    const active = coupons.filter((c) => getCalculatedStatus(c) === 'ACTIVE').length;
    const redemptions = coupons.reduce((acc, curr) => acc + (curr?.currentRedemptions || 0), 0);
    return { total, active, redemptions };
  }, [coupons]);

  return (
    <Box
      sx={{
        bgcolor: '#F8FAFC',
        minHeight: '100vh',
        pb: 10,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, #F8FAFC 100%)`
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 6 }}>
        {/* Header section remains unchanged */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3} sx={{ mb: 6 }}>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h3" fontWeight={900} sx={{ color: '#0F172A', letterSpacing: '-0.03em' }}>
                Promotions
              </Typography>
              <Chip
                label={`${stats.active} Live Now`}
                color="success"
                icon={<LiveIcon sx={{ fontSize: '16px !important' }} />}
                sx={{ borderRadius: '8px', fontWeight: 700, height: '28px' }}
              />
            </Stack>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, opacity: 0.8 }}>
              Manage and track your discount strategy for RK Electronics.
            </Typography>
          </Box>

          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedCoupon(null);
              setIsCreateDialogOpen(true);
            }}
            sx={{
              borderRadius: '16px',
              px: 4,
              py: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 800,
              boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
            }}
          >
            Create Campaign
          </Button>
        </Stack>

        {/* KPI Cards section remains unchanged */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={4}>
            <KPICard title="Total Campaigns" value={stats.total} icon={<CouponIcon />} color="#6366F1" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <KPICard title="Active Coupons" value={stats.active} icon={<LiveIcon />} color="#10B981" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <KPICard title="Total Conversions" value={stats.redemptions} icon={<AnalyticsIcon />} color="#F59E0B" />
          </Grid>
        </Grid>

        <Paper elevation={0} sx={{ borderRadius: '28px', p: 1, bgcolor: 'white', border: '1px solid #E2E8F0' }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: '#F1F5F9',
              px: 3,
              pt: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(e, v) => setTabValue(v)}
              sx={{
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, minWidth: 100, fontSize: '1rem' },
                '& .Mui-selected': { color: theme.palette.primary.main }
              }}
            >
              <Tab label="Active" icon={<LiveIcon fontSize="small" />} iconPosition="start" />
              <Tab label="Expired" icon={<HistoryIcon fontSize="small" />} iconPosition="start" />
              <Tab label="All" icon={<FilterIcon fontSize="small" />} iconPosition="start" />
            </Tabs>

            <IconButton sx={{ bgcolor: '#F8FAFC' }}>
              <FilterIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            {isCouponLoading && coupons.length === 0 ? (
              <Grid container spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Grid item xs={12} key={i}>
                    <Skeleton variant="rounded" height={120} sx={{ borderRadius: '20px' }} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <CouponList
                // Pass the STRICTLY filtered list here
                coupons={filteredCoupons} // This is the strictly filtered array
                isCouponLoading={isCouponLoading}
                onEdit={(coupon) => {
                  setSelectedCoupon(coupon);
                  setIsCreateDialogOpen(true);
                }}
              />
            )}
          </Box>
        </Paper>
      </Container>

      <CreateCouponDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} initialData={selectedCoupon} />
    </Box>
  );
};

export default CouponsPage;
