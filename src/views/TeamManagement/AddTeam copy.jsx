import React, { useEffect, useMemo } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { getAllServiceAreas } from '../../redux/features/Area/AreaSlice';
import { registerTeamMember } from '../../redux/features/Team/TeamSlice';

const DEFAULT_VALUES = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'technician',
    region: [],
};

const AddTeam = () => {
    const dispatch = useDispatch();

    const {
        areas = [],
        isAreaLoading,
        areaError,
    } = useSelector((state) => state.area);

    const {
        isSubmitting,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: DEFAULT_VALUES });

    // Fetch service areas
    useEffect(() => {
        dispatch(getAllServiceAreas());
    }, [dispatch]);

    // Deduplicate area options
    const uniqueAreas = useMemo(() => {
        const seen = new Set();
        return areas.filter(({ _id }) => {
            if (seen.has(_id)) return false;
            seen.add(_id);
            return true;
        });
    }, [areas]);

    // Submit handler
    const onSubmit = async (data) => {
        const result = await dispatch(registerTeamMember(data));

        if (registerTeamMember.fulfilled.match(result)) {
            reset(); // clear form on success
        }

        // Optional: handle errors (e.g., via toast/snackbar)
    };

    return (
        <Container maxWidth="md">
            <Box
                component="section"
                sx={{
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 4,
                    bgcolor: 'background.paper',
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Add New Team Member
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        {/* First Name */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="firstName"
                                control={control}
                                rules={{ required: 'First name is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="First Name"
                                        autoComplete="given-name"
                                        fullWidth
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Last Name */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="lastName"
                                control={control}
                                rules={{ required: 'Last name is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Last Name"
                                        autoComplete="family-name"
                                        fullWidth
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Email */}
                        <Grid size={{ xs: 12, sm: 6 }}>
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
                                        autoComplete="email"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Password */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Minimum 6 characters required',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Password"
                                        type="password"
                                        autoComplete="new-password"
                                        fullWidth
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Phone */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^[6-9]\d{9}$/,
                                        message: 'Invalid Indian phone number',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Phone Number"
                                        type="tel"
                                        fullWidth
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                        inputProps={{ maxLength: 10 }}
                                        placeholder="10-digit mobile number"
                                        autoComplete="tel"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Role */}
                        <Grid size={{ xs: 12, sm: 6 }}>
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

                        {/* Region */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="region"
                                control={control}
                                rules={{ required: 'Select at least one region' }}
                                render={({ field: { onChange, value }, fieldState }) => (
                                    <Autocomplete
                                        multiple
                                        options={uniqueAreas}
                                        loading={isAreaLoading}
                                        value={value}
                                        onChange={(_, newValue) => {
                                            const unique = Array.from(
                                                new Map(newValue.map(item => [item._id, item])).values()
                                            );
                                            onChange(unique);
                                        }}
                                        getOptionLabel={(option) => option.region}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Regions"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                placeholder="Select regions"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {isAreaLoading && (
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
                        </Grid>

                        {/* Submit Button */}
                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Grid>

                        {/* Optional Area Error Display */}
                        {areaError && (
                            <Grid size={{ xs: 12 }}>
                                <Typography color="error">{areaError}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default AddTeam;
