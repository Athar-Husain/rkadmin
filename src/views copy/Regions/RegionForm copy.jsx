import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
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

    // Setup react-hook-form with validation same as AddRegion
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            region: '',
            description: '',
            status: 'active',
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
                status: selectedArea.status || 'active',
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

                        <FormControl fullWidth disabled={isView || isAreaLoading}>
                            <InputLabel>Status</InputLabel>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Status"
                                        sx={{
                                            borderRadius: 2,
                                            bgcolor: isView ? '#F3F4F6' : '#fff',
                                        }}
                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                        <MenuItem value="slow">Slow</MenuItem>
                                        <MenuItem value="under_maintenance">Under Maintenance</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>

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
