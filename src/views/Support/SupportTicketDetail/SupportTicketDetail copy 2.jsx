import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    useTheme,
} from '@mui/material';
import { useForm } from 'react-hook-form';

import TicketInfoCard from './components/TicketInfoCard';
import DescriptionCard from './components/DescriptionCard';
import ResolutionCard from './components/ResolutionCard';
import ChatHistory from './components/ChatHistory';
import InternalNotes from './components/InternalNotes';
import CloseTicketModal from './components/CloseTicketModal';

// You can replace this with props or real data later
import ticketMock from './mock/ticketMock';

const SupportTicketDetail = ({ ticket = ticketMock }) => {
    const theme = useTheme();

    // State to control modal
    const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);

    // Form for internal note
    const internalNoteForm = useForm({
        defaultValues: { newNoteText: '' },
    });

    // Form for closing ticket
    const resolutionForm = useForm({
        defaultValues: { resolutionMessage: '' },
    });

    // --- Handlers ---
    const handleAddNote = ({ newNoteText }) => {
        console.log('New Note:', newNoteText);
        internalNoteForm.reset();
    };

    const handleCloseTicket = ({ resolutionMessage }) => {
        console.log('Resolution Submitted:', resolutionMessage);
        resolutionForm.reset();
        setIsResolutionModalOpen(false);
    };

    const handleOpenResolutionModal = () => {
        setIsResolutionModalOpen(true);
    };

    const handleCloseResolutionModal = () => {
        resolutionForm.reset();
        setIsResolutionModalOpen(false);
    };

    // --- Render ---
    return (
        <Box p={3}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
                Ticket Details
            </Typography>

            <Box mb={2}>
                <TicketInfoCard ticket={ticket} />
            </Box>

            <Box mb={2}>
                <DescriptionCard description={ticket.description} />
            </Box>

            {ticket.status === 'Resolved' && ticket.resolution && (
                <Box mb={2}>
                    <ResolutionCard resolution={ticket.resolution} />
                </Box>
            )}

            <Box mb={2}>
                <ChatHistory messages={ticket.chatHistory} />
            </Box>

            <Box mb={2}>
                <InternalNotes
                    notes={ticket.notes}
                    form={internalNoteForm}
                    onAddNote={handleAddNote}
                />
            </Box>

            {ticket.status !== 'Resolved' && (
                <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={handleOpenResolutionModal}
                >
                    Close Ticket
                </Button>
            )}

            <CloseTicketModal
                open={isResolutionModalOpen}
                onClose={handleCloseResolutionModal}
                form={resolutionForm}
                onSubmit={handleCloseTicket}
            />
        </Box>
    );
};

export default SupportTicketDetail;
