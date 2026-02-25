import React, { useState, useMemo } from 'react';
import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  Button,
  Box,
  alpha,
  useTheme,
  IconButton,
  Paper,
  Avatar
} from '@mui/material';
import {
  AddRounded as AddIcon,
  ConfirmationNumberTwoTone as CouponIcon,
  HistoryTwoTone as HistoryIcon,
  CloseRounded as CloseIcon,
  TrendingUpTwoTone as AnalyticsIcon,
  EventAvailableTwoTone as ActiveIcon
} from '@mui/icons-material';
import CouponList from './CouponList';
import CouponForm from './CouponForm';
import RedemptionHistoryTable from './RedemptionHistoryTable';
import CreateCouponDialog from './CreateCouponDialog';

const CouponsPage = () => {
  const theme = useTheme();
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleViewHistory = (coupon) => {
    setSelectedCoupon(coupon);
    setIsHistoryOpen(true);
  };
  const fetchCoupons = () => {
    dispatch(fetchAllCouponsAdmin());
  };

  const handleClose = () => {
    setSelectedCoupon(null);
    setIsFormOpen(false);
    setIsHistoryOpen(false);
  };

  // useEffect(() => {
  //   dispatch(fetchAllCouponsAdmin());
  // }, [dispatch]);

  return (
    <Box sx={{ bgcolor: '#F4F7FA', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="xl">
        {/* --- Header Section --- */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ py: 4 }} spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={900} sx={{ color: '#1A2027', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CouponIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              Marketing Hub
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure discounts, track redemptions, and manage promotional campaigns.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
            sx={{
              borderRadius: '12px',
              px: 4,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 800,
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`
            }}
          >
            Create New Coupon
          </Button>
        </Stack>

        {/* --- KPI Stats Section --- */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <KPICard title="Total Coupons" value="24" icon={<CouponIcon />} color={theme.palette.primary.main} />
          <KPICard title="Active Now" value="12" icon={<ActiveIcon />} color="#2e7d32" />
          <KPICard title="Total Savings" value="₹45.2k" icon={<AnalyticsIcon />} color="#ed6c02" />
        </Stack>

        {/* --- Main List Section --- */}
        <Paper
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid #E0E4E8',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            bgcolor: '#fff'
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid #F1F5F9' }}>
            <Typography variant="subtitle1" fontWeight={800}>
              Live Offers & Discounts
            </Typography>
          </Box>
          <CouponList onEdit={handleEdit} onViewHistory={handleViewHistory} />
        </Paper>

        {/* --- Coupon Form Modal --- */}
        <Dialog
          open={isFormOpen}
          onClose={handleClose}
          fullWidth
          maxWidth="md"
          PaperProps={{ sx: { borderRadius: '24px', boxShadow: theme.shadows[10] } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
            <Typography variant="h6" fontWeight={800}>
              {selectedCoupon?._id ? 'Modify Campaign' : 'New Discount Campaign'}
            </Typography>
            <IconButton onClick={handleClose} size="small" sx={{ bgcolor: '#F8FAFC' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 4, borderTop: '1px solid #F1F5F9' }}>
            <CouponForm initialData={selectedCoupon || {}} onClose={handleClose} />
          </DialogContent>
        </Dialog>

        {/* --- Redemption History Modal --- */}
        <Dialog open={isHistoryOpen} onClose={handleClose} fullWidth maxWidth="lg" PaperProps={{ sx: { borderRadius: '24px' } }}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, bgcolor: '#F8FAFC' }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ bgcolor: 'secondary.main', color: '#fff', p: 1, borderRadius: '10px', display: 'flex' }}>
                <HistoryIcon fontSize="small" />
              </Box>
              <Typography variant="h6" fontWeight={800}>
                Redemption Analytics
              </Typography>
            </Stack>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <RedemptionHistoryTable couponId={selectedCoupon?._id} />
          </DialogContent>
        </Dialog>
      </Container>

      <CreateCouponDialog open={isOpen} onClose={() => setIsOpen(false)} onRefresh={fetchCoupons} />
    </Box>
  );
};

/**
 * Reusable KPI Card Component
 */
const KPICard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2.5,
      flex: 1,
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      border: '1px solid',
      borderColor: alpha(color, 0.1),
      bgcolor: '#fff',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)' }
    }}
  >
    <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 54, height: 54, mr: 2, borderRadius: '14px' }}>
      {React.cloneElement(icon, { sx: { fontSize: 28 } })}
    </Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={900}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

export default CouponsPage;
