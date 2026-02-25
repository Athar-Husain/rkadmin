// src/views/TicketDetail/TicketHeader.jsx
import React from 'react';
import { Box, Typography, Button, Chip, Stack, useTheme, Paper, alpha, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  open: { color: 'success', label: 'Open' },
  'in-progress': { color: 'warning', label: 'In Progress' },
  resolved: { color: 'info', label: 'Resolved' },
  closed: { color: 'error', label: 'Closed' },
  escalated: { color: 'error', label: 'Escalated' }
};

const TicketHeader = ({ ticket, onCloseTicket, onReassign, isClosedOrResolved }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const currentStatus = ticket?.status?.toLowerCase() || 'open';
  const config = statusConfig[currentStatus] || { color: 'default', label: ticket?.status };

  return (
    <Paper
      elevation={0}
      component={motion.div}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        p: 2,
        borderRadius: 3,
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `1px solid ${theme.palette.divider}`,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}
    >
      {/* LEFT: Back button + Title */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Tooltip title="Back to Board">
          <IconButton onClick={() => navigate(-1)} sx={{ border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1), px: 1, borderRadius: 1 }}
            >
              #{ticket?._id?.slice(-6)?.toUpperCase()}
            </Typography>
            <Chip
              label={config.label}
              color={config.color}
              size="small"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}
            />
          </Stack>
          <Typography variant="h6" fontWeight="700" sx={{ mt: 0.2, lineHeight: 1.2 }}>
            {ticket?.subject || 'No subject provided'}
          </Typography>
        </Box>
      </Stack>

      {/* RIGHT: Actions */}
      <Stack direction="row" spacing={1.5}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<SwapHorizIcon />}
          onClick={onReassign}
          disabled={isClosedOrResolved}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, borderColor: theme.palette.divider }}
        >
          Reassign
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<CloseIcon />}
          onClick={onCloseTicket}
          disabled={isClosedOrResolved}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { boxShadow: theme.shadows[4] }
          }}
        >
          {isClosedOrResolved ? 'Resolved' : 'Close Ticket'}
        </Button>
      </Stack>
    </Paper>
  );
};

export default TicketHeader;
