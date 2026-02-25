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
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// MUI Icons
import FileIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import AttachmentIcon from '@mui/icons-material/Attachment';

// Component Imports
import TicketInfoCard from './TicketInfoCard';
import DescriptionCard from './DescriptionCard';
import ResolutionCard from './ResolutionCard';
import ChatHistory from './ChatHistory';
import InternalNotes from './InternalNotes';
import CloseTicketModal from './CloseTicketModal';
import CommentForm from './CommentForm';

// Redux Imports
import {
    getTicketById,
    resolveTicket,
    addPublicComment,
    addPrivateComment,
} from '../../../redux/features/Tickets/TicketSlice';
import { useParams } from 'react-router-dom';

// Helper functions for file display
const getFileIcon = (file) => {
    const fileName = file.name || file.filename;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileExtension)) return <ImageIcon />;
    if (fileExtension === 'pdf') return <PictureAsPdfIcon />;
    return <FileIcon />;
};

const formatFileSize = (size) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const TicketDetails = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { ticketId } = useParams();

    const { ticket, isLoading, isError, message } = useSelector(state => state.ticket);

    const [activeTab, setActiveTab] = useState(0);
    const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);

    const publicCommentForm = useForm({ defaultValues: { content: '', files: [] } });
    const privateCommentForm = useForm({ defaultValues: { content: '', files: [] } });
    const resolutionForm = useForm({ defaultValues: { resolutionMessage: '' } });

    useEffect(() => {
        if (ticketId) {
            dispatch(getTicketById(ticketId));
        }
    }, [dispatch, ticketId]);

    const handleTabChange = (_, newValue) => setActiveTab(newValue);

    const handleAddPublicComment = async (data) => {
        const formData = new FormData();
        formData.append('content', data.content);
        data.files.forEach(file => formData.append('attachment', file));

        await dispatch(addPublicComment({ ticketId, formData }));
        publicCommentForm.reset();
        dispatch(getTicketById(ticketId));
    };

    const handleAddPrivateComment = async (data) => {
        const formData = new FormData();
        formData.append('content', data.content);
        data.files.forEach(file => formData.append('attachment', file));

        await dispatch(addPrivateComment({ ticketId, formData }));
        privateCommentForm.reset();
        dispatch(getTicketById(ticketId));
    };

    const handleCloseTicket = (data) => {
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

    if (!ticket) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6">Ticket not found.</Typography>
            </Box>
        );
    }

    return (
        <Box p={4} maxWidth="900px" mx="auto">
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

            <Box mb={3}>
                <TicketInfoCard ticket={ticket} />
            </Box>

            <Box mb={3}>
                <DescriptionCard description={ticket?.description} />
            </Box>

            {ticket?.status === 'Resolved' && ticket?.resolution && (
                <Box mb={3}>
                    <ResolutionCard resolution={ticket?.resolution} />
                </Box>
            )}

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
                    <Tab label="📎 Attachments" icon={<AttachmentIcon />} iconPosition="start" />
                </Tabs>

                <Box
                    sx={{
                        p: 3,
                        minHeight: '600px',
                        maxHeight: '900px',
                        overflowY: 'auto',
                    }}
                >
                    {activeTab === 0 && (
                        <Box>
                            <ChatHistory messages={ticket?.publicComments} />
                            <CommentForm
                                form={publicCommentForm}
                                onSubmit={handleAddPublicComment}
                                placeholder="Type your public reply here..."
                                isPublic={true}
                            />
                        </Box>
                    )}
                    {activeTab === 1 && (
                        <Box>
                            <InternalNotes notes={ticket?.privateComments} />
                            <CommentForm
                                form={privateCommentForm}
                                onSubmit={handleAddPrivateComment}
                                placeholder="Add an internal note..."
                                isPublic={false}
                            />
                        </Box>
                    )}
                    {activeTab === 2 && (
                        <Box>
                            <Typography variant="h6" mb={2}>All Ticket Attachments</Typography>
                            {ticket?.attachments?.length > 0 ? (
                                <List>
                                    {ticket.attachments.map((attachment) => (
                                        <ListItem key={attachment._id} button component="a" href={attachment.src} target="_blank">
                                            <ListItemIcon>
                                                {getFileIcon(attachment)}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={attachment.name}
                                                secondary={formatFileSize(attachment.size)}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography color="textSecondary">No attachments found for this ticket.</Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>

            <CloseTicketModal
                open={isResolutionModalOpen}
                onClose={handleCloseResolutionModal}
                form={resolutionForm}
                onSubmit={handleCloseTicket}
            />
        </Box>
    );
};

export default TicketDetails;