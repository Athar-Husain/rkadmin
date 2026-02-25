import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  alpha,
  useTheme,
  CircularProgress,
  Card,
  CardContent,
  Radio,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import {
  SpeedRounded as SpeedIcon,
  ArrowBackRounded as BackIcon,
  CheckCircleRounded as CompleteIcon,
  BoltRounded as PlanIcon,
  CalendarMonthRounded as DurationIcon
} from '@mui/icons-material';
import { getAllPlans, subscribeToPlan } from '../../../redux/features/Plan/PlanSlice';
import { toast } from 'react-toastify';

const Step3_PlanSelection = ({ customer, connection, onComplete, onBack }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const { allPlans, isPlanLoading } = useSelector((state) => state.plan);

  const { newCustomer } = useSelector((state) => state.customer);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  const handleSubscribe = async () => {
    if (!selectedPlanId) {
      toast.warn('Please select a plan to continue');
      return;
    }

    try {
      setSubmitting(true);
      const planData = {
        planId: selectedPlanId,
        customerId: newCustomer.id,
        connectionId: connection._id
      };
      await dispatch(subscribeToPlan(planData)).unwrap();
      toast.success('Onboarding Complete!');
      onComplete();
    } catch (error) {
      toast.error(error || 'Subscription failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* MINIMAL REVIEW HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          mb: 4,
          p: 2,
          borderRadius: '12px',
          bgcolor: '#F8FAFC',
          border: '1px solid #E2E8F0'
        }}
      >
        <Box>
          <Typography variant="caption" color="text.disabled" fontWeight={700}>
            CUSTOMER
          </Typography>
          <Typography variant="body2" fontWeight={700} color="#1B2559">
            {newCustomer?.firstName} {newCustomer?.lastName}
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />
        <Box textAlign="right">
          <Typography variant="caption" color="text.disabled" fontWeight={700}>
            User ID
          </Typography>
          <Typography variant="body2" fontWeight={700} color="#1B2559" sx={{ fontFamily: 'monospace' }}>
            {connection?.userId || 'N/A'}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="caption" color="text.disabled" fontWeight={700}>
            BOx ID
          </Typography>
          <Typography variant="body2" fontWeight={700} color="#1B2559" sx={{ fontFamily: 'monospace' }}>
            {connection?.boxId || 'N/A'}
          </Typography>
        </Box>
      </Stack>

      <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Select Service Plan
      </Typography>

      {isPlanLoading ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Grid container spacing={2} mb={4}>
          {allPlans?.map((plan) => {
            const isSelected = selectedPlanId === plan._id;
            return (
              <Grid size={{ xs: 12, sm: 6 }} key={plan._id}>
                <Card
                  onClick={() => setSelectedPlanId(plan._id)}
                  elevation={0}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: '16px',
                    transition: 'all 0.2s ease-in-out',
                    border: '2px solid',
                    borderColor: isSelected ? '#4318FF' : '#E2E8F0',
                    bgcolor: isSelected ? alpha('#4318FF', 0.02) : '#fff',
                    '&:hover': {
                      borderColor: isSelected ? '#4318FF' : alpha('#4318FF', 0.4),
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    {/* Featured Badge */}
                    {plan.featured && (
                      <Chip
                        label="Popular"
                        size="small"
                        color="primary"
                        sx={{ position: 'absolute', top: 12, right: 45, height: 20, fontSize: '0.65rem', fontWeight: 900 }}
                      />
                    )}

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: isSelected ? '#4318FF' : '#F4F7FE',
                            color: isSelected ? '#fff' : '#4318FF',
                            width: 34,
                            height: 34
                          }}
                        >
                          <PlanIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={800} color="#1B2559">
                            {plan.name}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Stack direction="row" spacing={0.3} alignItems="center">
                              <SpeedIcon sx={{ fontSize: 12, color: '#707EAE' }} />
                              <Typography variant="caption" fontWeight={600} color="#707EAE">
                                {plan.internetSpeed} {plan.internetSpeedUnit}
                              </Typography>
                            </Stack>
                            <Typography variant="caption" color="divider">
                              |
                            </Typography>
                            <Stack direction="row" spacing={0.3} alignItems="center">
                              <DurationIcon sx={{ fontSize: 12, color: '#707EAE' }} />
                              <Typography variant="caption" fontWeight={600} color="#707EAE">
                                {plan.duration?.replace('-', ' ')}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Stack>
                      <Radio checked={isSelected} size="small" sx={{ p: 0.5, color: '#E2E8F0', '&.Mui-checked': { color: '#4318FF' } }} />
                    </Stack>

                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #F4F7FE' }}>
                      <Stack direction="row" alignItems="baseline" spacing={0.5}>
                        <Typography variant="h6" fontWeight={900} color="#1B2559">
                          ₹{plan.price.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          total
                        </Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* COMPACT ACTIONS */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button
          variant="text"
          onClick={onBack}
          startIcon={<BackIcon sx={{ fontSize: 14 }} />}
          sx={{ color: '#707EAE', fontWeight: 700, textTransform: 'none', fontSize: '0.8rem' }}
        >
          Back to Hardware
        </Button>
        <Button
          variant="contained"
          onClick={handleSubscribe}
          disabled={submitting || !selectedPlanId}
          endIcon={!submitting && <CompleteIcon />}
          sx={{
            px: 3,
            py: 1,
            borderRadius: '10px',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '0.85rem',
            bgcolor: '#1B2559',
            boxShadow: `0 4px 14px 0 ${alpha('#1B2559', 0.2)}`,
            '&:hover': { bgcolor: '#0B1437' }
          }}
        >
          {submitting ? <CircularProgress size={18} color="inherit" /> : 'Activate Connection'}
        </Button>
      </Stack>
    </Box>
  );
};

export default Step3_PlanSelection;
