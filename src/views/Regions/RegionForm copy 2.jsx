// admin/components/RegionForm.js

import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    Paper,
    FormControlLabel,
    Switch,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';

import {
    getServiceAreaById,
    updateServiceArea,
    createServiceArea,
} from '../../redux/features/Area/AreaSlice';

const RegionForm = ({ mode = 'view' }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const { area: selectedArea, isAreaLoading } = useSelector((state) => state.area);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            region: '',
            description: '',
            networkStatus: 'Good',
            isActive: true,
        },
    });

    useEffect(() => {
        if ((isEdit || isView) && id) {
            dispatch(getServiceAreaById(id));
        }
    }, [dispatch, id, isEdit, isView]);

    useEffect(() => {
        if (selectedArea && (isEdit || isView)) {
            reset({
                region: selectedArea.region || '',
                description: selectedArea.description || '',
                networkStatus: selectedArea.networkStatus || 'Good',
                isActive: selectedArea.isActive ?? true,
            });
        }
    }, [selectedArea, isEdit, isView, reset]);

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                await dispatch(updateServiceArea({ id, data })).unwrap();
            } else {
                await dispatch(createServiceArea(data)).unwrap();
            }
            navigate('/areas');
        } catch (error) {
            console.error('Failed to submit:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, fontFamily: "'Poppins', sans-serif" }}>
            <Paper
                sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: '0 10px 20px rgba(99, 102, 241, 0.15)',
                    bgcolor: '#FFFFFF',
                }}
            >
                <Typography
                    variant="h5"
                    mb={4}
                    fontWeight={700}
                    color="#4F46E5"
                    letterSpacing={-0.5}
                >
                    {isView ? 'View Region' : isEdit ? 'Edit Region' : 'Create Region'}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={3}>
                        {/* Region Name */}
                        <Controller
                            name="region"
                            control={control}
                            rules={{
                                required: 'Region name is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9-]+$/,
                                    message:
                                        'Only letters, numbers, and hyphens allowed (no spaces or special characters)',
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Region Name"
                                    disabled={isView || isAreaLoading}
                                    error={!!errors.region}
                                    helperText={errors.region?.message}
                                    fullWidth
                                    required
                                    inputProps={{ maxLength: 30 }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            bgcolor: isView ? '#F3F4F6' : '#fff',
                                        },
                                    }}
                                />
                            )}
                        />

                        {/* Network Status */}
                        <FormControl fullWidth disabled={isView || isAreaLoading}>
                            <InputLabel>Network Status</InputLabel>
                            <Controller
                                name="networkStatus"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Network Status"
                                        sx={{
                                            borderRadius: 2,
                                            bgcolor: isView ? '#F3F4F6' : '#fff',
                                        }}
                                    >
                                        <MenuItem value="Good">Good (Normal)</MenuItem>
                                        <MenuItem value="Low">Low (Users may notice slowness)</MenuItem>
                                        <MenuItem value="Moderate">Moderate (Minor issues)</MenuItem>
                                        <MenuItem value="Down">Down (Outage in progress)</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>

                        {/* isActive Toggle */}
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            {...field}
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                            disabled={isView || isAreaLoading}
                                        />
                                    }
                                    label="Is Active"
                                />
                            )}
                        />

                        {/* Description */}
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    disabled={isView || isAreaLoading}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            bgcolor: isView ? '#F3F4F6' : '#fff',
                                        },
                                    }}
                                />
                            )}
                        />

                        {/* Submit Button */}
                        {!isView && (
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={isAreaLoading || isSubmitting}
                                sx={{
                                    bgcolor: '#6366F1',
                                    borderRadius: 3,
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: 16,
                                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
                                    transition: 'background-color 0.3s ease',
                                    '&:hover': {
                                        bgcolor: '#4F46E5',
                                    },
                                }}
                            >
                                {isEdit ? 'Update Region' : 'Create Region'}
                            </Button>
                        )}

                        {/* Back Button */}
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/areas')}
                            disabled={isAreaLoading}
                            sx={{
                                borderRadius: 3,
                                py: 1.5,
                                fontWeight: 600,
                                fontSize: 16,
                                color: '#4F46E5',
                                borderColor: '#4F46E5',
                                '&:hover': {
                                    borderColor: '#3B367C',
                                    backgroundColor: '#EEF2FF',
                                },
                            }}
                        >
                            Back
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default RegionForm;
