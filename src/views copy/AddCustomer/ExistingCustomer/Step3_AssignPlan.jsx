import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
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
  Chip
} from '@mui/material';
import {
  Speed as SpeedIcon,
  ArrowBackIosNew as BackIcon,
  FlashOnOutlined as ActivateIcon,
  CalendarMonthOutlined as TimeIcon,
  AllInclusiveOutlined as DataIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { getAllPlans, subscribeToPlan } from '../../../redux/features/Plan/PlanSlice';
import { toast } from 'react-toastify';

const Step3_AssignPlan = ({ customer, connection, onComplete, onBack }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const { allPlans, isPlanLoading } = useSelector((state) => state.plan);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  const handleActivation = async () => {
    if (!selectedPlanId) {
      toast.warn('Please select a plan to activate');
      return;
    }

    try {
      setSubmitting(true);
      const planData = {
        planId: selectedPlanId,
        customerId: customer._id,
        connectionId: connection._id
      };

      await dispatch(subscribeToPlan(planData)).unwrap();
    //   toast.success(`Service activated for ${customer.firstName}!`);
      onComplete();
    } catch (error) {
      toast.error(error || 'Activation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* TARGET SUMMARY CARD */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#fafafa'
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ letterSpacing: 1 }}>
            NEW CONNECTION FOR
          </Typography>
          <Typography variant="body1" fontWeight={700}>
            {customer?.firstName} {customer?.lastName} —{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              {connection?.aliasName || 'Primary'}
            </Box>
          </Typography>
        </Stack>
        <Chip label={connection?.stbNumber} variant="outlined" size="small" sx={{ fontWeight: 700, fontFamily: 'monospace' }} />
      </Paper>

      <Typography variant="h5" fontWeight={800} mb={3}>
        Select Subscription Plan
      </Typography>

      {isPlanLoading ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} mb={4}>
          {allPlans?.map((plan) => {
            const isSelected = selectedPlanId === plan._id;
            return (
              <Grid size={{xs:12, sm:6}} key={plan._id}>
                <Card
                  onClick={() => setSelectedPlanId(plan._id)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 4,
                    position: 'relative',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : alpha(theme.palette.divider, 0.1),
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows[4] }
                  }}
                >
                  {plan.featured && (
                    <Box sx={{ position: 'absolute', top: 12, right: 45 }}>
                      <Chip
                        icon={<StarIcon sx={{ fontSize: '14px !important' }} />}
                        label="Best Value"
                        size="small"
                        color="secondary"
                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 900 }}
                      />
                    </Box>
                  )}

                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="h6" fontWeight={800} sx={{ textTransform: 'capitalize' }}>
                          {plan.name}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
                          <SpeedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                          <Typography variant="body2" fontWeight={700}>
                            {plan.internetSpeed} {plan.internetSpeedUnit}
                          </Typography>
                        </Stack>
                      </Box>
                      <Radio checked={isSelected} sx={{ p: 0 }} />
                    </Stack>

                    <Stack direction="row" spacing={2} mt={2}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <TimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          {plan.duration}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <DataIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          {plan.dataLimitType === 'unlimited' ? 'Unlimited Data' : `${plan.dataLimit} GB`}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                    <Typography variant="h5" fontWeight={900} color={isSelected ? 'primary.main' : 'text.primary'}>
                      ₹{plan.price.toLocaleString()}
                      <Box component="span" sx={{ fontSize: '0.8rem', fontWeight: 500, color: 'text.secondary', ml: 0.5 }}>
                        total
                      </Box>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          fullWidth
          onClick={onBack}
          startIcon={<BackIcon sx={{ fontSize: 14 }} />}
          sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
        >
          Back to Hardware
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleActivation}
          disabled={submitting || !selectedPlanId}
          startIcon={!submitting && <ActivateIcon />}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 800,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
          }}
        >
          {submitting ? 'Activating...' : 'Confirm Activation'}
        </Button>
      </Stack>
    </Box>
  );
};

export default Step3_AssignPlan;
