import React, { useEffect, useState } from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Grid,
    Button,
    Autocomplete,
    CircularProgress,
    Typography,
    Container,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const dummyRegionsAPI = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(['Radio-Park', 'Cowl-Bazar', 'City', 'North', 'South', 'Central-Ballari',]);
        }, 1000);
    });

const CreateAdmin = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 'technician',
            status: 'active',
            region: [],
        },
    });

    const [regions, setRegions] = useState([]);
    const [loadingRegions, setLoadingRegions] = useState(true);

    useEffect(() => {
        dummyRegionsAPI().then((data) => {
            setRegions(data);
            setLoadingRegions(false);
        });
    }, []);

    const onSubmit = (data) => {
        console.log('Form data:', data);
    };

    return (

        <>

            <Container>


                <Box
                    sx={{
                        maxWidth: 800,
                        margin: 'auto',
                        padding: 4,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 4,
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" mb={3}>
                        Add New Team Member
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Grid container spacing={3}>
                            {/* First Name */}
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="firstName"
                                    control={control}
                                    rules={{ required: 'First name is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="First Name"
                                            fullWidth
                                            error={!!errors.firstName}
                                            helperText={errors.firstName?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Last Name */}
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="lastName"
                                    control={control}
                                    rules={{ required: 'Last name is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Last Name"
                                            fullWidth
                                            error={!!errors.lastName}
                                            helperText={errors.lastName?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Email */}
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Invalid email address',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Email"
                                            type="email"
                                            fullWidth
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Password */}
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Minimum 6 characters',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Password"
                                            type="password"
                                            fullWidth
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Role */}
                            <Grid item xs={12} sm={6}  >
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel id="role-label">Role</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="role-label"
                                                label="Role"
                                            >
                                                <MenuItem value="technician">Technician</MenuItem>
                                                <MenuItem value="agent">Agent</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            {/* Regions */}
                            {/* <Grid item xs={12} sm={6}>
                                <Controller
                                    name="region"
                                    control={control}
                                    rules={{ required: 'Select at least one region' }}
                                    render={({ field: { onChange, value }, fieldState }) => (
                                        <Autocomplete
                                            multiple
                                            options={regions}
                                            loading={loadingRegions}
                                            value={value}
                                            onChange={(_, newValue) => onChange(newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Regions"
                                                    placeholder="Select regions"
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <>
                                                                {loadingRegions && (
                                                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                                                )}
                                                                {params.InputProps.endAdornment}
                                                            </>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid> */}

                            {/* Submit Button */}

                        </Grid>
                        <Grid item xs={12} mt={10}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                            >
                                Add Team Member
                            </Button>
                        </Grid>
                    </form>
                </Box>
            </Container>
        </>
    );
};

export default CreateAdmin;
