// src/views/team/All.jsx

import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Paper,
    IconButton,
    Stack,
    CircularProgress,
    Alert,
    Modal,
    TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

// --- DUMMY DATA AND MOCK API FUNCTIONS ---
const MOCK_TEAM_MEMBERS = [
    {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        role: 'technician',
        status: 'active',
        area: ['East-Mumbai', 'West'],
        createdAt: '2025-06-25',
    },
    {
        _id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        role: 'agent',
        status: 'inactive',
        area: ['South', 'Central-Mumbai'],
        createdAt: '2025-04-15',
    },
    {
        _id: '3',
        firstName: 'Mike',
        lastName: 'Lee',
        email: 'mike@example.com',
        phone: '5551234567',
        role: 'technician',
        status: 'suspended',
        area: ['North'],
        createdAt: '2025-03-10',
    }
];

const mockApi = {
    fetchMembers: async () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(MOCK_TEAM_MEMBERS);
            }, 500);
        });
    },
    updateMember: async (id, data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = MOCK_TEAM_MEMBERS.findIndex(m => m._id === id);
                if (index !== -1) {
                    MOCK_TEAM_MEMBERS[index] = { ...MOCK_TEAM_MEMBERS[index], ...data };
                    resolve(MOCK_TEAM_MEMBERS[index]);
                } else {
                    reject(new Error('Member not found'));
                }
            }, 500);
        });
    },
    deleteMember: async (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = MOCK_TEAM_MEMBERS.findIndex(m => m._id === id);
                if (index !== -1) {
                    MOCK_TEAM_MEMBERS.splice(index, 1);
                    resolve({ id });
                } else {
                    reject(new Error('Member not found'));
                }
            }, 500);
        });
    }
};

// --- COMPONENTS ---

const ConfirmDialog = ({ open, onClose, onConfirm, message }) => {
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    };
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Confirmation
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
                    {message}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="contained" color="error">
                        Confirm
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

const TeamEditModal = ({ open, onClose, member, onUpdate, loading }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: member,
    });

    useEffect(() => {
        if (open && member) {
            reset(member);
        }
    }, [open, member, reset]);

    const onSubmit = (data) => {
        onUpdate(data);
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

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Edit Team Member
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                {...register('firstName', { required: 'First name is required' })}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                {...register('lastName', { required: 'Last name is required' })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone"
                                {...register('phone', { required: 'Phone is required', pattern: /^[0-9]{10}$/ })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
            </Box>
        </Modal>
    );
};

const TeamDetails = ({ member, onBack }) => {
    if (!member) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" color="error">
                    No team member selected.
                </Typography>
                <Button onClick={onBack} variant="outlined" sx={{ mt: 2 }}>
                    Go Back
                </Button>
            </Box>
        );
    }
    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={600}>
                    Team Member Details
                </Typography>
                <Button onClick={onBack} variant="contained" sx={{ textTransform: 'none' }}>
                    Back to List
                </Button>
            </Box>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold">Name:</Typography>
                        <Typography variant="body1">{member.firstName} {member.lastName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold">Email:</Typography>
                        <Typography variant="body1">{member.email}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold">Phone:</Typography>
                        <Typography variant="body1">{member.phone}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold">Role:</Typography>
                        <Typography variant="body1">{member.role}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold">User Type:</Typography>
                        <Typography variant="body1">{member.userType || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold">Created At:</Typography>
                        <Typography variant="body1">{new Date(member.createdAt).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold">Service Areas:</Typography>
                        <Typography variant="body1">{member.area && member.area.join(', ')}</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};


// --- MAIN COMPONENT ---
const All = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [isTeamLoading, setIsTeamLoading] = useState(false);
    const [isTeamError, setIsTeamError] = useState(false);
    const [message, setMessage] = useState('');

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [viewingDetails, setViewingDetails] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            setIsTeamLoading(true);
            try {
                const members = await mockApi.fetchMembers();
                setTeamMembers(members);
            } catch (err) {
                setIsTeamError(true);
                setMessage('Failed to fetch team members.');
            } finally {
                setIsTeamLoading(false);
            }
        };
        fetchMembers();
    }, []);

    const handleEditOpen = (member) => {
        setSelectedMember(member);
        setEditModalOpen(true);
    };

    const handleViewOpen = (member) => {
        setSelectedMember(member);
        setViewingDetails(true);
    };

    const handleDelete = (id) => {
        setMemberToDelete(id);
        setConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setConfirmModalOpen(false);
        if (memberToDelete) {
            setIsTeamLoading(true);
            try {
                await mockApi.deleteMember(memberToDelete);
                setTeamMembers(prev => prev.filter(member => member._id !== memberToDelete));
                toast.success('Team member deleted successfully!');
            } catch (err) {
                toast.error('Failed to delete team member.');
            } finally {
                setIsTeamLoading(false);
                setMemberToDelete(null);
            }
        }
    };

    const handleUpdate = async (data) => {
        setIsTeamLoading(true);
        try {
            const updatedMember = await mockApi.updateMember(selectedMember._id, data);
            setTeamMembers(prev => prev.map(m => m._id === updatedMember._id ? updatedMember : m));
            toast.success('Team member updated successfully!');
            setEditModalOpen(false);
        } catch (err) {
            toast.error('Failed to update team member.');
        } finally {
            setIsTeamLoading(false);
        }
    };

    // Column configuration for the DataGrid
    const columns = [
        { field: '_id', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First Name', flex: 1 },
        { field: 'lastName', headerName: 'Last Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        { field: 'role', headerName: 'Role', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'area',
            headerName: 'Service Area(s)',
            flex: 1.5,
            renderCell: (params) => (
                <div>
                    {params.value && params.value.map((area, index) => (
                        <div key={index}>{area}</div>
                    ))}
                </div>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            flex: 1,
            valueGetter: (params) =>
                params?.row?.createdAt ? new Date(params.row.createdAt).toLocaleDateString() : '',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton color="primary" aria-label="view" onClick={() => handleViewOpen(params.row)}>
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton color="secondary" aria-label="edit" onClick={() => handleEditOpen(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" aria-label="delete" onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    if (viewingDetails) {
        return <TeamDetails member={selectedMember} onBack={() => setViewingDetails(false)} />;
    }

    return (
        <Box sx={{ height: 600, width: '100%', p: 3, bgcolor: '#f9fbff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={600}>
                    Team Members
                </Typography>
                <Box>
                    <Button variant="outlined" color="primary" sx={{ mr: 1, textTransform: 'none' }} disabled>
                        Export PDF
                    </Button>
                    <Button variant="outlined" color="secondary" sx={{ textTransform: 'none' }} disabled>
                        Export Excel
                    </Button>
                </Box>
            </Box>

            {isTeamLoading ? (
                <CircularProgress />
            ) : isTeamError ? (
                <Alert severity="error">{message}</Alert>
            ) : (
                <Paper sx={{ height: 'auto' }}>
                    <DataGrid
                        rows={teamMembers}
                        columns={columns}
                        getRowId={(row) => row._id}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                    page: 0,
                                },
                            },
                        }}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Paper>
            )}

            {editModalOpen && (
                <TeamEditModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    member={selectedMember}
                    onUpdate={handleUpdate}
                    loading={isTeamLoading}
                />
            )}

            <ConfirmDialog
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this team member? This action cannot be undone."
            />
            <ToastContainer position="bottom-right" />
        </Box>
    );
};

export default All;
