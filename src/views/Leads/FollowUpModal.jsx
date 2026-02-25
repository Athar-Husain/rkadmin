import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Box,
  Paper
} from '@mui/material';
import dayjs from 'dayjs';
import { addLeadFollowUp } from '../../redux/features/Leads/LeadSlice';

const outcomes = [
  'interested',
  'not_interested',
  'no_answer',
  'callback_later',
  'wrong_number',
  'follow_up_scheduled',
  'site_survey_done',
  'quote_shared'
];

const leadStatuses = ['contacted', 'follow_up', 'site_survey', 'interested', 'on_hold', 'lost'];

const FollowUpModal = ({ open, onClose, lead }) => {
  const dispatch = useDispatch();
  const [note, setNote] = useState('');
  const [outcome, setOutcome] = useState('interested');
  const [status, setStatus] = useState(''); // New state
  const [nextDate, setNextDate] = useState('');

  // Reset local state when modal opens with a new lead
  //   useEffect(() => {
  //     if (open) {
  //       setNote('');
  //       setNextDate('');
  //     }
  //   }, [open, lead?._id]);

  useEffect(() => {
    if (open && lead) {
      setNote('');
      setNextDate('');
      setOutcome('interested');
      setStatus(lead.status); // Set initial status to current lead status
    }
  }, [open, lead?._id]);

  if (!lead) return null;

  const handleSubmit = async () => {
    const followUpData = {
      note,
      outcome,
      status,
      nextFollowUpDate: nextDate || undefined
    };

    await dispatch(addLeadFollowUp({ leadId: lead._id, data: followUpData }));
    onClose();
  };

  return (
    // <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
    //   <DialogTitle sx={{ fontWeight: 700 }}>
    //     Follow-up: {lead.name}
    //     <Typography variant="caption" display="block" color="text.secondary">
    //       Current Status: {lead.status.toUpperCase()}
    //     </Typography>
    //   </DialogTitle>

    //   <DialogContent dividers>
    //     <Stack spacing={3}>
    //       <FormControl fullWidth>
    //         <InputLabel>Outcome of Call</InputLabel>
    //         <Select value={outcome} label="Outcome of Call" onChange={(e) => setOutcome(e.target.value)}>
    //           {outcomes.map((o) => (
    //             <MenuItem key={o} value={o}>
    //               {o.replace(/_/g, ' ').toUpperCase()}
    //             </MenuItem>
    //           ))}
    //         </Select>
    //       </FormControl>

    //       <TextField
    //         label="Internal Notes"
    //         multiline
    //         rows={3}
    //         fullWidth
    //         value={note}
    //         onChange={(e) => setNote(e.target.value)}
    //         placeholder="What did the prospect say?"
    //       />

    //       <TextField
    //         label="Schedule Next Contact"
    //         type="date"
    //         InputLabelProps={{ shrink: true }}
    //         value={nextDate}
    //         onChange={(e) => setNextDate(e.target.value)}
    //         fullWidth
    //       />

    //   <Box mt={2}>
    //     <Typography variant="subtitle2" gutterBottom fontWeight={700}>
    //       History ({lead.followUps?.length || 0})
    //     </Typography>
    //     <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', bgcolor: '#fcfcfc' }}>
    //       <List dense>
    //         {lead.followUps &&
    //           [...lead.followUps].reverse().map((fu, i) => (
    //             <React.Fragment key={i}>
    //               <ListItem alignItems="flex-start">
    //                 <ListItemText
    //                   primary={<Typography variant="body2">{fu.note}</Typography>}
    //                   secondary={
    //                     <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
    //                       <Chip label={fu.outcome} size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
    //                       <Typography variant="caption">
    //                         {dayjs(fu.createdAt).format('DD MMM')} • By {fu.followedBy?.name || 'Team'}
    //                       </Typography>
    //                     </Stack>
    //                   }
    //                 />
    //               </ListItem>
    //               {i < lead.followUps.length - 1 && <Divider component="li" />}
    //             </React.Fragment>
    //           ))}
    //         {(!lead.followUps || lead.followUps.length === 0) && (
    //           <ListItem>
    //             <ListItemText secondary="No previous history" />
    //           </ListItem>
    //         )}
    //       </List>
    //     </Paper>
    //   </Box>
    //     </Stack>
    //   </DialogContent>

    //   <DialogActions sx={{ p: 2 }}>
    //     <Button onClick={onClose} color="inherit">
    //       Cancel
    //     </Button>
    //     <Button onClick={handleSubmit} variant="contained" disabled={!note.trim()} sx={{ borderRadius: 2, px: 4 }}>
    //       Save Log
    //     </Button>
    //   </DialogActions>
    // </Dialog>

    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle sx={{ fontWeight: 700 }}>Log Follow-up: {lead.name}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} mt={1}>
            <Stack direction="row" spacing={2}>
              {/* Outcome Selection */}
              <FormControl fullWidth>
                <InputLabel>Call Outcome</InputLabel>
                <Select value={outcome} label="Call Outcome" onChange={(e) => setOutcome(e.target.value)}>
                  {outcomes.map((o) => (
                    <MenuItem key={o} value={o}>
                      {o.replace(/_/g, ' ').toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Status Update Selection */}
              <FormControl fullWidth>
                <InputLabel>Update Lead Status</InputLabel>
                <Select
                  value={status}
                  label="Update Lead Status"
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{ bgcolor: 'action.hover' }}
                >
                  {leadStatuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s.replace(/_/g, ' ').toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <TextField
              label="Internal Notes"
              multiline
              rows={3}
              fullWidth
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What happened during this contact?"
            />
            <TextField
              label="Schedule Next Contact"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              fullWidth
            />

            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom fontWeight={700}>
                History ({lead.followUps?.length || 0})
              </Typography>
              <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', bgcolor: '#fcfcfc' }}>
                <List dense>
                  {lead.followUps &&
                    [...lead.followUps].reverse().map((fu, i) => (
                      <React.Fragment key={i}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={<Typography variant="body2">{fu.note}</Typography>}
                            secondary={
                              <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
                                <Chip label={fu.outcome} size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
                                <Typography variant="caption">
                                  {dayjs(fu.createdAt).format('DD MMM')} • By {fu.followedBy?.firstName || 'Team'} -{' '}
                                  {fu.followedBy?.email || 'Email'}
                                </Typography>
                              </Stack>
                            }
                          />
                        </ListItem>
                        {i < lead.followUps.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))}
                  {(!lead.followUps || lead.followUps.length === 0) && (
                    <ListItem>
                      <ListItemText secondary="No previous history" />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!note.trim()} sx={{ borderRadius: 2, px: 4 }}>
            Save Log & Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FollowUpModal;
