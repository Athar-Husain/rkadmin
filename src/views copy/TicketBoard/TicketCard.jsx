import React from 'react';
import { Paper, Typography, Box, Chip, Tooltip, Avatar, Stack, alpha, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getPriorityStyles = (priority, theme) => {
  const p = priority?.toLowerCase();
  switch (p) {
    case 'low':
      return { color: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.1) };
    case 'medium':
      return { color: theme.palette.warning.main, bg: alpha(theme.palette.warning.main, 0.1) };
    case 'high':
      return { color: theme.palette.error.main, bg: alpha(theme.palette.error.main, 0.1) };
    default:
      return { color: theme.palette.grey[500], bg: alpha(theme.palette.grey[500], 0.1) };
  }
};

const TicketCard = ({ ticket }) => {
  const theme = useTheme();
  const styles = getPriorityStyles(ticket.priority, theme);

  const assignedUser = ticket.assignedTo;
  const initials = assignedUser ? `${assignedUser.firstName?.[0] || ''}${assignedUser.lastName?.[0] || ''}` : '?';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        cursor: 'grab',
        transition: 'all 0.2s ease-in-out',
        bgcolor: '#fff',
        '&:hover': {
          borderColor: theme.palette.primary.light,
          boxShadow: '0 8px 24px rgba(149, 157, 165, 0.15)',
          transform: 'translateY(-2px)',
          '& .drag-handle': { opacity: 1 }
        },
        '&:active': { cursor: 'grabbing' }
      }}
    >
      {/* Top Row: Priority & Drag Handle */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Chip
          label={ticket.priority.toUpperCase()}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.65rem',
            fontWeight: 800,
            color: styles.color,
            bgcolor: styles.bg,
            borderRadius: '6px',
            border: `1px solid ${alpha(styles.color, 0.2)}`
          }}
        />
        <DragIndicatorIcon className="drag-handle" sx={{ fontSize: 18, color: 'text.disabled', opacity: 0, transition: '0.2s' }} />
      </Stack>

      {/* Title / Description */}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {ticket.description}
      </Typography>

      {/* Mid Row: Issue Type Tag */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            color: 'primary.main',
            px: 1,
            py: 0.3,
            borderRadius: 1,
            fontSize: '0.7rem',
            fontWeight: 600
          }}
        >
          #{ticket.issueType}
        </Typography>
      </Box>

      <Divider sx={{ mb: 1.5, borderStyle: 'dashed' }} />

      {/* Bottom Row: User & Date */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Tooltip title={assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : 'Unassigned'}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: '0.65rem',
                bgcolor: assignedUser ? theme.palette.primary.main : theme.palette.grey[300],
                fontWeight: 700
              }}
            >
              {initials}
            </Avatar>
            {!assignedUser && (
              <Typography variant="caption" color="text.disabled">
                Unassigned
              </Typography>
            )}
          </Stack>
        </Tooltip>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
          <AccessTimeIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {dayjs(ticket.createdAt).fromNow(true)}
          </Typography>
        </Stack>
      </Stack>

      {/* Hidden ID for reference on hover */}
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          top: 8,
          right: 32,
          fontSize: '0.6rem',
          color: 'text.disabled',
          fontFamily: 'monospace'
        }}
      >
        {ticket._id.substring(ticket._id.length - 6)}
      </Typography>
    </Paper>
  );
};

export default TicketCard;
