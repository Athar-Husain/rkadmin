// src/views/plan/EditPlan.jsx
import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllPlanCategories, getPlanById, updatePlan } from '../../redux/features/Plan/PlanSlice';
import {
    Box,
    Button,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography,
    InputAdornment,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const durations = [
    { label: "1 Month", value: "1-month" },
    { label: "3 Months", value: "3-months" },
    { label: "6 Months", value: "6-months" },
    { label: "12 Months", value: "12-months" },
];

const dataLimitOptions = [
    { label: "Limited", value: "limited" },
    { label: "Unlimited", value: "unlimited" },
];

const speedUnits = [
    { label: "mbps", value: "mbps" },
    { label: "Mbps", value: "Mbps" },
    { label: "Gbps", value: "gbps" },
];

const EditPlan = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { categories, plan } = useSelector(state => state.plan);

    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
        watch,
        reset,
        setValue,
    } = useForm({
        defaultValues: {
            name: "",
            duration: "",
            price: "",
            internetSpeed: "",
            internetSpeedUnit: "mbps",
            dataLimitType: "limited",
            dataLimit: "",
            description: "",
            category: "",
            features: [{ value: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "features" });
    const dataLimitType = watch("dataLimitType");

    useEffect(() => {
        dispatch(getAllPlanCategories());
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(getPlanById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (plan && id) {
            reset({
                name: plan.name || "",
                duration: plan.duration || "",
                price: plan.price || "",
                internetSpeed: plan.internetSpeed || "",
                internetSpeedUnit: plan.internetSpeedUnit || "mbps",
                dataLimitType: plan.dataLimitType || "limited",
                dataLimit: plan.dataLimit || "",
                description: plan.description || "",
                category: plan.category || "",
                features:
                    Array.isArray(plan.features) && plan.features.length > 0
                        ? plan.features.map(f => ({ value: f }))
                        : [{ value: "" }],
            });
        }
    }, [plan, id, reset]);

    const onSubmit = async (data) => {
        const transformed = {
            ...data,
            features: data.features.map(f => f.value),
        };
        try {
            await dispatch(updatePlan({ id, data: transformed })).unwrap();
            navigate("/plan");
        } catch (err) {
            console.error("Error updating plan", err);
        }
    };

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 4 },
                maxWidth: 900,
                mx: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <Typography variant="h4" fontWeight="bold" mb={3} align="center" color="primary">
                Edit Plan
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>
                    {/* Name */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            {...register("name", { required: "Name is required" })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            size="medium"
                        />
                    </Grid>

                    {/* Duration */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            select
                            label="Duration"
                            fullWidth
                            {...register("duration", { required: "Duration is required" })}
                            error={!!errors.duration}
                            helperText={errors.duration?.message}
                            value={watch("duration") || ""}
                            onChange={(e) => setValue("duration", e.target.value)}
                            size="medium"
                        >
                            {durations.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Category */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            select
                            label="Category"
                            fullWidth
                            {...register("category", { required: "Category is required" })}
                            error={!!errors.category}
                            helperText={errors.category?.message}
                            value={watch("category") || ""}
                            onChange={(e) => setValue("category", e.target.value)}
                            size="medium"
                        >
                            {categories.length > 0 ? (
                                categories.map(c => (
                                    <MenuItem key={c._id} value={c._id}>
                                        {c.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="">No categories available</MenuItem>
                            )}
                        </TextField>
                    </Grid>

                    {/* Price */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Price"
                            fullWidth
                            {...register("price", {
                                required: "Price is required",
                                pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Invalid price" },
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">INR</InputAdornment>,
                            }}
                            size="medium"
                        />
                    </Grid>

                    {/* Internet Speed */}
                    <Grid size={{ xs: 8, sm: 6, md: 4 }}>
                        <TextField
                            label="Internet Speed"
                            fullWidth
                            {...register("internetSpeed", { required: "Internet speed is required" })}
                            error={!!errors.internetSpeed}
                            helperText={errors.internetSpeed?.message}
                            size="medium"
                        />
                    </Grid>
                    <Grid size={{ xs: 4, sm: 6, md: 2 }}>
                        <TextField
                            select
                            label="Speed Unit"
                            fullWidth
                            {...register("internetSpeedUnit")}
                            value={watch("internetSpeedUnit") || "mbps"}
                            onChange={(e) => setValue("internetSpeedUnit", e.target.value)}
                            size="medium"
                        >
                            {speedUnits.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Data Limit Type */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                            select
                            label="Data Limit Type"
                            fullWidth
                            {...register("dataLimitType")}
                            value={watch("dataLimitType") || "limited"}
                            onChange={(e) => setValue("dataLimitType", e.target.value)}
                            size="medium"
                        >
                            {dataLimitOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Data Limit (conditional) */}
                    {dataLimitType === "limited" && (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label="Data Limit (GB)"
                                fullWidth
                                {...register("dataLimit", { required: "Data limit is required" })}
                                error={!!errors.dataLimit}
                                helperText={errors.dataLimit?.message}
                                size="medium"
                            />
                        </Grid>
                    )}

                    {/* Description */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            {...register("description", { required: "Description is required" })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            size="medium"
                        />
                    </Grid>

                    {/* Features Header */}
                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Features
                        </Typography>
                    </Grid>

                    {/* Features List */}
                    {fields.map((field, index) => (
                        <Grid size={{ xs: 12 }} key={field.id}>
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                            // sx={{
                            //     flexWrap: 'wrap',
                            // }}
                            >
                                <Controller
                                    name={`features.${index}.value`}
                                    control={control}
                                    rules={{ required: "Feature is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={`Feature #${index + 1}`}
                                            fullWidth
                                            error={!!errors.features?.[index]?.value}
                                            helperText={errors.features?.[index]?.value?.message}
                                            size="medium"
                                        />
                                    )}
                                />
                                <IconButton
                                    color="error"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    sx={{ ml: 1 }}
                                >
                                    <RemoveIcon />
                                </IconButton>
                                <IconButton
                                    color="primary"
                                    onClick={() => append({ value: "" })}
                                    sx={{ ml: 1 }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    ))}

                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3 }}
                        >
                            Update Plan
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default EditPlan;
