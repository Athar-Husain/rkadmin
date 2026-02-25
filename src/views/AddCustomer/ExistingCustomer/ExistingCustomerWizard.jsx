import React, { useState } from 'react';
import { Box, Fade } from '@mui/material';
import StepNavigation from '../Shared/StepNavigation';

// Internal Steps for Existing Flow
import Step1_Search from './Step1_Search.jsx';
import Step2_AddConnection from './Step2_AddConnection.jsx';
import Step3_AssignPlan from './Step3_AssignPlan.jsx';
import { resetCustomerState } from '../../../redux/features/Customers/CustomerSlice';
import { useDispatch } from 'react-redux';

const ExistingCustomerWizard = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);

  // State specific to finding and updating an existing user
  const [targetCustomer, setTargetCustomer] = useState(null);
  const [activeConnection, setActiveConnection] = useState(null);

  const stepLabels = ['Find Customer', 'New Connection', 'Activate Plan'];

  const handleCustomerFound = (customer) => {
    setTargetCustomer(customer);
    setCurrentStep(2);
  };

  const handleConnectionCreated = (connection) => {
    setActiveConnection(connection);
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setTargetCustomer(null);
    setActiveConnection(null);
    // resetCustomerState()
    dispatch(resetCustomerState());
  };

  return (
    <Box sx={{ width: '100%' }}>
      <StepNavigation currentStep={currentStep} totalSteps={3} stepLabels={stepLabels} />

      <Box sx={{ mt: 2 }}>
        {currentStep === 1 && (
          <Fade in={currentStep === 1}>
            <Box>
              <Step1_Search onNext={handleCustomerFound} />
            </Box>
          </Fade>
        )}

        {currentStep === 2 && (
          <Fade in={currentStep === 2}>
            <Box>
              <Step2_AddConnection customer={targetCustomer} onNext={handleConnectionCreated} onBack={handleBack} />
            </Box>
          </Fade>
        )}

        {currentStep === 3 && (
          <Fade in={currentStep === 3}>
            <Box>
              <Step3_AssignPlan customer={targetCustomer} connection={activeConnection} onComplete={handleReset} onBack={handleBack} />
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default ExistingCustomerWizard;
