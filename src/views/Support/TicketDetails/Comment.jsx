import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import dayjs from 'dayjs';

import { styled } from '@mui/system';
import AttachmentIcon from '@mui/icons-material/Attachment';
import FileIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

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

const CommentPaper = styled(Paper)(({ theme, isCustomer }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: isCustomer ? theme.palette.info.light : theme.palette.grey[100],
    borderLeft: `4px solid ${isCustomer ? theme.palette.info.main : theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
}));

const Comment = ({ author, text, timestamp, attachments, isCustomer }) => {
    const formattedDate = timestamp ? dayjs(timestamp).format('MMM DD, YYYY HH:mm') : 'Unknown Date';

    return (
        <CommentPaper elevation={1} isCustomer={isCustomer}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box display="flex" alignItems="center">
                    {isCustomer ? (
                        <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    ) : (
                        <SupportAgentIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    )}
                    <Typography variant="subtitle2" fontWeight="bold" color="textPrimary">
                        {isCustomer ? 'Customer' : 'Agent'} ({author || 'System'})
                    </Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">
                    {formattedDate}
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {text}
            </Typography>

            {attachments && attachments.length > 0 && (
                <Box mt={2}>
                    <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                        <AttachmentIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                        Attachments:
                    </Typography>
                    <List dense>
                        {attachments.map((attachment) => (
                            <ListItem
                                key={attachment._id}
                                disablePadding
                                component="a"
                                href={attachment.src}
                                target="_blank"
                                sx={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    {getFileIcon(attachment)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                                            {attachment.name}
                                        </Typography>
                                    }
                                    secondary={formatFileSize(attachment.size)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </CommentPaper>
    );
};

export default Comment;