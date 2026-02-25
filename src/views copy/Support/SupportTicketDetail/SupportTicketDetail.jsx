import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    useTheme,
    Tabs,
    Tab,
    Paper,
    CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import TicketInfoCard from './TicketInfoCard';
import DescriptionCard from './DescriptionCard';
import ResolutionCard from './ResolutionCard';
import ChatHistory from './ChatHistory';
import InternalNotes from './InternalNotes';
import CloseTicketModal from './CloseTicketModal';
import { getTicketById, resolveTicket, createInternalTicket } from '../../../redux/features/Tickets/TicketSlice';
import ticketMock from './mock/ticketMock';
import { useParams } from 'react-router-dom';

const SupportTicketDetail = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const { ticketId } = useParams();


    // Redux state
    const { ticket, isLoading, isError, message } = useSelector(state => state.ticket);

    const [activeTab, setActiveTab] = useState(0);
    const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);

    const internalNoteForm = useForm({ defaultValues: { newNoteText: '' } });
    const resolutionForm = useForm({ defaultValues: { resolutionMessage: '' } });

    // Fetch ticket data on mount
    useEffect(() => {
        // if (ticketId) {
        dispatch(getTicketById(ticketId));

    }, [dispatch, ticketId]);

    const handleTabChange = (_, newValue) => setActiveTab(newValue);

    const handleAddNote = ({ newNoteText }) => {
        const data = {
            ticketId,
            note: newNoteText,
        };
        dispatch(createInternalTicket(data));
        internalNoteForm.reset();
    };

    const handleCloseTicket = ({ resolutionMessage }) => {
        const data = { resolutionMessage };
        dispatch(resolveTicket({ id: ticketId, data }));
        resolutionForm.reset();
        setIsResolutionModalOpen(false);
    };

    const handleOpenResolutionModal = () => setIsResolutionModalOpen(true);
    const handleCloseResolutionModal = () => {
        resolutionForm.reset();
        setIsResolutionModalOpen(false);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="error">{message}</Typography>
            </Box>
        );
    }

    return (
        <Box p={4} maxWidth="900px" mx="auto">
            {/* Header */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                🛠️ Support Ticket
            </Typography>
            {ticket?.status !== 'Resolved' && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleOpenResolutionModal}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            py: 1.2,
                            fontSize: '0.95rem',
                            borderRadius: 2,
                        }}
                    >
                        ✅ Close Ticket
                    </Button>
                </Box>
            )}

            {/* Ticket Overview */}
            <Box mb={3}>
                <TicketInfoCard ticket={ticket} />
            </Box>

            {/* Ticket Description */}
            <Box mb={3}>
                <DescriptionCard description={ticket?.description} />
            </Box>

            {/* Resolution Display (if resolved) */}
            {ticket?.status === 'Resolved' && ticket?.resolution && (
                <Box mb={3}>
                    <ResolutionCard resolution={ticket?.resolution} />
                </Box>
            )}

            {/* Tab Section */}
            <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{
                        backgroundColor: theme.palette.grey[100],
                        '& .MuiTab-root': {
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '1rem',
                        },
                    }}
                >
                    <Tab label="💬 Chat History" />
                    <Tab label="📝 Internal Notes" />
                </Tabs>

                {/* Increased height and scrollable area */}
                <Box
                    sx={{
                        p: 3,
                        minHeight: '600px',
                        maxHeight: '900px',
                        overflowY: 'auto',
                    }}
                >
                    {activeTab === 0 && <ChatHistory messages={ticket?.chatHistory} />}
                    {activeTab === 1 && (
                        <InternalNotes
                            notes={ticket?.notes}
                            form={internalNoteForm}
                            onAddNote={handleAddNote}
                        />
                    )}
                </Box>
            </Paper>

            {/* Close Ticket Modal */}
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
