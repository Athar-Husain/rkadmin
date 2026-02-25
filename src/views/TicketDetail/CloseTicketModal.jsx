// src/views/TicketDetail/CloseTicketModal.jsx
import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const CloseTicketModal = ({ open, onClose, onConfirm }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            resolutionNote: '',
        },
    });

    const onSubmit = (data) => {
        onConfirm(data.resolutionNote);
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="close-ticket-modal-title">
            <Box sx={style}>
                <Typography id="close-ticket-modal-title" variant="h5" fontWeight="bold" mb={2} textAlign="center">
                    Close Ticket
                </Typography>

                <Typography variant="body1" mb={3} textAlign="center">
                    Please provide a resolution note before closing this ticket.
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="resolutionNote"
                        control={control}
                        rules={{ required: 'Resolution note is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                multiline
                                minRows={4}
                                fullWidth
                                placeholder="Enter resolution note..."
                                error={!!errors.resolutionNote}
                                helperText={errors.resolutionNote ? errors.resolutionNote.message : ''}
                                sx={{ mb: 3 }}
                            />
                        )}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="outlined" color="inherit" onClick={onClose} sx={{ flex: 1, mr: 1 }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" sx={{ flex: 1, ml: 1 }}>
                            Confirm
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default CloseTicketModal;
