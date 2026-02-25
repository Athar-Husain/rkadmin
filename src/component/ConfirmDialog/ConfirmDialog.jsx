import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

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

export default ConfirmDialog;
