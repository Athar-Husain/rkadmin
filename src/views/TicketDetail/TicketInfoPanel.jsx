// src/views/TicketDetail/TicketInfoPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  TextField,
  Paper,
  alpha,
  useTheme,
  Grid,
  Tooltip,
  CircularProgress
} from '@mui/material';

import {
  EditTwoTone as EditIcon,
  AccessTime as TimeIcon,
  PriorityHigh as PriorityIcon,
  Router as RouterIcon,
  SettingsInputComponent as STBIcon,
  Badge as IDIcon,
  CellTower as ConnectionIcon,
  ContentCopy as CopyIcon,
  ConfirmationNumber as TicketIcon,
  PersonOutline as PersonIcon,
  CallMade
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { assignTicket } from '../../redux/features/Tickets/TicketSlice';
import { getAllTeamMembers } from '../../redux/features/Team/TeamSlice';
import { toast } from 'react-toastify';

dayjs.extend(relativeTime);

/* ---------------- STATUS COLORS ---------------- */
const statusConfig = {
  Open: { color: '#10b981', bg: '#ecfdf5' },
  'In Progress': { color: '#3b82f6', bg: '#eff6ff' },
  Resolved: { color: '#6366f1', bg: '#f5f3ff' },
  Closed: { color: '#64748b', bg: '#f8fafc' },
  Escalated: { color: '#f59e0b', bg: '#fffbeb' }
};

/* ---------------- HELPERS ---------------- */
const getResolutionDuration = (createdAt, resolvedAt) => {
  if (!createdAt || !resolvedAt) return '—';

  const start = dayjs(createdAt);
  const end = dayjs(resolvedAt);

  const minutes = end.diff(start, 'minute');
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
};

/* ---------------- COMPONENT ---------------- */
const TicketInfoPanel = ({ ticket, onCloseClick }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { teamMembers } = useSelector((s) => s.team);

  const [reassignOpen, setReassignOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const isClosedOrResolved = ['closed', 'resolved'].includes(ticket?.status?.toLowerCase());

  const conn = ticket?.connection || {};

  useEffect(() => {
    if (!teamMembers?.length) {
      dispatch(getAllTeamMembers());
    }
  }, [dispatch, teamMembers]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard', { autoClose: 800 });
  };

  const handleConfirmReassign = async () => {
    if (!selectedMember) return toast.error('Please select an agent');

    if (selectedMember === ticket?.assignedTo?._id) {
      return toast.error('This agent is already assigned');
    }

    const member = teamMembers.find((m) => m._id === selectedMember);

    try {
      setLoading(true);
      await dispatch(
        assignTicket({
          id: ticket._id,
          data: {
            newAssignedTo: selectedMember,
            newAssignedToModel: member?.userType || 'Team',
            note: note.trim() || 'Manual reassignment'
          }
        })
      ).unwrap();

      toast.success(`Assigned to ${member?.firstName}`);
      setReassignOpen(false);
      setSelectedMember('');
      setNote('');
    } catch (err) {
      toast.error(err?.message || 'Failed to reassign ticket');
    } finally {
      setLoading(false);
    }
  };

  const PropRow = ({ icon: Icon, label, value, copyable }) => (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: 'text.disabled',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 0.3,
          fontSize: '0.55rem'
        }}
      >
        <Icon sx={{ fontSize: 12 }} /> {label.toUpperCase()}
      </Typography>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
          {value || '—'}
        </Typography>
        {copyable && value && (
          <Tooltip title="Copy">
            <IconButton size="small" sx={{ p: 0.2 }} onClick={() => handleCopy(value)}>
              <CopyIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );

  // Filter members so current assignee doesn't show up in list
  const availableMembers = teamMembers?.filter((m) => m._id !== ticket?.assignedTo?._id) || [];

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <TicketIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
            <Typography variant="subtitle1" fontWeight={800}>
              Ticket #{ticket?._id?.slice(-6).toUpperCase()}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
            {ticket?.issueType || 'General'}
          </Typography>
        </Box>

        <Stack spacing={0.5} alignItems="flex-end">
          <Chip
            size="small"
            label={ticket?.status?.toUpperCase()}
            sx={{
              bgcolor: statusConfig[ticket?.status]?.bg,
              color: statusConfig[ticket?.status]?.color,
              fontWeight: 900
            }}
          />
          <Chip size="small" label={ticket?.priority?.toUpperCase()} variant="outlined" icon={<PriorityIcon sx={{ fontSize: 12 }} />} />
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* BODY */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {/* CUSTOMER */}
        <Paper sx={{ p: 1.5, mb: 2 }}>
          <Stack direction="row" spacing={1.5}>
            <Avatar>{ticket?.customer?.firstName?.[0]}</Avatar>
            <Box>
              <Typography fontWeight={700}>
                {ticket?.customer?.firstName} {ticket?.customer?.lastName}
              </Typography>
              <Typography variant="caption">{ticket?.customer?.phone || 'No Phone'}</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* CONNECTION */}
        <Grid container spacing={1} mb={2}>
          <Grid size={{ xs: 6 }}>
            <PropRow icon={IDIcon} label="User ID" value={conn?.userId} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <PropRow icon={RouterIcon} label="Box ID" value={conn?.boxId} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <PropRow icon={STBIcon} label="STB" value={conn?.stbNumber} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <PropRow icon={CallMade} label="Contact" value={conn?.contactNo} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <PropRow icon={ConnectionIcon} label="Service Area" value={conn?.serviceArea?.region} />
          </Grid>
        </Grid>

        {/* DESCRIPTION */}
        <Paper sx={{ p: 1.5, mb: 2 }}>
          <Typography variant="caption" fontWeight={800}>
            ISSUE DESCRIPTION
          </Typography>
          <Typography variant="body2">{ticket?.description}</Typography>
        </Paper>

        {/* 🔥 RESOLUTION DETAILS (ONLY FOR CLOSED / RESOLVED) */}
        {isClosedOrResolved && (
          <Paper
            sx={{
              p: 1.5,
              mb: 2,
              border: `1px solid ${theme.palette.success.main}`,
              bgcolor: alpha(theme.palette.success.main, 0.05)
            }}
          >
            <Typography variant="caption" fontWeight={800}>
              RESOLUTION DETAILS
            </Typography>

            <Grid container spacing={1} mt={0.5}>
              <Grid size={{ xs: 6 }}>
                <PropRow
                  icon={PersonIcon}
                  label="Resolved By"
                  value={`${ticket?.resolvedBy?.firstName || ''} ${ticket?.resolvedBy?.lastName || ''}`}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <PropRow icon={TimeIcon} label="Resolved At" value={dayjs(ticket?.resolvedAt).format('DD MMM, hh:mm A')} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <PropRow icon={TimeIcon} label="Resolution Time" value={getResolutionDuration(ticket?.createdAt, ticket?.resolvedAt)} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" mt={0.5}>
                  {ticket?.resolutionMessage || 'No resolution message'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* FOOTER SECTION (ASSIGNMENT) */}
      <Box sx={{ pt: 2, mt: 'auto', borderTop: `1px solid ${theme.palette.divider}` }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.85rem' }}>
            <PersonIcon fontSize="small" />
          </Avatar>
          <Box flex={1}>
            <Typography variant="caption" color="text.disabled" fontWeight={700} display="block" sx={{ lineHeight: 1 }}>
              CURRENT ASSIGNEE
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {ticket?.assignedTo?.firstName ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : 'Unassigned'}
            </Typography>
          </Box>
          <Tooltip title="Change Assignee">
            <IconButton
              size="small"
              onClick={() => setReassignOpen(true)}
              disabled={isClosedOrResolved}
              sx={{ border: `1px solid ${theme.palette.divider}` }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          color="error"
          size="medium"
          disabled={isClosedOrResolved}
          onClick={onCloseClick}
          sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
        >
          {isClosedOrResolved ? 'Ticket Resolved' : 'Resolve Ticket'}
        </Button>
      </Box>

      {/* REASSIGN DIALOG */}
      <Dialog
        open={reassignOpen}
        onClose={() => !loading && setReassignOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={800}>
            Reassign Ticket
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select a new team member to handle this case.
          </Typography>
        </DialogTitle>

        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Select Agent</InputLabel>
            <Select value={selectedMember} label="Select Agent" onChange={(e) => setSelectedMember(e.target.value)} disabled={loading}>
              {availableMembers.length > 0 ? (
                availableMembers.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 20, height: 20, fontSize: '0.6rem' }}>{m.firstName?.[0]}</Avatar>
                      <Typography variant="body2">
                        {m.firstName} {m.lastName}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No other agents available</MenuItem>
              )}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label="Internal Note (Optional)"
            rows={3}
            multiline
            placeholder="Reason for reassignment..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={loading}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setReassignOpen(false)} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmReassign}
            disabled={loading || !selectedMember}
            startIcon={loading && <CircularProgress size={16} color="inherit" />}
          >
            {loading ? 'Assigning...' : 'Confirm Assignment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* FOOTER */}
      {/* <Button fullWidth variant="contained" color="error" disabled={isClosedOrResolved} onClick={onCloseClick}>
        {isClosedOrResolved ? 'Ticket Resolved' : 'Resolve Ticket'}
      </Button> */}
    </Box>
  );
};

export default TicketInfoPanel;
