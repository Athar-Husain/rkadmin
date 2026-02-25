import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCoupons, claimCoupon } from '../../features/coupons/CouponSlice';
import { Box, Button, Typography, Card, CardContent, Grid } from '@mui/material';

const UserCouponWallet = () => {
  const dispatch = useDispatch();
  const { myCoupons } = useSelector((state) => state.coupon);

  useEffect(() => {
    dispatch(fetchMyCoupons());
  }, [dispatch]);

  const handleClaim = (id) => {
    dispatch(claimCoupon(id));
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        My Coupons
      </Typography>
      <Grid container spacing={2}>
        {myCoupons.map((coupon) => (
          <Grid item xs={12} sm={6} md={4} key={coupon._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{coupon.name}</Typography>
                <Typography>Code: {coupon.code}</Typography>
                <Typography>Discount: {coupon.discount}</Typography>
                <Typography>Expiry: {new Date(coupon.expiryDate).toLocaleDateString()}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={() => handleClaim(coupon._id)}
                  disabled={coupon.isClaimed}
                >
                  {coupon.isClaimed ? 'Claimed' : 'Claim'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserCouponWallet;
