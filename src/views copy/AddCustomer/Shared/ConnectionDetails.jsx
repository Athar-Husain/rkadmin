import React, { useEffect } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { getAllServiceAreas } from '../../../redux/features/Area/AreaSlice';
import { useDispatch, useSelector } from 'react-redux';

const ConnectionDetails = ({ onSubmit, prevStep }) => {
    const dispatch = useDispatch();


    const { register, handleSubmit, setValue, formState: { errors } } = useForm();


    const { areas } = useSelector((state) => state.area);
    // const { newCustomer, sear } = useSelector((state) => state.customer);

    const { searchedCustomer, newCustomer, isLoading, isError, message } = useSelector((state) => state.customer);
    const handleFormSubmit = (data) => {
        // Here we format the data to match the backend controller
        const formattedData = {
            ...data,

            // The installedAt is a string, which is fine for the form,
            // but the backend controller doesn't seem to use it directly from the body.
            // I'm keeping it in the form for user input.
        };
        onSubmit(formattedData);
    };

    const handleChangeToLowerCase = (e) => {
        setValue(e.target.name, e.target.value.toLowerCase(), { shouldValidate: true });
    };

    useEffect(() => {
        dispatch(getAllServiceAreas());
    }, [dispatch]);

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
            <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" component="h2" align="center" gutterBottom>
                    Connection Details
                </Typography>
                <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Box ID"
                            name="boxId"
                            {...register("boxId", { required: "Box ID is required" })}
                            error={!!errors.boxId}
                            helperText={errors.boxId?.message}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="STB Number"
                            name="stbNumber"
                            {...register("stbNumber", { required: "STB Number is required" })}
                            error={!!errors.stbNumber}
                            helperText={errors.stbNumber?.message}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="User Name"
                            name="userName"
                            {...register("userName", { required: "User Name is required" })}
                            error={!!errors.userName}
                            helperText={errors.userName?.message}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="User ID"
                            name="userId"
                            {...register("userId")}
                            error={!!errors.userId}
                            helperText={errors.userId?.message}
                            onBlur={handleChangeToLowerCase}  // Convert to lowercase on blur
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Contact No"
                            name="contactNo"
                            type="tel"
                            {...register("contactNo")}
                            error={!!errors.contactNo}
                            helperText={errors.contactNo?.message}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Connection Type"
                            name="connectionType"
                            placeholder='Fiber'
                            {...register("connectionType", { required: "Connection Type is required" })}
                            error={!!errors.connectionType}
                            helperText={errors.connectionType?.message}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Alias Name"
                            name="aliasName"
                            {...register("aliasName")}
                            error={!!errors.aliasName}
                            helperText={errors.aliasName?.message}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!errors.serviceArea}>
                            <InputLabel>Service Area</InputLabel>
                            <Select
                                label="Service Area"
                                name="serviceArea"
                                {...register("serviceArea", { required: "Service Area is required" })}
                                defaultValue=""
                            >
                                <MenuItem value="" disabled>Select a service area</MenuItem>
                                {areas.map((area) => (
                                    <MenuItem key={area._id} value={area._id}>
                                        {area.region}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography variant="body2" color="error">
                                {errors.serviceArea?.message}
                            </Typography>
                        </FormControl>
                    </Grid>
                </Grid>
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
                        Next
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default ConnectionDetails;
