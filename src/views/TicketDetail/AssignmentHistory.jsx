import React, { useMemo } from 'react';
import { Box, Typography, Stack, Avatar, Divider, Chip, alpha, useTheme, Tooltip } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const AssignmentHistory = ({ ticket }) => {
  const theme = useTheme();
  const teamMembers = useSelector((s) => s.team.teamMembers || []);
  const admins = useSelector((s) => s.admin?.allAdmins || []);

  const resolvePerson = (id) => {
    if (!id) return { name: 'Unknown', type: '' };
    const t = teamMembers.find((m) => m._id === id);
    if (t) return { name: `${t.firstName} ${t.lastName || ''}`, type: t.userType || 'Team' };
    const a = admins.find((a) => a._id === id);
    if (a) return { name: `${a.firstName} ${a.lastName || ''}`, type: a.userType || 'Admin' };
    if (ticket?.assignedTo?._id === id) return { name: ticket.assignedTo.firstName || id, type: ticket.assignedTo.userType || 'Team' };
    if (ticket?.createdBy?._id === id) return { name: ticket.createdBy.firstName || id, type: ticket.createdBy.userType || 'Admin' };
    return { name: id.toString().slice(0, 8), type: '' };
  };

  const entries = ticket?.assignmentHistory || [];

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));
  }, [entries]);

  if (!entries || entries.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 3 }}>
        <AssignmentIndIcon sx={{ color: 'text.disabled', fontSize: 40, mb: 1 }} />
        <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
          No assignment history
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '500px' }}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} px={1}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, display: 'flex' }}>
            <TimelineIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            Assignment History
          </Typography>
        </Stack>
        <Chip label={entries.length} size="small" sx={{ fontWeight: 900, bgcolor: theme.palette.grey[200], fontSize: '0.7rem' }} />
      </Stack>

      {/* SCROLLABLE TIMELINE CONTAINER */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          pr: 1,
          pl: 0.5,
          /* Custom Scrollbar */
          '&::-webkit-scrollbar': { width: '5px' },
          // '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.grey[400], 0.5), borderRadius: '10px' }
        }}
      >
        {sorted.map((h, index) => {
          const assigned = resolvePerson(h.assignedTo);
          const by = resolvePerson(h.assignedBy);
          const isLast = index === sorted.length - 1;

          return (
            <Box key={h.assignedAt + index} sx={{ display: 'flex', gap: 2, position: 'relative' }}>
              {/* TIMELINE LINE AND DOT */}
              <Stack alignItems="center">
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: index === 0 ? theme.palette.primary.main : theme.palette.background.paper,
                    color: index === 0 ? '#fff' : theme.palette.text.primary,
                    border: `2px solid ${index === 0 ? theme.palette.primary.main : theme.palette.divider}`,
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    zIndex: 2
                  }}
                >
                  {assigned.name?.charAt(0)}
                </Avatar>
                {!isLast && (
                  <Box
                    sx={{
                      width: '2px',
                      flex: 1,
                      bgcolor: theme.palette.divider,
                      my: 0.5,
                      minHeight: '40px'
                    }}
                  />
                )}
              </Stack>

              {/* CONTENT CARD */}
              <Box sx={{ flex: 1, pb: isLast ? 2 : 4 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {assigned.name}
                    {index === 0 && (
                      <Chip label="CURRENT" size="small" color="primary" sx={{ height: 16, fontSize: '0.6rem', ml: 1, fontWeight: 900 }} />
                    )}
                  </Typography>

                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.2 }}>
                    Assigned by <span style={{ fontWeight: 700, color: theme.palette.text.primary }}>{by.name}</span>
                  </Typography>

                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                    {dayjs(h.assignedAt).format('MMM DD, YYYY • hh:mm A')}
                  </Typography>

                  {h.note && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        bgcolor: alpha(theme.palette.grey[100], 0.5),
                        borderRadius: 2,
                        borderLeft: `3px solid ${theme.palette.grey[300]}`
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        TRANSFER NOTE
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontStyle: 'italic' }}>
                        "{h.note}"
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AssignmentHistory;
