import React, { useMemo, useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Box,
  Avatar,
  Chip,
  Stack,
  Tooltip,
  IconButton,
  alpha,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Group as GroupIcon,
  SwapVert as SwapVertIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpwardIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { deepPurple, deepOrange, teal, blueGrey } from '@mui/material/colors';

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [deepPurple[500], deepOrange[500], teal[500], blueGrey[500]];
  return colors[Math.abs(hash) % colors.length];
};

const TeamList = ({ users, allTickets, selectedUserId, onSelectUser }) => {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting States
  const [sortAnchor, setSortAnchor] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const totalTickets = useMemo(() => allTickets.length, [allTickets]);

  const getTicketCount = (userId) => allTickets.filter((t) => t.assignedTo?._id === userId).length;

  // 🧠 Combined Search + Sort Logic
  const filteredAndSortedUsers = useMemo(() => {
    // 1. Filter by Search Query
    let result = users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });

    // 2. Sort the filtered result
    result.sort((a, b) => {
      if (sortConfig.key === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return sortConfig.direction === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }

      if (sortConfig.key === 'tickets') {
        const countA = getTicketCount(a._id);
        const countB = getTicketCount(b._id);
        return sortConfig.direction === 'asc' ? countA - countB : countB - countA;
      }
      return 0;
    });

    return result;
  }, [users, allTickets, sortConfig, searchQuery]);

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
    setSortAnchor(null);
  };

  const SidebarItem = ({ id, label, count, color, icon, isAll = false }) => {
    const isSelected = selectedUserId === id;
    const displayName = label.length > 18 ? `${label.substring(0, 15)}...` : label;

    const content = (
      <ListItemButton
        selected={isSelected}
        onClick={() => {
          onSelectUser(id);
          if (isAll) setSearchQuery(''); // Clear search when clicking "All"
        }}
        sx={{
          px: collapsed ? 1.5 : 2,
          py: 1,
          borderRadius: '12px',
          mb: 0.8,
          mx: 1,
          justifyContent: collapsed ? 'center' : 'flex-start',
          '&.Mui-selected': {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '20%',
              bottom: '20%',
              width: '4px',
              bgcolor: theme.palette.primary.main,
              borderRadius: '0 4px 4px 0'
            }
          }
        }}
      >
        <Stack direction="row" alignItems="center" spacing={collapsed ? 0 : 1.8} sx={{ width: '100%' }}>
          <Avatar sx={{ bgcolor: color, width: 34, height: 34, fontSize: 14, fontWeight: 700 }}>
            {icon ||
              label
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
          </Avatar>

          {!collapsed && (
            <>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 500 }}>
                    {displayName}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {count} Tickets
                  </Typography>
                }
              />
              {count > 0 && <Chip label={count} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />}
            </>
          )}
        </Stack>
      </ListItemButton>
    );

    return collapsed ? (
      <Tooltip title={`${label} (${count})`} placement="right" arrow>
        <Box>{content}</Box>
      </Tooltip>
    ) : (
      content
    );
  };

  return (
    <Box
      sx={{
        width: collapsed ? 80 : 280,
        bgcolor: '#fff',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'width 0.3s ease'
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && (
          <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary' }}>
            Team
          </Typography>
        )}
        <Stack direction="row" spacing={0.5}>
          {!collapsed && (
            <IconButton size="small" onClick={(e) => setSortAnchor(e.currentTarget)}>
              <SortIcon fontSize="small" color={sortConfig.key === 'tickets' ? 'primary' : 'inherit'} />
            </IconButton>
          )}
          <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Stack>
      </Box>

      {/* 🔍 Search Bar Section */}
      <Box sx={{ px: collapsed ? 1.5 : 2, pb: 2 }}>
        {collapsed ? (
          <Tooltip title="Search Team" placement="right">
            <IconButton onClick={() => setCollapsed(false)} sx={{ width: '100%', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <TextField
            fullWidth
            size="small"
            placeholder="Search agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: alpha(theme.palette.grey[100], 0.5),
                fontSize: '0.85rem'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="disabled" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon fontSize="inherit" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        )}
      </Box>

      {/* Sorting Menu */}
      <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={() => setSortAnchor(null)}>
        <MenuItem onClick={() => handleSortChange('name', 'asc')}>
          <ListItemIcon>
            <SortIcon fontSize="small" />
          </ListItemIcon>
          Name (A-Z)
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('name', 'desc')}>
          <ListItemIcon>
            <SortIcon fontSize="small" sx={{ transform: 'rotate(180deg)' }} />
          </ListItemIcon>
          Name (Z-A)
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleSortChange('tickets', 'desc')}>
          <ListItemIcon>
            <SwapVertIcon fontSize="small" />
          </ListItemIcon>
          Most Tickets
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('tickets', 'asc')}>
          <ListItemIcon>
            <ArrowUpwardIcon fontSize="small" />
          </ListItemIcon>
          Least Tickets
        </MenuItem>
      </Menu>

      <Box sx={{ flex: 1, overflowY: 'auto', pt: 1 }}>
        <SidebarItem
          id={null}
          label="All Members"
          count={totalTickets}
          color={theme.palette.primary.main}
          icon={<GroupIcon fontSize="small" />}
          isAll
        />

        {!collapsed && filteredAndSortedUsers.length > 0 && (
          <Typography variant="caption" sx={{ px: 3, py: 1, display: 'block', color: 'text.disabled', fontWeight: 700 }}>
            AGENTS
          </Typography>
        )}

        {filteredAndSortedUsers.map((user) => (
          <SidebarItem
            key={user._id}
            id={user._id}
            label={`${user.firstName} ${user.lastName}`}
            count={getTicketCount(user._id)}
            color={stringToColor(user.firstName + user.lastName)}
          />
        ))}

        {filteredAndSortedUsers.length === 0 && searchQuery && (
          <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', mt: 4, color: 'text.secondary' }}>
            No agents found
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TeamList;
