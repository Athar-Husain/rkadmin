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
    const { newConnection } = useSelector((state) => state.customer);
    const [currentStep, setCurrentStep] = useState(1);
    const [connection, setConnection] = useState(null);

    const handleSearch = () => {
        setCurrentStep(2);
    };

    const handleConnectionSubmit = async (data) => {
        if (!searchedCustomer) {
            toast.error('Customer data is missing. Please search for a customer first.');
            return;
        }
        try {
            const connectionData = { ...data, customerId: searchedCustomer._id };
            const connectionResponse = await dispatch(createConnection(connectionData)).unwrap();
            setConnection(connectionResponse);
            setCurrentStep(3);
        } catch (error) {
            toast.error('Failed to create connection: ' + (error.message || 'An unknown error occurred.'));
        }
    };

     console.log("connection in Existing customer", searchedCustomer);

    const handlePlanSubmit = async (data) => {
        if (!searchedCustomer || !connection) {
            toast.error('Customer or connection data is missing. Please complete previous steps.');
            return;
        }
        try {
            const planData = {
                ...data,
                customerId: searchedCustomer._id,
                connectionId: connection.connection._id
            };
            await dispatch(subscribeToPlan(planData)).unwrap();
            toast.success('Plan successfully subscribed for existing customer!');
            setCurrentStep(1);
            setConnection(null);
            dispatch(resetCustomerState());
        } catch (error) {
            toast.error('Failed to subscribe to plan: ' + (error.message || 'An unknown error occurred.'));
        }
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    const getForm = () => {
        switch (currentStep) {
            case 1:
                return <SearchCustomer handleSearch={handleSearch} />;
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
