import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, IconButton, Stack, Tooltip, Typography, alpha, useTheme } from '@mui/material';
// import { CloseIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { resetCustomerState } from '../../../redux/features/Customers/CustomerSlice';
import { resetConnectionState } from '../../../redux/features/Connection/ConnectionSlice';

const StepNavigation = ({ currentStep, totalSteps, stepLabels }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleClear = () => {
    dispatch(resetCustomerState());
    dispatch(resetConnectionState());
    // Optional: navigate to first step if router exists
  };

  return (
    <Box sx={{ width: '100%', mb: 1 }}>
      {/* STEP TRACKER */}
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <Box
              key={stepNum}
              sx={{
                flex: 1,
                textAlign: 'center',
                px: 0.5,
                mb: 0.5
              }}
            >
              {/* PROGRESS BAR */}
              <Box
                sx={{
                  height: 6,
                  borderRadius: 4,
                  mb: 1,
                  bgcolor: isCompleted
                    ? theme.palette.success.main
                    : isActive
                      ? theme.palette.primary.main
                      : alpha(theme.palette.divider, 0.4),

                  transform: isActive ? 'scaleX(1.05)' : 'scaleX(1)',
                  boxShadow: isActive ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}` : 'none',

                  transition: 'all 0.3s cubic-bezier(.4,0,.2,1)'
                }}
              />

              {/* LABEL */}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontSize: '0.65rem',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  fontWeight: isActive || isCompleted ? 800 : 500,
                  color: isActive ? 'text.primary' : isCompleted ? theme.palette.success.main : 'text.disabled',
                  transition: 'color 0.2s ease'
                }}
              >
                {stepLabels[index]}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      {/* CLEAR SESSION */}

      {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
        <Tooltip title="Clear session data" arrow>
          <IconButton
            size="small"
            onClick={handleClear}
            sx={{
              color: theme.palette.error.main,
              p: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.1)
              }
            }}
          >
            <CloseIcon fontSize="small" /> Clear Data
          </IconButton>
        </Tooltip>
      </Box> */}
    </Box>
  );
};

export default StepNavigation;
