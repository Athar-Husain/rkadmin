import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  Stack,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Chip
} from '@mui/material';
import {
  PersonTwoTone as PersonIcon,
  PhoneTwoTone as PhoneIcon,
  LocationOnTwoTone as LocationIcon,
  CalendarMonthTwoTone as EventIcon,
  WhatsApp as WhatsAppIcon,
  SearchTwoTone as SearchIcon,
  FilterListTwoTone as FilterIcon,
  TrendingUpTwoTone as GrowthIcon,
  PhoneForwardedTwoTone as CallActionIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// --- STYLING CONSTANTS ---
const colors = {
  new: '#4318FF', // Deep Blue
  contacted: '#2196f3', // Info Blue
  follow_up: '#ff9800', // Warning Orange
  converted: '#05CD99', // Success Green
  lost: '#EE5D50', // Error Red
  on_hold: '#A3AED0' // Neutral Grey
};

const leadData = {
  total: 10,
  new: [
    { name: 'Kavita Nair', phone: '9876543208', area: 'Panduranga', date: '2025-11-27' },
    { name: 'Rahul Sharma', phone: '9876543201', area: 'Cowl Bazaar', date: '2025-11-26' }
  ],
  contacted: [
    { name: 'Ravi Verma', phone: '9876543207', area: 'Infantry Road', date: '2025-12-24' },
    { name: 'Priya Patel', phone: '9876543202', area: 'Infantry Road', date: '2025-11-24' }
  ],
  follow_up: [
    { name: 'Meena Gupta', phone: '9876543210', area: 'Select talkies', date: '2025-12-23' },
    { name: 'Amit Kumar', phone: '9876543203', area: 'Belgal cross', date: '2025-11-22' }
  ],
  converted: [{ name: 'Sneha Reddy', phone: '9876543204', area: 'Panduranga', date: '2025-12-12' }],
  lost: [
    { name: 'Vikram Singh', phone: '9876543205', area: 'Select talkies', date: '2025-11-07' },
    { name: 'Suresh Joshi', phone: '9876543209', area: 'Belgal cross', date: '2025-10-28' }
  ],
  on_hold: [{ name: 'Anita Desai', phone: '9876543206', area: 'Cowl Bazaar', date: '2025-11-20' }]
};

const statusLabels = {
  new: 'Fresh Leads',
  contacted: 'Engaged',
  follow_up: 'Follow-Up',
  converted: 'Won',
  lost: 'Closed',
  on_hold: 'Deferred'
};

function LeadDashboard() {
  const [activeTab, setActiveTab] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // --- FILTERED DATA LOGIC ---
  const filteredLeads = useMemo(() => {
    const leads = leadData[activeTab] || [];
    if (!searchQuery) return leads;
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.area.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery]);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  // --- UI COMPONENTS ---
  const KPISection = () => (
    <Grid container spacing={2} mb={4}>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: '#4318FF',
            color: '#fff',
            boxShadow: '0px 18px 40px rgba(67, 24, 255, 0.2)'
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700 }}>
                TOTAL PIPELINE
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {leadData.total}
              </Typography>
            </Box>
            <GrowthIcon sx={{ fontSize: 40, opacity: 0.3 }} />
          </Stack>
        </Card>
      </Grid>
      {['new', 'follow_up', 'converted'].map((key) => (
        <Grid size={{ xs: 4, md: 3 }} key={key}>
          <Card sx={{ p: 2, borderRadius: 4, textAlign: 'center', border: '1px solid #E9EDF7', boxShadow: 'none' }}>
            <Typography variant="caption" color="textSecondary" fontWeight={700}>
              {statusLabels[key].toUpperCase()}
            </Typography>
            <Typography variant="h5" fontWeight={900} color={colors[key]}>
              {leadData[key]?.length || 0}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ p: isMobile ? 2 : 4, bgcolor: '#F4F7FE', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#1B254B">
            Lead Command Center
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and convert your fiber prospects
          </Typography>
        </Box>
      </Stack>

      <KPISection />

      {/* SEARCH & FILTERS */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
        <TextField
          fullWidth
          placeholder="Search by name, phone or area..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="disabled" />
              </InputAdornment>
            ),
            sx: { borderRadius: 4, bgcolor: '#fff', border: 'none' }
          }}
        />
      </Stack>

      <Paper sx={{ borderRadius: 5, overflow: 'hidden', boxShadow: '0px 20px 40px rgba(112, 144, 176, 0.08)', border: 'none' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            pt: 1,
            bgcolor: '#fff',
            borderBottom: '1px solid #F4F7FE',
            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', minWidth: 120 },
            '& .Mui-selected': { color: colors[activeTab] },
            '& .MuiTabs-indicator': { bgcolor: colors[activeTab], height: 3, borderRadius: '3px 3px 0 0' }
          }}
        >
          {Object.entries(statusLabels).map(([key, label]) => (
            <Tab
              key={key}
              value={key}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors[key] }} />
                  <Typography variant="body2">{label}</Typography>
                  <Chip
                    label={leadData[key]?.length || 0}
                    size="small"
                    sx={{ height: 18, fontSize: 10, fontWeight: 900, bgcolor: alpha(colors[key], 0.1), color: colors[key] }}
                  />
                </Stack>
              }
            />
          ))}
        </Tabs>

        <List sx={{ p: 0, bgcolor: '#fff', minHeight: 400 }}>
          {filteredLeads.map((lead, idx) => (
            <React.Fragment key={lead.phone}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 3,
                  px: isMobile ? 2 : 4,
                  transition: '0.2s',
                  '&:hover': { bgcolor: '#F9FAFC' }
                }}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Call Now">
                      <IconButton sx={{ bgcolor: alpha(colors.converted, 0.1), color: colors.converted }}>
                        <CallActionIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="WhatsApp">
                      <IconButton sx={{ bgcolor: alpha('#25D366', 0.1), color: '#25D366' }}>
                        <WhatsAppIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: alpha(colors[activeTab], 0.1),
                      color: colors[activeTab],
                      fontWeight: 800,
                      border: `1px solid ${alpha(colors[activeTab], 0.2)}`
                    }}
                  >
                    {lead.name[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ ml: 2 }}
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6" fontWeight={800} color="#1B254B">
                        {lead.name}
                      </Typography>
                      <Chip label={dayjs(lead.date).fromNow()} size="small" sx={{ fontSize: 10, height: 20, bgcolor: '#F4F7FE' }} />
                    </Stack>
                  }
                  secondary={
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid>
                        <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                          <PhoneIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption" fontWeight={600}>
                            {lead.phone}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid>
                        <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                          <LocationIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption" fontWeight={600}>
                            {lead.area}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid>
                        <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                          <EventIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption" fontWeight={600}>
                            {dayjs(lead.date).format('DD MMM YYYY')}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  }
                />
              </ListItem>
              {idx < filteredLeads.length - 1 && <Divider sx={{ borderColor: '#F4F7FE', mx: 4 }} />}
            </React.Fragment>
          ))}

          {filteredLeads.length === 0 && (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 10, opacity: 0.5 }}>
              <PersonIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" fontWeight={700}>
                No leads found
              </Typography>
              <Typography variant="body2">Try adjusting your search or filters</Typography>
            </Stack>
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default LeadDashboard;
