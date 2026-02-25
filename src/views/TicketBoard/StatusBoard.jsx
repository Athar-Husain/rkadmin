import React, { useMemo } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Box, Typography, Stack, Chip, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import InboxIcon from '@mui/icons-material/Inbox';
import TicketCard from './TicketCard';

/* ===============================
   SAFE STATUS COLOR RESOLVER
================================ */
const getStatusColor = (status, palette) => {
  switch (status) {
    case 'Open':
      return palette?.info?.main || '#0288d1';
    case 'In Progress':
      return palette?.warning?.main || '#ed6c02';
    case 'Escalated':
      return palette?.error?.main || '#d32f2f';
    case 'Closed':
      return palette?.success?.main || '#2e7d32';
    default:
      return palette?.grey?.[500] || '#9e9e9e';
  }
};

const StatusBoard = ({ tickets = [], statuses = [] }) => {
  const theme = useTheme();

  /* ===============================
     SAFE COLORS (NO UNDEFINED)
  ================================ */
  const grey300 = theme?.palette?.grey?.[300] || '#e0e0e0';
  const grey400 = theme?.palette?.grey?.[400] || '#bdbdbd';
  const divider = theme?.palette?.divider || 'rgba(0,0,0,0.12)';

  const ticketsByStatus = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = tickets.filter((t) => t.status === status);
      return acc;
    }, {});
  }, [tickets, statuses]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        height: 'calc(100vh - 200px)',
        overflowX: 'auto',
        pb: 2,
        px: 1,
        alignItems: 'flex-start',
        '&::-webkit-scrollbar': { height: 8 },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: alpha(grey400, 0.5),
          borderRadius: 4
        }
      }}
    >
      {statuses.map((status) => {
        const columnColor = getStatusColor(status, theme.palette);
        const columnTickets = ticketsByStatus[status] || [];

        return (
          <Droppable key={status} droppableId={status}>
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  width: 300,
                  minWidth: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '100%',
                  borderRadius: 3,
                  bgcolor: snapshot.isDraggingOver ? alpha(columnColor, 0.05) : '#F8FAFC',
                  border: `1px solid ${snapshot.isDraggingOver ? columnColor : alpha(divider, 0.4)}`,
                  transition: 'all 0.2s ease',
                  boxShadow: snapshot.isDraggingOver ? `0 0 15px ${alpha(columnColor, 0.15)}` : 'none'
                }}
              >
                {/* HEADER */}
                <Box
                  sx={{
                    p: 2,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    borderTop: `4px solid ${columnColor}`,
                    bgcolor: '#F8FAFC',
                    borderBottom: `1px solid ${alpha(divider, 0.4)}`
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
                      {status.toUpperCase()}
                    </Typography>
                    <Chip
                      label={columnTickets.length}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: alpha(columnColor, 0.1),
                        color: columnColor,
                        border: `1px solid ${alpha(columnColor, 0.25)}`
                      }}
                    />
                  </Stack>
                </Box>

                {/* BODY */}
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 1.5,
                    minHeight: 150,
                    '&::-webkit-scrollbar': { width: 5 },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: alpha(grey300, 0.8),
                      borderRadius: 3
                    }
                  }}
                >
                  {columnTickets.length === 0 ? (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: 100, opacity: 0.4 }}>
                      <InboxIcon fontSize="large" />
                      <Typography variant="caption" fontWeight={700}>
                        Drop here
                      </Typography>
                    </Stack>
                  ) : (
                    columnTickets.map((ticket, idx) => (
                      <Draggable key={ticket._id} draggableId={ticket._id} index={idx}>
                        {(dragProvided, dragSnapshot) => (
                          <Box
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            sx={{
                              mb: 1.5,
                              transform: dragSnapshot.isDragging ? 'rotate(2deg) scale(1.02)' : 'none',
                              transition: 'transform 0.1s',
                              zIndex: dragSnapshot.isDragging ? 100 : 1
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

export default StatusBoard;
