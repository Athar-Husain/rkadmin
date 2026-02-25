import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
  Divider,
  Badge,
  Tooltip,
  CircularProgress,
  Button
} from '@mui/material';
import { Phone, WhatsApp, LocationOn, CalendarMonth, PersonAdd, NoteAdd, Search } from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import FollowUpModal from './FollowUpModal';
// Ensure this path matches your actual file structure
import { getAllLeads, getLeadById } from '../../redux/features/Leads/LeadSlice';
import CreateLeadModal from './CreateLeadModal';

dayjs.extend(relativeTime);

const statusConfig = {
  new: { label: 'New Leads', color: '#4318FF' },
  contacted: { label: 'Contacted', color: '#2196f3' },
  follow_up: { label: 'Follow Up', color: '#ff9800' },
  interested: { label: 'Interested', color: '#E02424' }, // Added to match backend allowed statuses
  converted: { label: 'Converted', color: '#05CD99' },
  lost: { label: 'Lost', color: '#EE5D50' },
  on_hold: { label: 'On Hold', color: '#A3AED0' }
};

const LeadManagementPanel = () => {
  const dispatch = useDispatch();
  const { leads, lead, isLeadLoading } = useSelector((state) => state.lead);
  const { Admin } = useSelector((state) => state.admin);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [followUpOpen, setFollowUpOpen] = useState(false);

  // Use a debounced effect for search to avoid excessive API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // The backend expects 'status' and 'phone' (or you can use 'name' if you update backend)
      dispatch(
        getAllLeads({
          status: activeTab,
          phone: searchQuery // matching your controller's req.query.phone
        })
      );
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [activeTab, searchQuery, dispatch]);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const openFollowUpModal = (id) => {
    dispatch(getLeadById(id));
    setFollowUpOpen(true);
  };

  const getReferralChip = (leadItem) => {
    if (leadItem.createdByModel === 'Customer' && leadItem.createdBy) {
      return (
        <Chip
          icon={<WhatsApp />}
          label={`Ref: ${leadItem.createdBy.name || 'Customer'}`}
          size="small"
          color="secondary"
          variant="outlined"
        />
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8f9fc', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Lead Command Center
          </Typography>
          <Typography color="text.secondary">Track and convert fiber prospects</Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setCreateModalOpen(true)} sx={{ borderRadius: 2, px: 3 }}>
          Add Lead
        </Button>
      </Stack>
      {/* Include the Modal */}
      <CreateLeadModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      <TextField
        fullWidth
        placeholder="Search by phone number..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
        sx={{ mb: 3, maxWidth: 600, bgcolor: 'white' }}
      />
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {Object.entries(statusConfig).map(([key, config]) => (
            <Tab
              key={key}
              value={key}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: config.color }} />
                  <Typography variant="body2">{config.label}</Typography>
                </Stack>
              }
            />
          ))}
        </Tabs>

        <List sx={{ p: 0 }}>
          {isLeadLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : leads.length === 0 ? (
            <Typography textAlign="center" py={8} color="text.secondary">
              No leads found
            </Typography>
          ) : (
            leads.map((leadItem, idx) => (
              <React.Fragment key={leadItem._id}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Add Follow-up">
                        <IconButton onClick={() => openFollowUpModal(leadItem._id)} color="primary">
                          <NoteAdd />
                        </IconButton>
                      </Tooltip>
                      {leadItem.status !== 'converted' && (
                        <Tooltip title="Convert to Customer">
                          <IconButton color="success">
                            <PersonAdd />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  }
                  sx={{ py: 2, '&:hover': { bgcolor: '#fbfbfb' } }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: statusConfig[leadItem.status]?.color + '22', color: statusConfig[leadItem.status]?.color }}>
                      {leadItem.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight={700}>
                          {leadItem.name}
                        </Typography>
                        {getReferralChip(leadItem)}
                        <Chip label={dayjs(leadItem.createdAt).fromNow()} size="small" variant="contained" />
                      </Stack>
                    }
                    secondary={
                      <Stack spacing={1} mt={1}>
                        <Stack direction="row" spacing={3} color="text.secondary">
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Phone fontSize="inherit" />
                            <Typography variant="caption">{leadItem.phone}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <LocationOn fontSize="inherit" />
                            <Typography variant="caption">{leadItem.serviceArea?.name || 'No Area'}</Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    }
                  />
                </ListItem>
                {idx < leads.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
      <FollowUpModal open={followUpOpen} onClose={() => setFollowUpOpen(false)} lead={lead} />
    </Box>
  );
};

export default LeadManagementPanel;
