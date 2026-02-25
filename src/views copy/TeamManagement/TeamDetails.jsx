// src/views/team/TeamDetails.jsx

import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TeamDetails = ({ member, onBack }) => {
    if (!member) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" color="error">
                    No team member selected.
                </Typography>
                <Button onClick={onBack} startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
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
                <Button onClick={onBack} variant="contained" startIcon={<ArrowBackIcon />}>
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
                        <Typography variant="body1">{member.userType}</Typography>
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

export default TeamDetails;
