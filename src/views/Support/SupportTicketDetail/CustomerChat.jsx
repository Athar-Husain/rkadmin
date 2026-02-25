import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import dayjs from 'dayjs';

const CustomerChat = ({ chatHistory, dark }) => {
    return (
        <Paper elevation={3} sx={{ borderRadius: 2, padding: 2, mb: 2, maxHeight: 250, overflowY: 'auto' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Customer Chat
            </Typography>

            {chatHistory && chatHistory.length > 0 ? (
                <List>
                    {chatHistory.map(({ id, sender, message, timestamp }) => (
                        <ListItem
                            key={id}
                            sx={{
                                justifyContent: sender === 'agent' ? 'flex-end' : 'flex-start',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: sender === 'agent' ? 'flex-end' : 'flex-start',
                                mb: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: sender === 'agent' ? 'primary.main' : 'grey.300',
                                    color: sender === 'agent' ? 'common.white' : 'text.primary',
                                    borderRadius: 2,
                                    p: 1.5,
                                    maxWidth: '80%',
                                    whiteSpace: 'pre-line',
                                }}
                            >
                                <Typography variant="body2" fontWeight="bold" gutterBottom>
                                    {sender === 'agent' ? 'Support Agent' : 'Customer'}
                                </Typography>
                                <Typography variant="body1">{message}</Typography>
                                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}>
                                    {dayjs(timestamp).format('MMM D, YYYY h:mm A')}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" fontStyle="italic" textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                    No chat history for this ticket.
                </Typography>
            )}
        </Paper>
    );
};

export default CustomerChat;
