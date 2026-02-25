import React from 'react';
import { Paper, Typography } from '@mui/material';

const ResolutionCard = ({ status, resolution }) => {
    if (status !== 'Resolved' || !resolution) return null;

    return (
        <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Resolution
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', fontWeight: 'bold' }}>
                {resolution}
            </Typography>
        </Paper>
    );
};

export default ResolutionCard;
