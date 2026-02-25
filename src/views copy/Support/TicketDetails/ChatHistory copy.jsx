import React, { useState, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { styled } from '@mui/system';
import dayjs from 'dayjs';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const ChatBubble = styled(Paper)(({ theme, sender }) => ({
    maxWidth: '80%',
    padding: theme.spacing(1, 2),
    borderRadius: 10,
    marginBottom: theme.spacing(1),
    alignSelf: sender === 'agent' ? 'flex-end' : 'flex-start',
    backgroundColor: sender === 'agent' ? theme.palette.primary.main : theme.palette.grey[300],
    color: sender === 'agent' ? '#fff' : '#000',
    borderTopLeftRadius: sender === 'agent' ? 10 : 0,
    borderTopRightRadius: sender === 'agent' ? 0 : 10,
    wordBreak: 'break-word',
}));

const dummyChats = [
    {
        id: 'msg1',
        sender: 'customer',
        message: 'Hi, my internet has been down since this morning.',
        timestamp: '2025-08-20T09:00:00',
    },
    {
        id: 'msg2',
        sender: 'agent',
        message: 'Thanks for reporting. We are checking the issue.',
        timestamp: '2025-08-20T09:15:00',
    },
    {
        id: 'msg3',
        sender: 'customer',
        message: 'Any updates on the outage?',
        timestamp: '2025-08-20T11:00:00',
    },
    {
        id: 'msg4',
        sender: 'agent',
        message: 'The problem seems related to local ISP. We will update you soon.',
        timestamp: '2025-08-20T11:30:00',
    },
    {
        id: 'msg5',
        sender: 'agent',
        message: 'The problem seems related to local ISP. We will update you soon.',
        timestamp: '2025-08-20T11:30:00',
    },
    {
        id: 'msg6',
        sender: 'agent',
        message: 'The problem seems related to local ISP. We will update you soon.',
        timestamp: '2025-08-20T11:30:00',
    },
];

const ChatHistory = ({ chatMessages = dummyChats, onSendMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const fileInputRef = useRef(null);

    const handleSend = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        if (onSendMessage) {
            onSendMessage({
                id: `msg-${Date.now()}`,
                sender: 'agent', // or 'customer' based on your logic
                message: trimmed,
                timestamp: new Date().toISOString(),
            });
        }
        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && onSendMessage) {
            // For demo, send just the file name as message
            onSendMessage({
                id: `msg-${Date.now()}`,
                sender: 'agent',
                message: `[File uploaded: ${file.name}]`,
                timestamp: new Date().toISOString(),
            });
        }
        // Reset input so the same file can be uploaded again if needed
        e.target.value = '';
    };

    if (!chatMessages || chatMessages.length === 0) {
        return (
            <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                No chat messages available.
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 500,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1,
            }}
        >
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    px: 1,
                    mb: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {chatMessages.map(({ id, sender, message, timestamp }) => (
                    <ChatBubble key={id} sender={sender}>
                        <Typography variant="caption" fontWeight="bold" gutterBottom>
                            {sender === 'agent' ? 'Agent' : 'Customer'}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                            {message}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: 'rgba(0,0,0,0.5)', textAlign: 'right', mt: 0.5 }}
                        >
                            {dayjs(timestamp).format('MMM D, YYYY h:mm A')}
                        </Typography>
                    </ChatBubble>
                ))}
            </Box>

            {/* Input Area */}
            <Box component="form" noValidate autoComplete="off" onSubmit={e => e.preventDefault()} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    multiline
                    maxRows={4}
                    fullWidth
                    placeholder="Type a message"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="upload media"
                                    onClick={() => fileInputRef.current.click()}
                                    edge="end"
                                >
                                    <AttachFileIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <IconButton
                    color="primary"
                    aria-label="send message"
                    onClick={handleSend}
                    disabled={inputValue.trim() === ''}
                    sx={{ alignSelf: 'flex-end' }}
                >
                    <SendIcon />
                </IconButton>

                {/* Hidden file input */}
                <input
                    type="file"
                    accept="image/*,video/*,application/pdf"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </Box>
        </Box>
    );
};

export default ChatHistory;
