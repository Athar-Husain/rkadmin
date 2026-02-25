import React, { useEffect, useState } from 'react';
import {
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Box,
    Typography,
    Paper,
    Grid
} from '@mui/material';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
// import { getAllPlans } from 'redux/features/Plan/PlanSlice';
import { getAllPlans } from '../../../redux/features/Plan/PlanSlice';

// const plans = [
//     { id: 'plan-1', name: 'Basic Plan', price: 199 },
//     { id: 'plan-2', name: 'Standard Plan', price: 399 },
//     { id: 'plan-3', name: 'Premium Plan', price: 599 },
// ];


const PlanSelection = ({ onSubmit, prevStep }) => {
    const dispatch = useDispatch();
    const [selectedPlanId, setSelectedPlanId] = useState('');



    const { allPlans, categories, isPlanLoading } = useSelector((state) => state.plan);

    useEffect(() => {
        dispatch(getAllPlans());
    }, [dispatch]);

    const handleRadioChange = (e) => {
        setSelectedPlanId(e.target.value);
    };


    console.log("selectedPlanId in plan Selection", selectedPlanId)

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedPlanId) {
            onSubmit({ planId: selectedPlanId });
        } else {
            toast.warn('Please select a plan.');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" component="h2" align="center" gutterBottom>
                    Select a Plan
                </Typography>
                <RadioGroup name="plan" value={selectedPlanId} onChange={handleRadioChange}>
                    <Grid container spacing={2}>
                        {allPlans?.map((plan) => (
                            <Grid item size={{ xs: 12 }} key={plan._id}>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        borderColor: selectedPlanId === plan._id ? 'primary.main' : 'grey.300',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                        },
                                    }}
                                >
                                    <FormControlLabel
                                        value={plan._id}
                                        control={<Radio />}
                                        label={`${plan.name} - $${plan.price}`}
                                        sx={{ width: '100%', m: 0 }}
                                    />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </RadioGroup>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={prevStep}
                        sx={{ py: 1.5, borderRadius: '8px', flexGrow: 1 }}
                    >
                        Previous
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ py: 1.5, borderRadius: '8px', flexGrow: 1 }}
                    >
                        Subscribe
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default PlanSelection;
