import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  alpha,
  useTheme,
  CircularProgress,
  Card,
  Avatar,
  Stack,
  Divider,
  Fade
} from '@mui/material';
import {
  PhoneIphoneOutlined as PhoneIcon,
  SearchOutlined as SearchIcon,
  VerifiedUserOutlined as VerifiedIcon,
  ArrowForwardIos as NextIcon
} from '@mui/icons-material';
import { resetCustomerState, searchCustomerByPhone } from '../../../redux/features/Customers/CustomerSlice';

const Step1_Search = ({ onNext }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Using the search specific state from your slice
  const { searchedCustomer, isLoading } = useSelector((state) => state.customer);

  const onSearch = async (data) => {
    dispatch(searchCustomerByPhone(data.phone));
    dispatch(resetCustomerState());
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Find Customer
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Search by registered mobile number
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSearch)}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <TextField
            fullWidth
            label="Phone Number"
            placeholder="e.g. 9876543210"
            {...register('phone', { required: 'Enter phone number' })}
            error={!!errors.phone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              )
            }}
          />
          <Button type="submit" variant="contained" disabled={isLoading} sx={{ px: 4, py: 1.8, borderRadius: 3, fontWeight: 700 }}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
          </Button>
        </Stack>
      </form>

      {/* SEARCH RESULT PREVIEW */}
      {searchedCustomer && (
        <Fade in={!!searchedCustomer}>
          <Card
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.success.main, 0.03),
              border: `1px solid ${theme.palette.success.light}`,
              boxShadow: 'none'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: theme.palette.success.main,
                  fontSize: '1.5rem',
                  fontWeight: 800
                }}
              >
                {searchedCustomer.firstName?.[0]}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                  {searchedCustomer.firstName} {searchedCustomer.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchedCustomer.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connecctions - {searchedCustomer.connections.length || 0}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <VerifiedIcon color="success" sx={{ fontSize: 16 }} />
                  <Typography variant="caption" color="success.main" fontWeight={700}>
                    VERIFIED CUSTOMER
                  </Typography>
                </Stack>
              </Box>
              <Button
                variant="contained"
                color="success"
                endIcon={<NextIcon />}
                onClick={() => onNext(searchedCustomer)}
                sx={{ borderRadius: 3, fontWeight: 700 }}
              >
                Confirm & Proceed
              </Button>
            </Stack>
          </Card>
        </Fade>
      )}
    </Paper>
  );
};

export default Step1_Search;
