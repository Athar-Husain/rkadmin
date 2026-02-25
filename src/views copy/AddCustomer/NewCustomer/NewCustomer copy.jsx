import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Container, Box } from '@mui/material';
import CustomerDetails from './CustomerDetails';
import ConnectionDetails from '../Shared/ConnectionDetails';
import PlanSelection from '../Shared/PlanSelection';
import StepNavigation from '../Shared/StepNavigation';
import { registerCustomer, resetCustomerState } from '../../../redux/features/Customers/CustomerSlice';
import { createConnection } from '../../../redux/features/Connection/ConnectionSlice';
import { subscribeToPlan } from '../../../redux/features/Plan/PlanSlice';

const NewCustomer = () => {
    const dispatch = useDispatch();
    const { newCustomer, isSuccess } = useSelector((state) => state.customer);
    console.log("new customer in newcustomer component", newCustomer);
    const [currentStep, setCurrentStep] = useState(1);
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        if (isSuccess && currentStep === 1) {
            setCurrentStep(2);
        }
        return () => {
            dispatch(resetCustomerState());
        };
    }, [isSuccess, dispatch, currentStep]);

    const handleCustomerSubmit = (data) => {
        dispatch(registerCustomer(data));
    };

    const handleConnectionSubmit = async (data) => {
        if (!newCustomer) {
            toast.error('Customer data is missing. Please go back to the first step.');
            return;
        }
        try {
            const connectionData = { ...data, customerId: newCustomer.id };
            // console.log("connection data in new customer", connectionData);
            const connectionResponse = await dispatch(createConnection(connectionData)).unwrap();
            setConnection(connectionResponse);
            setCurrentStep(3);
        } catch (error) {
            toast.error('Failed to create connection: ' + (error.message || 'An unknown error occurred.'));
        }
    };

    const handlePlanSubmit = async (data) => {
        if (!newCustomer || !connection) {
            toast.error('Customer or connection data is missing. Please complete previous steps.');
            return;
        }

        // console.log("connection in new customer", connection.connection._id);
        // console.log("newCustomer in new customer", newCustomer.id);
        try {
            const planData = {
                ...data,
                customerId: newCustomer.id,
                connectionId: connection.connection._id
            };

            // console.log("plan data in new Data", data);
            console.log("plan data in new New customer", planData);
            await dispatch(subscribeToPlan(planData)).unwrap();
            toast.success('New customer and plan successfully added!');
            setCurrentStep(1);
            setConnection(null);
        } catch (error) {
            toast.error('Failed to subscribe to plan: ' + (error.message || 'An unknown error occurred.'));
        }
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    const getForm = () => {
        switch (currentStep) {
            case 1:
                return <CustomerDetails onSubmit={handleCustomerSubmit} />;
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

export default NewCustomer;
