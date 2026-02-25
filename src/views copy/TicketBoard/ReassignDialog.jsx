import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ReassignDialog = ({ open, onClose, onConfirm, fromUser, toUser }) => {
  const [reason, setReason] = useState('');
  const theme = useTheme();

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  // Helper to get initials
  const getInitials = (name) =>
    name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : '?';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs" // Smaller width feels more like a focused "Action" dialog
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Confirm Reassignment</DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        {/* Visual Transfer Flow */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            p: 2,
            borderRadius: 3,
            mb: 3,
            border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <Stack alignItems="center" spacing={1} sx={{ width: '40%' }}>
            <Avatar sx={{ bgcolor: 'grey.400', width: 45, height: 45 }}>{getInitials(fromUser)}</Avatar>
            <Typography variant="caption" fontWeight={700} noWrap sx={{ maxWidth: '100%' }}>
              {fromUser || 'Unassigned'}
            </Typography>
          </Stack>

          <SwapHorizIcon color="primary" sx={{ fontSize: 30, opacity: 0.6 }} />

          <Stack alignItems="center" spacing={1} sx={{ width: '40%' }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 45,
                height: 45,
                boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`
              }}
            >
              {getInitials(toUser)}
            </Avatar>
            <Typography variant="caption" fontWeight={700} noWrap sx={{ maxWidth: '100%' }}>
              {toUser}
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 2, color: 'text.secondary' }}>
          <InfoOutlinedIcon sx={{ fontSize: 18, mt: 0.2 }} />
          <Typography variant="body2">Please provide a brief reason for the handover to keep the audit trail clear.</Typography>
        </Stack>

        <TextField
          autoFocus
          fullWidth
          label="Handover Note"
          multiline
          minRows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. End of shift, user expertise required..."
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
          helperText={`${reason.length} / 200 characters`}
          inputProps={{ maxLength: 200 }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disableElevation
          disabled={!reason.trim()}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 700,
            textTransform: 'none'
          }}
        >
          Confirm Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReassignDialog;
