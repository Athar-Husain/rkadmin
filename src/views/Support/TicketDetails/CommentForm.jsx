// src/components/CommentForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    addPublicComment,
    addAttachmentToComment,
} from '../../../redux/features/Tickets/TicketSlice';
import AttachmentUploader from './AttachmentUploader';
import FileIcon from '@mui/icons-material/AttachFile';
import {
    Box,
    Button,
    IconButton,
    TextField,
    Paper,
    Stack,
} from '@mui/material';

const CommentForm = ({ ticketId, commentType }) => {
    const dispatch = useDispatch();
    const [commentContent, setCommentContent] = useState('');
    const [filesToUpload, setFilesToUpload] = useState([]);
    const [showAttachmentUploader, setShowAttachmentUploader] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent && filesToUpload.length === 0) return;

        try {
            const commentAction =
                commentType === 'public' ? addPublicComment : addPrivateComment;
            const newComment = await dispatch(
                commentAction({ ticketId, content: commentContent })
            ).unwrap();

            if (filesToUpload.length > 0) {
                const formData = new FormData();
                filesToUpload.forEach((file) => {
                    formData.append('attachment', file);
                });
                await dispatch(
                    addAttachmentToComment({ commentId: newComment._id, formData })
                ).unwrap();
            }

            setCommentContent('');
            setFilesToUpload([]);
            setShowAttachmentUploader(false);
        } catch (error) {
            console.error('Failed to post comment or upload attachment:', error);
        }
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={3}
            sx={{ mt: 3, p: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}
        >
            <Stack spacing={2}>
                <TextField
                    label="Add a new comment"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    multiline
                    minRows={4}
                    fullWidth
                    variant="outlined"
                />

                {showAttachmentUploader && (
                    <AttachmentUploader onFilesSelected={setFilesToUpload} />
                )}

                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    <IconButton
                        onClick={() => setShowAttachmentUploader((prev) => !prev)}
                        color="primary"
                        aria-label="Add attachment"
                    >
                        <FileIcon />
                    </IconButton>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!commentContent && filesToUpload.length === 0}
                        sx={{ ml: 2 }}
                    >
                        Post Comment
                    </Button>
                </Box>
            </Stack>
        </Paper>
    );
};

export default CommentForm;
