import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Container, Box } from '@mui/material';
import SearchCustomer from './SearchCustomer';
import ConnectionDetails from '../Shared/ConnectionDetails';
import PlanSelection from '../Shared/PlanSelection';
import StepNavigation from '../Shared/StepNavigation';
import { createConnection } from '../../../redux/features/Connection/ConnectionSlice';
import { subscribeToPlan } from '../../../redux/features/Plan/PlanSlice';
import { resetCustomerState } from '../../../redux/features/Customers/CustomerSlice';

const ExistingCustomer = () => {
    const dispatch = useDispatch();
    const { searchedCustomer } = useSelector((state) => state.customer);
    const { newConnection } = useSelector((state) => state.connection); // Changed from customer to connection slice
    const [currentStep, setCurrentStep] = useState(1);

    // This state is to hold the connection data received from the backend
    const [connectionData, setConnectionData] = useState(null);

    const handleSearchNext = () => {
        // This function is called from SearchCustomer after a customer is found and confirmed.
        setCurrentStep(2);
    };

    const handleConnectionSubmit = async (data) => {
        if (!searchedCustomer) {
            toast.error('Customer data is missing. Please search for a customer first.');
            return;
        }
        try {
            const connectionDataPayload = { ...data, customerId: searchedCustomer._id };
            const connectionResponse = await dispatch(createConnection(connectionDataPayload)).unwrap();
            setConnectionData(connectionResponse.connection);
            setCurrentStep(3);
        } catch (error) {
            toast.error('Failed to create connection: ' + (error.message || 'An unknown error occurred.'));
        }
    };

    const handlePlanSubmit = async (data) => {
        if (!searchedCustomer || !connectionData) {
            toast.error('Customer or connection data is missing. Please complete previous steps.');
            return;
        }
        try {
            const planData = {
                ...data,
                customerId: searchedCustomer._id,
                connectionId: connectionData._id,
            };
            await dispatch(subscribeToPlan(planData)).unwrap();
            toast.success('Plan successfully subscribed for existing customer!');
            setCurrentStep(1);
            setConnectionData(null); // Reset connection data for a new flow
            dispatch(resetCustomerState());
        } catch (error) {
            toast.error('Failed to subscribe to plan: ' + (error.message || 'An unknown error occurred.'));
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            if (currentStep === 3) {
                // If coming back from Plan Selection, reset connection data
                setConnectionData(null);
            }
        }
    };

    const getForm = () => {
        switch (currentStep) {
            case 1:
                return <SearchCustomer onSearchNext={handleSearchNext} />;
            case 2:
                return <ConnectionDetails onSubmit={handleConnectionSubmit} prevStep={prevStep} />;
            case 3:
                return <PlanSelection onSubmit={handlePlanSubmit} prevStep={prevStep} />;
            default:
                return null;
        }
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, gap: 3 }}>
                <StepNavigation currentStep={currentStep} totalSteps={3} />
                <Box sx={{ width: '100%' }}>
                    {getForm()}
                </Box>
            </Box>
        </Container>
    );
};

export default ExistingCustomer;
