import React from 'react';
import { Box, Typography } from '@mui/material';
import CommentForm from './CommentForm'; // Reusing the same form component
import Note from './Note'; // Assuming you have a component for rendering notes

const InternalNotes = ({ notes, form, onAddNote }) => {
    return (
        <Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '500px', mb: 2 }}>
                {notes && notes.length > 0 ? (
                    notes.map((note) => (
                        <Note
                            key={note._id}
                            author={note.authorName}
                            text={note.content}
                            timestamp={note.createdAt}
                            attachments={note.attachments} // Pass attachments here
                        />
                    ))
                ) : (
                    <Typography color="textSecondary" textAlign="center">
                        No internal notes available.
                    </Typography>
                )}
            </Box>
            <CommentForm
                form={form}
                onSubmit={onAddNote}
                placeholder="Add an internal note..."
            />
        </Box>
    );
};

export default InternalNotes;