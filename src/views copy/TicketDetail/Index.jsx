// src/views/TicketDetail/Index.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  useTheme,
  alpha,
  IconButton,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Assignment, Close as CloseIcon, Autorenew } from '@mui/icons-material';
import dayjs from 'dayjs';
// import Assignment from '@mui/icons-material/History';

import TicketInfoPanel from './TicketInfoPanel';
import AssignmentHistory from './AssignmentHistory';
import CloseTicketModal from './CloseTicketModal';
import PublicCommentSection from './PublicCommentSection';
import PrivateCommentSection from './PrivateCommentSection';
import TicketHeader from './TicketHeader';

// import { motion, AnimatePresence } from 'framer-motion';
import {
  getTicketById,
  getPublicComments,
  addPublicComment,
  addPrivateComment,
  getPrivateComments,
  resolveTicket
} from '../../redux/features/Tickets/TicketSlice';

const PageContainer = ({ children }) => <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>{children}</Box>;

const Index = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { ticketId } = useParams();

  const { ticket, isTicketLoading, publicComments, privateComments } = useSelector((s) => s.ticket);
  const currentUser = useSelector((s) => s.admin.Admin);

  const [activeTab, setActiveTab] = useState(0);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false); // future modal/drawer
  const isClosedOrResolved = ['closed', 'resolved'].includes(ticket?.status?.toLowerCase());

  useEffect(() => {
    if (ticketId) {
      dispatch(getTicketById(ticketId));
      dispatch(getPublicComments(ticketId));
      dispatch(getPrivateComments(ticketId));
    }
  }, [dispatch, ticketId]);

  // Helper to get sophisticated status colors
  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    if (s === 'open') return { color: 'success', label: 'Open' };
    if (s === 'in-progress') return { color: 'warning', label: 'In Progress' };
    if (s === 'escalated') return { color: 'error', label: 'Escalated' };
    if (s === 'closed' || s === 'resolved') return { color: 'info', label: 'Closed' };
    return { color: 'default', label: status || 'Unknown' };
  };
  const statusConfig = getStatusConfig(ticket?.status);

  const handleSendPublic = useCallback(
    (content) => {
      if (!content?.trim() || isClosedOrResolved) return;
      dispatch(addPublicComment({ ticketId, content }));
    },
    [dispatch, ticketId, isClosedOrResolved]
  );

  const handleSendPrivate = useCallback(
    (content) => {
      if (!content?.trim() || isClosedOrResolved) return;
      dispatch(addPrivateComment({ ticketId, content }));
    },
    [dispatch, ticketId, isClosedOrResolved]
  );

  const handleOpenCloseModal = () => setCloseModalOpen(true);
  const handleCloseCloseModal = () => setCloseModalOpen(false);
  const handleReassignClick = () => setReassignOpen(true);

  const handleConfirmCloseTicket = (resolutionNote) => {
    dispatch(resolveTicket({ id: ticketId, data: { resolutionMessage: resolutionNote } }));
    setCloseModalOpen(false);
  };

  if (isTicketLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer>
      {/* HEADER */}
      <TicketHeader
        ticket={ticket}
        onCloseTicket={handleOpenCloseModal}
        onReassign={handleReassignClick}
        isClosedOrResolved={isClosedOrResolved}
      />

      {/* BODY */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                bgcolor: 'background.paper'
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(e, v) => setActiveTab(v)}
                variant="fullWidth"
                sx={{
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '& .MuiTab-root': { fontWeight: 600, fontSize: '0.85rem' }
                }}
              >
                <Tab icon={<Autorenew sx={{ fontSize: 18 }} />} iconPosition="start" label="Ticket Details" />
                <Tab icon={<Assignment sx={{ fontSize: 18 }} />} iconPosition="start" label="Audit Logs" />
              </Tabs>

              <Box sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                <AnimatePresence mode="wait">
                  {activeTab === 0 ? (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TicketInfoPanel ticket={ticket} onCloseClick={handleOpenCloseModal} currentUser={currentUser} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      style={{ padding: '10px' }}
                    >
                      <AssignmentHistory ticket={ticket} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Paper>
          </Grid>

          {/* MIDDLE: Public chat */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <PublicCommentSection
                messages={publicComments || []}
                onSend={handleSendPublic}
                ticket={ticket}
                currentUser={currentUser}
                disabled={isClosedOrResolved}
              />
            </Paper>
          </Grid>

          {/* RIGHT: Private notes */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <PrivateCommentSection
                messages={privateComments || []}
                currentUser={currentUser}
                onSend={handleSendPrivate}
                disabled={isClosedOrResolved}
              />
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      {/* MODALS */}
      <CloseTicketModal open={closeModalOpen} onClose={handleCloseCloseModal} onConfirm={handleConfirmCloseTicket} />
      {/* Future Reassign Drawer/Modal placeholder */}
      {/* <ReassignDrawer open={reassignOpen} onClose={() => setReassignOpen(false)} /> */}
    </PageContainer>
  );
};

export default Index;
