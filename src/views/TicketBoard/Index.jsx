import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { Box, Skeleton, Drawer, useTheme, Fade, Stack } from '@mui/material';
import dayjs from 'dayjs';

import AddTicket from './AddTicket';
import { getAllTickets, assignTicket, updateTicket, optimisticUpdateTicket } from '../../redux/features/Tickets/TicketSlice';
import { getAllTeamMembers } from '../../redux/features/Team/TeamSlice';
import StatusBoard from './StatusBoard';
import UserBoard from './UserBoard';
import TicketHeader from './TicketHeader';
import TeamList from './TeamList';
import ReassignDialog from './ReassignDialog';

const TicketBoard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { allTickets, isTicketLoading } = useSelector((state) => state.ticket);
  const { teamMembers, isTeamLoading } = useSelector((state) => state.team);

  const [currentView, setCurrentView] = useState('user');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [mobileTeamListOpen, setMobileTeamListOpen] = useState(false);
  const [openAddTicket, setOpenAddTicket] = useState(false);

  const [filters, setFilters] = useState({
    status: '',
    startDate: null,
    endDate: null
  });

  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [pendingReassign, setPendingReassign] = useState(null);

  useEffect(() => {
    dispatch(getAllTickets());
    dispatch(getAllTeamMembers());
  }, [dispatch]);

  const filteredTickets = useMemo(() => {
    return allTickets.filter((ticket) => {
      const matchesStatus = !filters.status || ticket.status === filters.status;
      const matchesUserId = selectedUserId === null || ticket.assignedTo?._id === selectedUserId;
      const createdDate = dayjs(ticket.createdAt);
      const matchesStartDate = !filters.startDate || createdDate.isAfter(dayjs(filters.startDate).startOf('day'));
      const matchesEndDate = !filters.endDate || createdDate.isBefore(dayjs(filters.endDate).endOf('day'));

      return matchesStatus && matchesUserId && matchesStartDate && matchesEndDate;
    });
  }, [allTickets, filters, selectedUserId]);

  const handleOnDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const movedTicket = allTickets.find((t) => t._id === draggableId);
    if (!movedTicket) return;

    if (currentView === 'status') {
      const newStatus = destination.droppableId;
      if (movedTicket.status === newStatus) return;

      dispatch(optimisticUpdateTicket({ ticketId: draggableId, newStatus }));
      dispatch(updateTicket({ id: draggableId, data: { status: newStatus } }));
    } else if (currentView === 'user') {
      const newAssignedTo = destination.droppableId;
      if (movedTicket.assignedTo?._id === newAssignedTo) return;

      const fromUser = movedTicket.assignedTo?.firstName || 'Unassigned';
      const toUser = teamMembers.find((user) => user._id === newAssignedTo)?.firstName;
      const user = teamMembers.find((user) => user._id === newAssignedTo);
      const newAssignedToModel = user?.userType || 'Team';

      setPendingReassign({
        id: draggableId,
        fromUser,
        toUser,
        newAssignedTo,
        newAssignedToModel
      });
      setReassignDialogOpen(true);
    }
  };

  const handleConfirmReassign = async (reason) => {
    if (!pendingReassign) return;
    const { id, newAssignedTo, newAssignedToModel } = pendingReassign;
    dispatch(optimisticUpdateTicket({ ticketId: id, newAssignedTo, newAssignedToModel }));
    await dispatch(assignTicket({ id, data: { newAssignedTo, newAssignedToModel, reason } }));
    setReassignDialogOpen(false);
    setPendingReassign(null);
    dispatch(getAllTickets());
  };

  return (
    <Box sx={{ bgcolor: '#F8FAFC', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {/* Mobile Sidebar */}
        <Drawer
          anchor="left"
          open={mobileTeamListOpen}
          onClose={() => setMobileTeamListOpen(false)}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <TeamList
            users={teamMembers}
            allTickets={allTickets}
            selectedUserId={selectedUserId}
            onSelectUser={(id) => {
              setSelectedUserId((prev) => (prev === id ? null : id));
              setMobileTeamListOpen(false);
            }}
          />
        </Drawer>

        {/* Desktop Sidebar (Resizes automatically) */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, height: '100%' }}>
          <TeamList
            users={teamMembers}
            allTickets={allTickets}
            selectedUserId={selectedUserId}
            onSelectUser={(id) => setSelectedUserId((prev) => (prev === id ? null : id))}
          />
        </Box>

        {/* Main Board Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0, // Critical for horizontal scrolling in flex children
            bgcolor: '#F1F5F9'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            <TicketHeader
              title="Ticket Board"
              currentView={currentView}
              onViewChange={setCurrentView}
              onMobileTeamListToggle={() => setMobileTeamListOpen(true)}
              onFilterChange={setFilters}
              onAddTicketClick={() => setOpenAddTicket(true)}
            />
          </Box>

          {/* Board Content */}
          <Box sx={{ flex: 1, overflowX: 'auto', p: 2 }}>
            {isTeamLoading || isTicketLoading ? (
              <Stack direction="row" spacing={2} sx={{ height: '100%' }}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="rectangular" width={300} height="100%" sx={{ borderRadius: 3 }} />
                ))}
              </Stack>
            ) : (
              <Fade in timeout={400}>
                <Box sx={{ height: '100%', width: '100%' }}>
                  {currentView === 'status' ? (
                    <StatusBoard tickets={filteredTickets} statuses={['Open', 'Escalated', 'In Progress', 'Closed']} />
                  ) : (
                    <UserBoard users={teamMembers} tickets={filteredTickets} selectedUserId={selectedUserId} />
                  )}
                </Box>
              </Fade>
            )}
          </Box>
        </Box>

        <AddTicket open={openAddTicket} handleClose={() => setOpenAddTicket(false)} />
      </DragDropContext>

      <ReassignDialog
        open={reassignDialogOpen}
        onClose={() => setReassignDialogOpen(false)}
        onConfirm={handleConfirmReassign}
        fromUser={pendingReassign?.fromUser}
        toUser={pendingReassign?.toUser}
      />
    </Box>
  );
};

export default TicketBoard;
