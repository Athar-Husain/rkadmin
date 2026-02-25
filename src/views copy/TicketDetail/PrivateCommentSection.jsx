import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  Stack,
  Avatar,
  Tooltip,
  alpha,
  useTheme,
  Zoom,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SendIcon from '@mui/icons-material/Send';
import DoneAllIcon from '@mui/icons-material/DoneAll'; // For "Read" feel
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(relativeTime);
dayjs.extend(isToday);

// ==============================|| UPDATED CHAT BUBBLE ||============================== //

const ChatBubble = ({ msg, isOwn }) => {
  const theme = useTheme();

  // Robust Name Logic: Fallback to "Me" or currentUser name if data is missing during sync
  const firstName = msg?.commentBy?.firstName || (isOwn ? 'Me' : 'Agent');
  const lastName = msg?.commentBy?.lastName || '';
  const name = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0) || ''}`;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
        mb: 2.5,
        px: 1,
        // Add a smooth entrance animation for new messages
        animation: 'fadeInUp 0.3s ease-out',
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      <Stack direction={isOwn ? 'row-reverse' : 'row'} spacing={1.5} sx={{ maxWidth: '85%' }}>
        <Tooltip title={isOwn ? 'Sent by you' : name} arrow>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: '0.75rem',
              fontWeight: 700,
              bgcolor: isOwn ? theme.palette.primary.main : theme.palette.warning.main,
              boxShadow: 1,
              mt: 'auto'
            }}
          >
            {initials.toUpperCase()}
          </Avatar>
        </Tooltip>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
          {!isOwn && (
            <Typography variant="caption" sx={{ ml: 1, mb: 0.5, fontWeight: 700, color: 'text.secondary' }}>
              {name}
            </Typography>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: isOwn ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
              bgcolor: isOwn ? theme.palette.primary.main : '#fff', // White for others, Primary for own
              color: isOwn ? '#fff' : theme.palette.text.primary,
              border: isOwn ? 'none' : `1px solid ${theme.palette.divider}`,
              position: 'relative',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="body2" sx={{ lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {msg.content}
            </Typography>

            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end" sx={{ mt: 0.5, opacity: 0.7 }}>
              <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                {msg.createdAt ? dayjs(msg.createdAt).format('hh:mm A') : 'Sending...'}
              </Typography>
              {isOwn && (
                <DoneAllIcon
                  sx={{
                    fontSize: 14,
                    color: msg._id ? '#fff' : alpha('#fff', 0.5) // Dim icon while sending
                  }}
                />
              )}
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
};

// ==============================|| UPDATED MAIN SECTION ||============================== //

const PrivateCommentSection = ({ messages = [], onSend, disabled, currentUser }) => {
  const theme = useTheme();

  const [text, setText] = useState('');
  const scrollRef = useRef(null);

//   console.log('messages', messages);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#f0f2f5', borderRadius: 3, overflow: 'hidden' }}>
      {/* Header - Fixed Height */}
      <Box sx={{ p: 2, bgcolor: '#fff', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ p: 1, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2, display: 'flex' }}>
              <LockIcon sx={{ fontSize: 18, color: theme.palette.warning.main }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                Internal Team Notes
              </Typography>
              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
                Active Collaboration
              </Typography>
            </Box>
          </Stack>
          <Chip
            label="Private"
            size="small"
            sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.dark }}
          />
        </Stack>
      </Box>

      {/* Chat Area */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          backgroundImage: `linear-gradient(${alpha('#f0f2f5', 0.95)}, ${alpha('#f0f2f5', 0.95)}), url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
          backgroundSize: '400px'
        }}
      >
        {messages.map((m, index) => {
          // KEY FIX: Improved check for 'Own' message
          // Check for matching ID OR check if m.commentBy is just the currentUser object (common in optimistic updates)
          const isOwn =
            m.commentBy?._id === currentUser?._id ||
            m.commentBy === currentUser?._id ||
            (m.commentBy?.firstName === currentUser?.firstName && !m._id); // Check by name if no ID exists yet

          return (
            <React.Fragment key={m._id || index}>
              {/* Date Divider logic would go here */}
              <ChatBubble msg={m} isOwn={isOwn} />
            </React.Fragment>
          );
        })}
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: '2px 12px',
              bgcolor: '#f0f2f5',
              borderRadius: 3,
              border: '1px solid transparent',
              transition: 'all 0.2s',
              '&:focus-within': { borderColor: theme.palette.primary.main, bgcolor: '#fff', boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)' }
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Lock a note for the team..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              disabled={disabled}
              variant="standard"
              InputProps={{ disableUnderline: true, sx: { fontSize: '0.9rem', py: 1 } }}
            />
          </Paper>

          <Zoom in={text.trim().length > 0}>
            <IconButton
              onClick={handleSend}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                '&:hover': { bgcolor: theme.palette.primary.dark },
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                width: 44,
                height: 44
              }}
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Zoom>
        </Stack>
      </Box>
    </Box>
  );
};

export default PrivateCommentSection;
