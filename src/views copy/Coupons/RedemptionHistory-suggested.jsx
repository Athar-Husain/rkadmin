import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Stack,
  alpha,
  useTheme,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  PersonTwoTone as UserIcon,
  StoreTwoTone as StoreIcon,
  AccessTimeRounded as TimeIcon,
  ReceiptLongTwoTone as BillIcon,
  CurrencyRupeeRounded as CashIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
// Assuming you have a thunk for this, otherwise use local state
// import { fetchRedemptionHistory } from '../../redux/features/Coupons/CouponSlice';

const RedemptionHistoryTable = ({ couponId }) => {
  const theme = useTheme();
  // Mock data for demonstration - replace with your Redux selector
  const history = [
    {
      _id: '1',
      invoiceNumber: 'INV-9921',
      createdAt: new Date().toISOString(),
      finalAmount: 1250,
      discount: 250,
      userId: { name: 'Rahul Sharma', mobile: '9876543210' },
      storeId: { name: 'Main Hub', code: 'BAL-JAG-402', location: { city: 'BALLARI' } }
    }
  ];

  const isLoading = false; // Replace with actual loading state

  if (isLoading)
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
        <CircularProgress size={32} />
        <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
          Fetching records...
        </Typography>
      </Stack>
    );

  return (
    <TableContainer component={Box} sx={{ maxHeight: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ bgcolor: '#F8FAFC', fontWeight: 800 }}>Customer</TableCell>
            <TableCell sx={{ bgcolor: '#F8FAFC', fontWeight: 800 }}>Store Outlet</TableCell>
            <TableCell sx={{ bgcolor: '#F8FAFC', fontWeight: 800 }}>Transaction</TableCell>
            <TableCell sx={{ bgcolor: '#F8FAFC', fontWeight: 800 }}>Savings</TableCell>
            <TableCell sx={{ bgcolor: '#F8FAFC', fontWeight: 800 }}>Date & Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                <Typography variant="body2" color="text.secondary">
                  No redemptions recorded for this coupon yet.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            history.map((row) => (
              <TableRow key={row._id} hover>
                {/* Customer Info */}
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                      <UserIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
                        {row.userId?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.userId?.mobile}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                {/* Store Info */}
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <StoreIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {row.storeId?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800 }}>
                        {row.storeId?.code}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                {/* Transaction Info */}
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BillIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        ₹{row.finalAmount.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.invoiceNumber}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                {/* Savings/Discount */}
                <TableCell>
                  <Chip label={`-₹${row.discount}`} size="small" color="success" sx={{ fontWeight: 900, borderRadius: '6px' }} />
                </TableCell>

                {/* Timestamp */}
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TimeIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    <Box>
                      <Typography variant="body2">
                        {new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(row.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RedemptionHistoryTable;
