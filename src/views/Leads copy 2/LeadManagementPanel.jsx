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
  CircularProgress
} from '@mui/material';
import { Phone, WhatsApp, LocationOn, CalendarMonth, PersonAdd, NoteAdd, Search } from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import FollowUpModal from './FollowUpModal';
import { getAllLeads, getLeadById } from '../../redux/features/Leads/LeadSlice';
// import { getAllLeads, getLeadById } from '../../redux/features/lead/leadsSlice';

dayjs.extend(relativeTime);

const statusConfig = {
  new: { label: 'New Leads', color: '#4318FF' },
  contacted: { label: 'Contacted', color: '#2196f3' },
  follow_up: { label: 'Follow Up', color: '#ff9800' },
  converted: { label: 'Converted', color: '#05CD99' },
  lost: { label: 'Lost', color: '#EE5D50' },
  on_hold: { label: 'On Hold', color: '#A3AED0' }
};

const LeadManagementPanel = () => {
  const dispatch = useDispatch();

  const { leads, lead, isLeadLoading, pagination } = useSelector((state) => state.lead);

//   const { user } = useSelector((state) => state.auth);
  const { Admin } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState(null);

  useEffect(() => {
    dispatch(getAllLeads({ status: activeTab, search: searchQuery }));
  }, [activeTab, searchQuery, dispatch]);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const openFollowUpModal = (lead) => {
    setSelectedLeadForFollowUp(lead);
    dispatch(getLeadById(lead._id));
    setFollowUpOpen(true);
  };

  const getReferralChip = (lead) => {
    if (lead.createdByModel === 'Customer') {
      return (
        <Chip icon={<WhatsApp />} label={`Referred by ${lead.createdBy.firstName}`} size="small" color="secondary" variant="outlined" />
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8f9fc' }}>
      <Typography variant="h4" fontWeight={800} mb={1}>
        Lead Command Center
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Track, follow up, and convert fiber prospects
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search by name, phone, or area..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
        sx={{ mb: 3, maxWidth: 600 }}
      />

      {/* Tabs */}
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = leads.filter((l) => l.status === key).length;
            return (
              <Tab
                key={key}
                value={key}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: config.color
                      }}
                    />
                    <Typography>{config.label}</Typography>
                    <Badge badgeContent={count} color="primary" />
                  </Stack>
                }
              />
            );
          })}
        </Tabs>

        {/* Lead List */}
        <List>
          {isLeadLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : leads.length === 0 ? (
            <Typography textAlign="center" py={8} color="text.secondary">
              No leads in this category
            </Typography>
          ) : (
            leads.map((leadItem, idx) => (
              <React.Fragment key={leadItem._id}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Call">
                        <IconButton>
                          <Phone />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="WhatsApp">
                        <IconButton color="success">
                          <WhatsApp />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add Follow-up">
                        <IconButton onClick={() => openFollowUpModal(leadItem)} color="primary">
                          <NoteAdd />
                        </IconButton>
                      </Tooltip>
                      {/* {leadItem.status !== 'converted' && Admin?.role === 'admin' && ( */}
                        <Tooltip title="Convert to Customer">
                          <IconButton color="success">
                            <PersonAdd />
                          </IconButton>
                        </Tooltip>
                      {/* )} */}
                    </Stack>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: statusConfig[leadItem.status].color + '22',
                        color: statusConfig[leadItem.status].color
                      }}
                    >
                      {leadItem.name[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="h6" fontWeight={700}>
                          {leadItem.name}
                        </Typography>
                        {getReferralChip(leadItem)}
                        <Chip label={dayjs(leadItem.createdAt).fromNow()} size="small" />
                        {leadItem.followUps?.length > 0 && (
                          <Chip label={`${leadItem.followUps.length} follow-ups`} color="info" size="small" />
                        )}
                      </Stack>
                    }
                    secondary={
                      <Stack spacing={1} mt={1}>
                        <Stack direction="row" spacing={3}>
                          <Stack direction="row" spacing={0.5}>
                            <Phone fontSize="small" />
                            <Typography variant="body2">{leadItem.phone}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5}>
                            <LocationOn fontSize="small" />
                            <Typography variant="body2">{leadItem.area?.name}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5}>
                            <CalendarMonth fontSize="small" />
                            <Typography variant="body2">{dayjs(leadItem.createdAt).format('DD MMM YYYY')}</Typography>
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

      {/* Follow-up Modal */}
      <FollowUpModal open={followUpOpen} onClose={() => setFollowUpOpen(false)} lead={lead} />
    </Box>
  );
};

export default LeadManagementPanel;
