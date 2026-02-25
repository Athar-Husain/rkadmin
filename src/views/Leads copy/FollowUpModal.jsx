// components/leads/FollowUpModal.jsx
import React, { useState } from 'react';
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
  Chip
} from '@mui/material';
import { addFollowUp } from '../../store/slices/leadsSlice';
import dayjs from 'dayjs';

const outcomes = ['interested', 'not_interested', 'no_answer', 'callback_later', 'wrong_number', 'follow_up_scheduled'];

const FollowUpModal = ({ open, onClose, lead }) => {
  const dispatch = useDispatch();
  const [note, setNote] = useState('');
  const [outcome, setOutcome] = useState('interested');
  const [nextDate, setNextDate] = useState('');

  const handleSubmit = () => {
    dispatch(
      addFollowUp({
        leadId: lead._id,
        data: { note, outcome, nextFollowUpDate: nextDate || null }
      })
    );
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Follow-up for {lead?.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={2}>
          <TextField label="Follow-up Note" multiline rows={4} fullWidth value={note} onChange={(e) => setNote(e.target.value)} />

          <FormControl fullWidth>
            <InputLabel>Outcome</InputLabel>
            <Select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
              {outcomes.map((o) => (
                <MenuItem key={o} value={o}>
                  {o.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Next Follow-up Date (Optional)"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={nextDate}
            onChange={(e) => setNextDate(e.target.value)}
          />

          {/* Previous Follow-ups */}
          {lead?.followUps.length > 0 && (
            <>
              <Typography variant="subtitle1">Previous Follow-ups</Typography>
              <List>
                {lead.followUps
                  .slice()
                  .reverse()
                  .map((fu, i) => (
                    <React.Fragment key={i}>
                      <ListItem>
                        <ListItemText
                          primary={fu.note}
                          secondary={
                            <>
                              <Chip label={fu.outcome.replace('_', ' ')} size="small" />
                              {' • '}
                              {dayjs(fu.createdAt).fromNow()} by {fu.followedBy.firstName}
                            </>
                          }
                        />
                      </ListItem>
                      {i < lead.followUps.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
              </List>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!note.trim()}>
          Save Follow-up
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FollowUpModal;
