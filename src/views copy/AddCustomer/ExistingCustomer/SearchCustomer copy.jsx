import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { TextField, Button, Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { searchCustomerByPhone } from '../../../redux/features/Customers/CustomerSlice';

const SearchCustomer = ({ handleSearch }) => {
    const dispatch = useDispatch();
    const [phone, setPhone] = useState('');
    const { searchedCustomer, isLoading, isError, message } = useSelector((state) => state.customer);

    useEffect(() => {
        if (!isLoading) {
            if (searchedCustomer) {
                handleSearch(searchedCustomer);
            } else if (isError) {
                toast.error(message || 'No customer found.');
            }
        }
    }, [searchedCustomer, isLoading, isError, message, handleSearch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phone.trim() === '') {
            toast.warn('Please enter a phone number.');
            return;
        }
        dispatch(searchCustomerByPhone(phone));
    };

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" component="h2" align="center" gutterBottom>
                    Search Customer
                </Typography>
                <Grid container spacing={2}>
                    <Grid item size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, py: 1.5, borderRadius: '8px' }}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </Button>
            </Box>
        </Paper>
    );
};

export default SearchCustomer;
