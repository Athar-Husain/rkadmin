// src/views/Profile?Index.jsx
import React from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    Avatar,
} from '@mui/material';
import { useForm } from 'react-hook-form';
// import Breadcrumbs from 'component/Breadcrumb';

import Breadcrumbs from '../../component/Breadcrumb'
import { useSelector } from 'react-redux';

const dummyData = {
    name: 'John Doe',
    phone: '+1 234 567 8900',
    email: 'john.doe@example.com',
    address: '123 Main St, Springfield, USA',
    image: 'https://storage.googleapis.com/a1aa/image/4383539d-d7b1-497a-294c-5da920d59571.jpg',
};




const index = () => {

    
  const { Admin, isLoading } = useSelector((state) => state.Admin);

  
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: dummyData,
    });

    const onSubmit = (data) => {
        console.log('Submitted:', data);
        // Replace with API call or Redux action
    };

    return (
        <>
            <Breadcrumbs
                links={[
                    { label: 'Dashboard', to: '/' },
                    { label: 'Profile' },
                ]}
                divider />

            <Box sx={{ bgcolor: '#f9fbff', minHeight: '100vh' }}>
                <Box
                    sx={{
                        backgroundColor: '#0f1e42',
                        py: 2,
                        px: 3,
                        color: 'white',
                        position: 'relative',
                    }}
                >

                    <Box
                        component="img"
                        src="https://storage.googleapis.com/a1aa/image/6ddc7605-9697-4c9d-6aa6-381c28662ef3.jpg"
                        alt="Background"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.2,
                            zIndex: 0,
                            pointerEvents: 'none',
                        }}
                    />
                </Box>

                {/* Main Form */}
                <Container maxWidth="lg" sx={{ mt: 6, position: 'relative', zIndex: 1 }}>
                    <Paper elevation={1} sx={{ p: 4 }}>
                        <Grid container spacing={4}>
                            {/* <Grid item xs={12} md={8}> */}
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Typography variant="h6" gutterBottom>
                                    Update Profile
                                </Typography>

                                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                    <Grid container spacing={3}>
                                        {/* <Grid item xs={12} sm={6}> */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="Name"
                                                fullWidth
                                                {...register('name', { required: 'Name is required' })}
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                            />
                                        </Grid>
                                        {/* <Grid item xs={12} sm={6}> */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="Phone Number"
                                                fullWidth
                                                {...register('phone', { required: 'Phone number is required' })}
                                                error={!!errors.phone}
                                                helperText={errors.phone?.message}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="Email"
                                                type="email"
                                                fullWidth
                                                {...register('email', {
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /^\S+@\S+$/i,
                                                        message: 'Invalid email address',
                                                    },
                                                })}
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="Address"
                                                fullWidth
                                                {...register('address', { required: 'Address is required' })}
                                                error={!!errors.address}
                                                helperText={errors.address?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                sx={{ mt: 2 }}
                                            >
                                                Update
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>

                            {/* Profile Picture */}
                            {/* <Grid item xs={12} md={4}> */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Avatar
                                        src={dummyData.image}
                                        alt="Profile"
                                        sx={{ width: 150, height: 150, mb: 2 }}
                                    />
                                    <Typography variant="body2" color="textSecondary">
                                        Accepted formats: JPEG, JPG, PNG
                                        <br />
                                        Recommended size: 300×300 (1MB)
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}

export default index