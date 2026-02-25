import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const TicketInfoCard = ({ ticket }) => {
    return (
        <Paper elevation={3} sx={{ borderRadius: 2, p: 2, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={1}>
                {ticket?.subject}
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                <Typography variant="body1">
                    <strong>Status:</strong> {ticket?.status}
                </Typography>
                <Typography variant="body1">
                    <strong>Priority:</strong> {ticket?.priority}
                </Typography>
                <Typography variant="body1">
                    <strong>Created:</strong> {new Date(ticket?.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body1">
                    <strong>Last Updated:</strong> {new Date(ticket?.updatedAt).toLocaleString()}
                </Typography>
            </Box>

            <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Customer Info
                </Typography>
                <Typography variant="body1">
                    <strong>Name:</strong> {ticket?.customer?.name}
                </Typography>
                <Typography variant="body1">
                    <strong>Email:</strong> {ticket?.customer?.email}
                </Typography>
                <Typography variant="body1">
                    <strong>Phone:</strong> {ticket?.customer?.phone}
                </Typography>
            </Box>
        </Paper>
    );
};

export default TicketInfoCard;
