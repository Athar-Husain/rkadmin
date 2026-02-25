import React from 'react';
import { useDispatch } from 'react-redux'; // 1. Import useDispatch
import { Box, Stack, Typography, alpha, useTheme } from '@mui/material';
import { resetCustomerState } from '../../../redux/features/Customers/CustomerSlice';
import { resetConnectionState } from '../../../redux/features/Connection/ConnectionSlice';

const StepNavigation = ({ currentStep, totalSteps, stepLabels }) => {
  const theme = useTheme();
  const dispatch = useDispatch(); // 2. Initialize dispatch

  const handleClear = () => {
    dispatch(resetCustomerState());
    dispatch(resetConnectionState());
    // Optional: If you use a router, you might want to redirect to step 1
    window.location.reload(); // Hard reset if needed
  };

  return (
    <Box sx={{ width: '100%', mb: 5 }}>
      <Stack direction="row" spacing={2} justifyContent="center">
        {[...Array(totalSteps).keys()].map((index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <Box key={index} sx={{ textAlign: 'center', flex: 1, maxWidth: 120 }}>
              <Box
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: isCompleted
                    ? theme.palette.success.main
                    : isActive
                      ? theme.palette.primary.main
                      : alpha(theme.palette.divider, 0.5),
                  transition: 'all 0.4s ease',
                  mb: 1
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isActive || isCompleted ? 800 : 500,
                  color: isActive ? 'text.primary' : 'text.disabled',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                {stepLabels[index]}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      {/* 3. Fixed the onClick and added styling */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Typography
          onClick={handleClear}
          sx={{
            cursor: 'pointer',
            fontSize: '0.75rem',
            color: theme.palette.error.main,
            fontWeight: 700,
            '&:hover': { textDecoration: 'underline', opacity: 0.8 }
          }}
        >
          ✕ CLEAR SESSION DATA
        </Typography>
      </Box>
    </Box>
  );
};

export default StepNavigation;
