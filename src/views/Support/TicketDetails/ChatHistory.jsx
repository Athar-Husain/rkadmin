import React from 'react';
import { Box, Typography } from '@mui/material';
import CommentForm from './CommentForm'; // Assuming you have this component
import Comment from './Comment'; // Assuming this component exists

const ChatHistory = ({ messages, form, onAddComment }) => {
    return (
        <Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '500px', mb: 2 }}>
                {messages && messages.length > 0 ? (
                    messages.map((message) => (
                        <Comment
                            key={message._id}
                            author={message.authorName} // or `message.user` if it's an object
                            text={message.content}
                            timestamp={message.createdAt}
                            attachments={message.attachments} // Pass attachments here
                            isCustomer={message.authorModel === 'Customer'}
                        />
                    ))
                ) : (
                    <Typography color="textSecondary" textAlign="center">
                        No chat history available.
                    </Typography>
                )}
            </Box>
            <CommentForm
                form={form}
                onSubmit={onAddComment}
                placeholder="Type your public reply here..."
            />
        </Box>
    );
};

export default ChatHistory;