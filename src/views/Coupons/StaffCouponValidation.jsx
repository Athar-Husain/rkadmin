import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { redeemCouponStaff, validateCouponStaff } from '../../redux/features/Coupons/CouponSlice';

const StaffCouponValidation = () => {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');

  const handleValidate = () => {
    dispatch(validateCouponStaff({ code }));
  };

  const handleRedeem = () => {
    dispatch(redeemCouponStaff({ code }));
  };

  return (
    <Box p={4} maxWidth={500} mx="auto">
      <Typography variant="h5" mb={3}>
        Validate / Redeem Coupon
      </Typography>
      <TextField fullWidth label="Coupon Code" value={code} onChange={(e) => setCode(e.target.value)} />
      <Box mt={2} display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={handleValidate}>
          Validate
        </Button>
        <Button variant="contained" color="secondary" onClick={handleRedeem}>
          Redeem
        </Button>
      </Box>
    </Box>
  );
};

export default StaffCouponValidation;
