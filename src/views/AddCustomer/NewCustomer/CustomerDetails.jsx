import React from 'react';
import { TextField, Button, Box, Typography, Grid, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';

const CustomerDetails = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" component="h2" align="center" gutterBottom>
                    Customer Details
                </Typography>
                <Grid container spacing={2}>
                    <Grid item size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            {...register("firstName", { required: "First Name  is required" })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            {...register("lastName", { required: "last Name is required" })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>
                    <Grid item size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>
                    <Grid item size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            type="tel"
                            {...register("phone", { required: "Phone number is required" })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            {...register("password", { required: "password is required" })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </Grid>


                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, py: 1.5, borderRadius: '8px' }}
                >
                    Next
                </Button>
            </Box>
        </Paper>
    );
};

export default CustomerDetails;
