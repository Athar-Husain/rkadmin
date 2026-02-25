import React, { useState } from 'react';
import { Container, Dialog, DialogTitle, DialogContent, Stack, Typography, Button } from '@mui/material';
import CouponList from './CouponList';
import CouponForm from './CouponForm';
import RedemptionHistoryTable from './RedemptionHistoryTable';

const CouponsPage = () => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleViewHistory = (coupon) => {
    setSelectedCoupon(coupon);
    setIsHistoryOpen(true);
  };

  const handleClose = () => {
    setSelectedCoupon(null);
    setIsFormOpen(false);
    setIsHistoryOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
        <Stack>
          <Typography variant="h4" fontWeight={700}>
            Coupons Management
          </Typography>
          <Typography color="text.secondary">Create, edit, and monitor all coupons.</Typography>
        </Stack>
        <Button variant="contained" color="primary" onClick={() => setIsFormOpen(true)}>
          Create New Coupon
        </Button>
      </Stack>

      <CouponList onEdit={handleEdit} onViewHistory={handleViewHistory} />

      {/* Coupon Form Modal */}
      <Dialog open={isFormOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{selectedCoupon ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
        <DialogContent>
          {/* <CouponForm initialData={selectedCoupon} onClose={handleClose} /> */}

          <CouponForm initialData={selectedCoupon || {}} onClose={handleClose} />
        </DialogContent>
      </Dialog>

      {/* Redemption History Modal */}
      <Dialog open={isHistoryOpen} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Redemption History</DialogTitle>
        <DialogContent>
          <RedemptionHistoryTable couponId={selectedCoupon?._id} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CouponsPage;
