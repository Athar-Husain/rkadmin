// src/views/team/TeamEditModal.jsx

import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';

// --- DUMMY MOCK API FUNCTIONS ---
const mockApi = {
    updateMember: async (id, data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`Mock API: Updating member with ID ${id}`, data);
                // Simulate a successful update
                resolve({ id, ...data });
            }, 500);
        });
    },
    updateMemberPassword: async (id, data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`Mock API: Updating password for member with ID ${id}`, data);
                // Simulate a successful password update
                resolve({ id, ...data });
            }, 500);
        });
    },
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const TeamEditModal = ({ open, onClose, member }) => {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: member,
    });

    // Use separate form instance for password update
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors }
    } = useForm();

    useEffect(() => {
        if (open && member) {
            reset(member);
        }
    }, [open, member, reset]);

    const onUpdateSubmit = async (data) => {
        setLoading(true);
        try {
            await mockApi.updateMember(member._id, data);
            // In a real app, you would dispatch an action or re-fetch data.
            // For this mock, we just close the modal.
            onClose();
        } catch (error) {
            console.error('Failed to update team member:', error);
        } finally {
            setLoading(false);
        }
    };

    const onPasswordSubmit = async (data) => {
        setLoading(true);
        try {
            await mockApi.updateMemberPassword(member._id, { password: data.password });
            // In a real app, you would dispatch an action.
            onClose();
        } catch (error) {
            console.error('Failed to update password:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Edit Team Member
                </Typography>

                {/* Update Details Form */}
                <Box component="form" onSubmit={handleSubmit(onUpdateSubmit)} noValidate sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                {...register('firstName', { required: 'First name is required' })}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                {...register('lastName', { required: 'Last name is required' })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Phone"
                                {...register('phone', {
                                    required: 'Phone is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Phone number must be 10 digits'
                                    }
                                })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Role"
                                {...register('role', { required: 'Role is required' })}
                                error={!!errors.role}
                                helperText={errors.role?.message}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                        <Button onClick={onClose} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Update Details'}
                        </Button>
                    </Box>
                </Box>

                {/* Update Password Form */}
                <Typography variant="h6" component="h2" gutterBottom>
                    Update Password
                </Typography>
                <Box component="form" onSubmit={handleSubmitPassword(onPasswordSubmit)} noValidate>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="password"
                                label="New Password"
                                {...registerPassword('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                                error={!!passwordErrors.password}
                                helperText={passwordErrors.password?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm Password"
                                {...registerPassword('confirmPassword', {
                                    required: 'Confirm Password is required',
                                    validate: value => value === document.getElementById('new-password-input').value || 'Passwords must match'
                                })}
                                error={!!passwordErrors.confirmPassword}
                                helperText={passwordErrors.confirmPassword?.message}
                                id="new-password-input"
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Update Password'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default TeamEditModal;
