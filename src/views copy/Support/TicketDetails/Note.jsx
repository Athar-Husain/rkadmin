import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import dayjs from 'dayjs'; // <-- Using dayjs now
import { styled } from '@mui/system';
import AttachmentIcon from '@mui/icons-material/Attachment';
import FileIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';

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

const NotePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderLeft: `4px solid ${theme.palette.info.main}`,
    borderRadius: theme.shape.borderRadius,
}));

const Note = ({ author, text, timestamp, attachments }) => {
    const formattedDate = timestamp ? dayjs(timestamp).format('MMM DD, YYYY HH:mm') : 'Unknown Date';

    return (
        <NotePaper elevation={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight="bold" color="textPrimary">
                    Internal Note from {author || 'System'}
                </Typography>
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
        </NotePaper>
    );
};

export default Note;