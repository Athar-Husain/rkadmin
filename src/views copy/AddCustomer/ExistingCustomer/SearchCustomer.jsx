import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { TextField, Button, Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { searchCustomerByPhone } from '../../../redux/features/Customers/CustomerSlice';
import { useForm } from 'react-hook-form';

const SearchCustomer = ({ onSearchNext }) => {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { searchedCustomer, isLoading, isError, message } = useSelector((state) => state.customer);

    useEffect(() => {
        if (!isLoading) {
            if (isError) {
                toast.error(message || 'No customer found.');
            }
        }
    }, [isLoading, isError, message]);

    const handleSearch = (data) => {
        dispatch(searchCustomerByPhone(data.phone));
    };

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
            <Box component="form" onSubmit={handleSubmit(handleSearch)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" component="h2" align="center" gutterBottom>
                    Search Customer
                </Typography>
                {!searchedCustomer ? (
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                {...register("phone", { required: "Phone number is required" })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ py: 1.5, borderRadius: '8px' }}
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                            >
                                {isLoading ? 'Searching...' : 'Search'}
                            </Button>
                        </Grid>
                    </Grid>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Customer Found!</Typography>
                        <Typography><strong>Name:</strong> {searchedCustomer.name}</Typography>
                        <Typography><strong>Email:</strong> {searchedCustomer.email}</Typography>
                        <Typography><strong>Phone:</strong> {searchedCustomer.phone}</Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3, py: 1.5, borderRadius: '8px' }}
                            onClick={onSearchNext}
                        >
                            Next
                        </Button>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default SearchCustomer;
