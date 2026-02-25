import React from 'react';
import { Paper, Typography } from '@mui/material';

const DescriptionCard = ({ description }) => {
    return (
        <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Description
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {description || 'No description provided.'}
            </Typography>
        </Paper>
    );
};

export default DescriptionCard;
