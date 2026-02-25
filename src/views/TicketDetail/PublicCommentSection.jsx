import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Divider, Avatar, TextField, IconButton, Tooltip, Stack, Paper, alpha, useTheme, Zoom, Chip } from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  CheckCircle as SentIcon,
  DoneAll as ReadIcon,
  SupportAgent as AgentIcon,
  AccountCircle as CustomerIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(relativeTime);
dayjs.extend(isToday);

// ==============================|| CHAT BUBBLE COMPONENT ||============================== //

const PublicBubble = ({ msg, isOwn }) => {
  const theme = useTheme();
  const name = msg?.commentBy?.firstName ? `${msg.commentBy.firstName} ${msg.commentBy.lastName || ''}` : 'Customer';
  const time = msg?.createdAt ? dayjs(msg.createdAt).format('hh:mm A') : '';
  const initials = name.charAt(0).toUpperCase();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
        mb: 2.5,
        width: '100%'
      }}
    >
      <Stack direction={isOwn ? 'row-reverse' : 'row'} spacing={1.5} sx={{ maxWidth: { xs: '90%', md: '75%' } }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.8rem',
            fontWeight: 700,
            bgcolor: isOwn ? theme.palette.primary.main : theme.palette.grey[400],
            boxShadow: `0 2px 6px ${alpha(isOwn ? theme.palette.primary.main : '#000', 0.2)}`,
            mt: 'auto' // WhatsApp style bottom-aligned avatar
          }}
        >
          {isOwn ? <AgentIcon sx={{ fontSize: 18 }} /> : initials}
        </Avatar>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              bgcolor: isOwn ? theme.palette.primary.main : '#fff',
              color: isOwn ? 'white' : 'text.primary',
              borderRadius: isOwn ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
              border: isOwn ? 'none' : '1px solid #e0e6ed',
              boxShadow: isOwn ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}` : '0 2px 4px rgba(0,0,0,0.02)',
              position: 'relative'
            }}
          >
            <Typography variant="body2" sx={{ lineHeight: 1.5, wordBreak: 'break-word' }}>
              {msg.content}
            </Typography>

            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end" sx={{ mt: 0.5, opacity: 0.8 }}>
              <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                {time}
              </Typography>
              {isOwn && <ReadIcon sx={{ fontSize: 12 }} />}
            </Stack>
          </Paper>

          {!isOwn && (
            <Typography variant="caption" sx={{ ml: 1, mt: 0.5, fontWeight: 600, color: 'text.disabled', fontSize: '0.65rem' }}>
              {name.toUpperCase()}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

// ==============================|| MAIN SECTION ||============================== //

const PublicCommentSection = ({ messages = [], onSend, currentUser, disabled }) => {
  const theme = useTheme();
  const [text, setText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#f8fafc', // Sophisticated soft grey-blue bg
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}
    >
      {/* HEADER */}
      <Box sx={{ p: 2, bgcolor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
            <CustomerIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={800}>
              Customer Communication
            </Typography>
            <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 6, height: 6, bgcolor: 'success.main', borderRadius: '50%' }} />
              Live Support Channel
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* MESSAGE LIST */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', // Subtile WhatsApp Pattern
          backgroundOpacity: 0.05,
          backgroundColor: '#fff'
          //   backgroundImage: `radial-gradient(${alpha(theme.palette.divider, 0.4)} 1px, transparent 1px)`,
          //   backgroundSize: '24px 24px'
        }}
      >
        {messages.length > 0 ? (
          messages.map((m, index) => {
            const isOwn = m.commentBy?._id === currentUser?._id;
            const showDateDivider = index === 0 || !dayjs(m.createdAt).isSame(messages[index - 1].createdAt, 'day');

            return (
              <React.Fragment key={m._id || index}>
                {showDateDivider && (
                  <Divider sx={{ my: 3 }}>
                    <Chip
                      label={dayjs(m.createdAt).isToday() ? 'Today' : dayjs(m.createdAt).format('DD MMM YYYY')}
                      size="small"
                      sx={{ fontSize: '0.65rem', fontWeight: 800, bgcolor: '#fff', border: '1px solid #e2e8f0' }}
                    />
                  </Divider>
                )}
                <PublicBubble msg={m} isOwn={isOwn} />
              </React.Fragment>
            );
          })
        ) : (
          <Box sx={{ m: 'auto', textAlign: 'center', p: 4 }}>
            <Typography variant="body2" color="text.disabled" fontWeight={600}>
              No messages yet. Send a greeting to start the conversation.
            </Typography>
          </Box>
        )}
      </Box>

      {/* INPUT AREA */}
      <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          {/* <Tooltip title="Attach Files">
            <IconButton size="small" sx={{ mb: 0.5 }}>
              <AttachIcon />
            </IconButton>
          </Tooltip> */}

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              bgcolor: '#f1f5f9',
              borderRadius: 3,
              p: '2px 12px',
              border: '1px solid transparent',
              transition: 'all 0.2s',
              '&:focus-within': {
                bgcolor: '#fff',
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`
              }
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Write a reply..."
              variant="standard"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={disabled}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: '0.9rem', py: 1 }
              }}
            />
          </Paper>

          <Zoom in={text.trim().length > 0}>
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={disabled || !text.trim()}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                mb: 0.2,
                '&:hover': { bgcolor: theme.palette.primary.dark },
                '&.Mui-disabled': { bgcolor: theme.palette.grey[200] }
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

export default PublicCommentSection;
