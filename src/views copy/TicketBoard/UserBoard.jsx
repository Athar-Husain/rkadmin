import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, MenuItem, Select, Stack, Avatar, useTheme, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import InboxIcon from '@mui/icons-material/Inbox';
import TicketCard from './TicketCard';

const STATUS_OPTIONS = ['All', 'Open', 'Escalated', 'In Progress', 'Closed'];

const UserBoard = ({ users = [], tickets = [], selectedUserId }) => {
  const [statusFilter, setStatusFilter] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();

  /* ✅ SAFE COLORS */
  const primaryMain = theme?.palette?.primary?.main || '#1976d2';
  const grey300 = theme?.palette?.grey?.[300] || '#e0e0e0';
  const grey400 = theme?.palette?.grey?.[400] || '#bdbdbd';

  const getUserTickets = (userId) => tickets.filter((t) => t.assignedTo?._id === userId);

  const handleTicketClick = (ticketId) => {
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2.5,
        height: 'calc(100vh - 180px)', // Adjusted to fit within viewport
        pb: 2,
        overflowX: 'auto',
        alignItems: 'flex-start',
        '&::-webkit-scrollbar': { height: 8 },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: alpha(grey400, 0.5),
          borderRadius: 4
        }
      }}
    >
      {users.map((user) => {
        const userTicketsRaw = getUserTickets(user._id);
        const userTickets = userTicketsRaw.filter((t) =>
          !statusFilter[user._id] || statusFilter[user._id] === 'All' ? true : t.status === statusFilter[user._id]
        );

        const isDimmed = selectedUserId && selectedUserId !== user._id;

        return (
          <Droppable droppableId={user._id} key={user._id}>
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  width: 320,
                  minWidth: 320,
                  height: '100%', // Fixed height for the column
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: snapshot.isDraggingOver ? alpha(primaryMain, 0.04) : '#F8FAFC',
                  borderRadius: 4,
                  transition: 'all 0.2s ease',
                  opacity: isDimmed ? 0.4 : 1,
                  filter: isDimmed ? 'grayscale(0.5)' : 'none',
                  border: `1px solid ${snapshot.isDraggingOver ? primaryMain : alpha(grey300, 0.5)}`,
                  overflow: 'hidden' // Important for sticky children
                }}
              >
                {/* 📌 STICKY HEADER SECTION */}
                <Box
                  sx={{
                    p: 2,
                    zIndex: 2,
                    position: 'sticky',
                    top: 0,
                    bgcolor: snapshot.isDraggingOver ? alpha('#F8FAFC', 0.8) : '#F8FAFC',
                    backdropFilter: 'blur(8px)', // Modern glass effect
                    borderBottom: `1px solid ${alpha(grey300, 0.5)}`
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        bgcolor: primaryMain,
                        boxShadow: `0 2px 4px ${alpha(primaryMain, 0.3)}`
                      }}
                    >
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </Avatar>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={800} noWrap sx={{ color: 'text.primary' }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {userTickets.length} Tickets
                      </Typography>
                    </Box>

                    <Select
                      size="small"
                      value={statusFilter[user._id] || 'All'}
                      onChange={(e) =>
                        setStatusFilter((prev) => ({
                          ...prev,
                          [user._id]: e.target.value
                        }))
                      }
                      variant="standard"
                      disableUnderline
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: primaryMain,
                        bgcolor: alpha(primaryMain, 0.1),
                        px: 1,
                        py: 0.2,
                        borderRadius: 1,
                        '& .MuiSelect-select': { py: 0 }
                      }}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status} value={status} sx={{ fontSize: '0.75rem' }}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Box>

                {/* 📜 SCROLLABLE TICKETS AREA */}
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    px: 1.5,
                    pt: 2,
                    pb: 2,
                    '&::-webkit-scrollbar': { width: 4 },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: alpha(grey300, 0.8),
                      borderRadius: 2
                    }
                  }}
                >
                  {userTickets.length === 0 ? (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', opacity: 0.4 }}>
                      <InboxIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        Empty Queue
                      </Typography>
                    </Stack>
                  ) : (
                    userTickets.map((ticket, index) => (
                      <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <Box
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            onDoubleClick={() => handleTicketClick(ticket._id)}
                            sx={{
                              mb: 1.5,
                              cursor: 'pointer',
                              transform: dragSnapshot.isDragging ? 'rotate(3deg) scale(1.02)' : 'none',
                              transition: 'transform 0.1s ease'
                            }}
                          >
                            <TicketCard ticket={ticket} />
                          </Box>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </Box>
              </Box>
            )}
          </Droppable>
        );
      })}
    </Box>
  );
};

export default UserBoard;
