// src/views/TicketDetail/TicketTabs.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import TicketInfoPanel from './TicketInfoPanel';
import AssignmentHistory from './AssignmentHistory';

const TicketTabs = ({ ticket, currentUser }) => {
  const [tab, setTab] = useState(0);

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 48,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 }
        }}
      >
        <Tab label="Details" />
        <Tab label="Assignment History" />
      </Tabs>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {tab === 0 && <TicketInfoPanel ticket={ticket} currentUser={currentUser} />}
        {tab === 1 && <AssignmentHistory ticket={ticket} />}
      </Box>
    </Paper>
  );
};

export default TicketTabs;
