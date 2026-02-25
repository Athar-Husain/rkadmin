import React, { useState } from 'react';
import { Box, Fade, Paper, Typography, Stack, alpha } from '@mui/material';
import StepNavigation from '../Shared/StepNavigation';

// Internal Steps
import Step1_Profile from './Step1_Profile.jsx';
import Step2_Connection from './Step2_Connection.jsx';
import Step3_PlanSelection from './Step3_PlanSelection.jsx';
import { resetCustomerState } from '../../../redux/features/Customers/CustomerSlice';
import { resetConnectionState } from '../../../redux/features/Connection/ConnectionSlice';
import { useDispatch } from 'react-redux';

const NewCustomerWizard = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdCustomer, setCreatedCustomer] = useState(null);
  const [createdConnection, setCreatedConnection] = useState(null);

  const stepLabels = ['Profile', 'Hardware', 'Plans'];

  const handleStep1Complete = (customer) => {
    setCreatedCustomer(customer);
    setCurrentStep(2);
  };

  const handleStep2Complete = (connection) => {
    setCreatedConnection(connection);
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setCreatedCustomer(null);
    setCreatedConnection(null);
    dispatch(resetCustomerState());
    dispatch(resetConnectionState());
    // Optional: If you use a router, you might want to redirect to step 1
    // window.location.reload();
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto' }}>
      {/* COMPACT STEP NAVIGATION */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: '16px',
          bgcolor: alpha('#4318FF', 0.03),
          border: '1px dashed',
          borderColor: alpha('#4318FF', 0.2)
        }}
      >
        <StepNavigation
          currentStep={currentStep}
          totalSteps={3}
          stepLabels={stepLabels}
          size="small" // Pass a prop to shrink the dots/text in your StepNavigation component
        />
      </Paper>

      {/* CONTENT CARD */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: '24px',
          bgcolor: '#fff',
          boxShadow: '0px 20px 50px rgba(112, 144, 176, 0.08)',
          minHeight: '400px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* STEP INDICATOR HEADER */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="caption" fontWeight={800} color="primary.main" sx={{ textTransform: 'uppercase' }}>
              Step 0{currentStep}
            </Typography>
            <Typography variant="h6" fontWeight={800} color="#1B2559">
              {stepLabels[currentStep - 1]}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
            {currentStep} / 3
          </Typography>
        </Stack>

        <Box>
          {currentStep === 1 && (
            <Fade in={currentStep === 1} timeout={400}>
              <Box>
                <Step1_Profile onNext={handleStep1Complete} />
              </Box>
            </Fade>
          )}

          {currentStep === 2 && (
            <Fade in={currentStep === 2} timeout={400}>
              <Box>
                <Step2_Connection customer={createdCustomer} onNext={handleStep2Complete} onBack={handleBack} />
              </Box>
            </Fade>
          )}

          {currentStep === 3 && (
            <Fade in={currentStep === 3} timeout={400}>
              <Box>
                <Step3_PlanSelection
                  customer={createdCustomer}
                  connection={createdConnection}
                  onComplete={handleReset}
                  onBack={handleBack}
                />
              </Box>
            </Fade>
          )}
        </Box>
      </Paper>

      {/* HELPER FOOTER */}
      <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ display: 'block', mt: 3, opacity: 0.7 }}>
        Progress is saved automatically. Need help? Contact system administrator.
      </Typography>
    </Box>
  );
};

export default NewCustomerWizard;
