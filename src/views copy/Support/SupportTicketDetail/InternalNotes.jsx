import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    List,
    ListItem,
    Tooltip,
    Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';

const MAX_NOTE_LENGTH = 500;
const MAX_FILE_SIZE_MB = 5;

const bytesToMB = (bytes) => bytes / (1024 * 1024);

const InternalNotes = ({ notes, onAddNote }) => {
    const [error, setError] = useState('');
    const [attachedFiles, setAttachedFiles] = useState([]);
    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm({
        defaultValues: { noteText: '' },
    });

    const noteText = watch('noteText');

    const submitNote = (data) => {
        const trimmedText = data.noteText.trim();
        if (!trimmedText && attachedFiles.length === 0) {
            setError('Please add a note or attach a file');
            return;
        }
        if (trimmedText.length > MAX_NOTE_LENGTH) {
            setError(`Note cannot exceed ${MAX_NOTE_LENGTH} characters`);
            return;
        }
        setError('');

        // Prepare combined note content with attached files info
        const filesText = attachedFiles.length
            ? `\n\n[Attached files: ${attachedFiles.map((f) => f.name).join(', ')}]`
            : '';

        onAddNote(trimmedText + filesText);
        reset();
        setAttachedFiles([]);
    };

    // Clear error on input change or file change
    useEffect(() => {
        if (
            error &&
            (noteText.trim().length > 0 || attachedFiles.length > 0) &&
            noteText.length <= MAX_NOTE_LENGTH
        ) {
            setError('');
        }
    }, [noteText, attachedFiles, error]);

    // Handle file input change
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const oversizeFiles = files.filter((f) => bytesToMB(f.size) > MAX_FILE_SIZE_MB);

        if (oversizeFiles.length > 0) {
            setError(`Each file must be smaller than ${MAX_FILE_SIZE_MB} MB`);
            return;
        }

        setAttachedFiles((prev) => [...prev, ...files]);
        setError('');
        e.target.value = null; // reset input
    };

    // Remove attached file
    const removeFile = (index) => {
        setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <Box
            sx={{
                // maxHeight: 220,
                display: 'flex',
                flexDirection: 'column',
                height: 500,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1,
            }}
        >
            <Typography variant="h6" fontWeight="bold">
                Internal Notes
            </Typography>

            <List sx={{ px: 0, flexGrow: 1, overflowY: 'auto' }}>
                {notes?.length === 0 && (
                    <Typography
                        variant="body2"
                        fontStyle="italic"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ py: 2 }}
                    >
                        No notes available.
                    </Typography>
                )}

                {notes?.map(({ id, author, timestamp, text }) => (
                    <ListItem
                        key={id}
                        sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            py: 1.5,
                            whiteSpace: 'pre-line',
                            wordBreak: 'break-word',
                        }}
                    >
                        <Typography variant="body2" fontWeight="bold" mb={0.5} noWrap>
                            {author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" mb={1} sx={{ fontStyle: 'italic' }}>
                            {dayjs(timestamp).format('MMM D, YYYY h:mm A')}
                        </Typography>
                        <Typography variant="body2">{text}</Typography>
                    </ListItem>
                ))}
            </List>

            {/* Attached files preview */}
            {attachedFiles?.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        mb: 1,
                        maxHeight: 80,
                        overflowX: 'auto',
                    }}
                    aria-label="Attached files preview"
                >
                    {attachedFiles?.map((file, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: 'relative',
                                display: 'inline-flex',
                                alignItems: 'center',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                px: 1,
                                py: 0.5,
                                bgcolor: 'background.paper',
                                maxWidth: 160,
                            }}
                        >
                            {/* File type icon or preview (only image preview here) */}
                            {file.type.startsWith('image/') ? (
                                <Avatar
                                    variant="rounded"
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    sx={{ width: 40, height: 40, mr: 1, flexShrink: 0 }}
                                />
                            ) : (
                                <AttachFileIcon sx={{ mr: 1 }} />
                            )}

                            <Typography
                                noWrap
                                variant="body2"
                                sx={{ flexGrow: 1, userSelect: 'text' }}
                                title={file.name}
                            >
                                {file.name}
                            </Typography>

                            <IconButton
                                size="small"
                                color="error"
                                aria-label={`Remove file ${file.name}`}
                                onClick={() => removeFile(index)}
                                sx={{ ml: 0.5 }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Input & Actions fixed at bottom */}
            <Box
                component="form"
                onSubmit={handleSubmit(submitNote)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    position: 'sticky',
                    bottom: 0,
                    bgcolor: 'background.paper',
                    py: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    zIndex: 10,
                }}
                noValidate
            >
                <Controller
                    name="noteText"
                    control={control}
                    rules={{
                        maxLength: {
                            value: MAX_NOTE_LENGTH,
                            message: `Note cannot exceed ${MAX_NOTE_LENGTH} characters`,
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            placeholder="Add a note..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={4}
                            error={!!error}
                            helperText={error || `${noteText?.length || 0}/${MAX_NOTE_LENGTH}`}
                            inputProps={{ maxLength: MAX_NOTE_LENGTH, 'aria-label': 'Add internal note' }}
                        />
                    )}
                />

                <Tooltip title="Attach files">
                    <IconButton
                        color="primary"
                        component="label"
                        aria-label="Attach files"
                        sx={{ p: '10px' }}
                    >
                        <input
                            hidden
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
                            aria-describedby="file-upload-description"
                        />
                        <AttachFileIcon />
                    </IconButton>
                </Tooltip>

                <IconButton
                    color="primary"
                    type="submit"
                    aria-label="Add note"
                    disabled={noteText.trim().length === 0 && attachedFiles.length === 0 || !!error}
                    sx={{ p: '10px' }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default InternalNotes;
