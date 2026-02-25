import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markAsRead, deleteNotification } from '../../redux/features/Notifications/NotificationSlice';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Button,
  Tabs,
  Tab,
  Badge,
  alpha,
  Stack
} from '@mui/material';

// Icons
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import { formatDistanceToNow } from 'date-fns';

const iconMap = {
  info: <InfoTwoToneIcon sx={{ color: '#0288d1' }} />,
  warning: <WarningTwoToneIcon sx={{ color: '#ed6c02' }} />,
  success: <CheckCircleTwoToneIcon sx={{ color: '#2e7d32' }} />
};

export default function Notifications() {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const { notifications, isNotificationLoading, isNotificationError, notificationMessage } = useSelector((state) => state.notifications);

  // useEffect(() => {
  //   dispatch(getNotifications());
  // }, [dispatch]);

  const handleRead = (id) => dispatch(markAsRead(id));
  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  const handleMarkAllRead = () => {
    // Implement bulk read action in your slice
    // dispatch(markAllAsRead());
    console.log('Mark all read triggered');
  };

  // Filter Logic
  const filteredNotifications = notifications.filter((n) => {
    if (tabValue === 1) return !n.isRead; // Unread
    if (tabValue === 2) return n.type === 'warning'; // Critical
    return true; // All
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isNotificationLoading && notifications.length === 0) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={20}>
        <CircularProgress thickness={5} size={50} sx={{ color: '#4318FF' }} />
        <Typography sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}>Fetching updates...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4, px: { xs: 2, md: 4 }, pb: 8 }}>
      {/* Header & Actions */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#1B254B">
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have {unreadCount} unread messages
          </Typography>
        </Box>
        <Button
          startIcon={<DoneAllIcon />}
          onClick={handleMarkAllRead}
          sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #E0E7FF', overflow: 'hidden', bgcolor: '#fff' }}>
        {/* Navigation Tabs */}
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ px: 2, pt: 1, borderBottom: '1px solid #F1F4F9' }}>
          <Tab label="All" sx={{ fontWeight: 700, textTransform: 'none' }} />
          <Tab
            label={
              <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { right: -10, top: 0 } }}>
                Unread
              </Badge>
            }
            sx={{ fontWeight: 700, textTransform: 'none' }}
          />
          {/* <Tab label="Critical" sx={{ fontWeight: 700, textTransform: 'none' }} /> */}
        </Tabs>

        {isNotificationError && (
          <Box sx={{ m: 2, p: 2, bgcolor: alpha('#ff1744', 0.05), borderRadius: 2, border: '1px solid #ff1744' }}>
            <Typography color="error" variant="body2" textAlign="center">
              {notificationMessage}
            </Typography>
          </Box>
        )}

        <List sx={{ p: 0 }}>
          {filteredNotifications.length === 0 ? (
            <Box py={12} textAlign="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <NotificationsNoneTwoToneIcon sx={{ fontSize: 80, color: '#A3AED0', opacity: 0.5, mb: 2 }} />
              <Typography variant="h6" fontWeight={700} color="#1B254B">
                Peace and quiet!
              </Typography>
              <Typography color="text.secondary">No notifications found in this category.</Typography>
            </Box>
          ) : (
            filteredNotifications.map((n, index) => (
              <ListItem
                key={n._id}
                onClick={() => handleRead(n._id)}
                secondaryAction={
                  <Tooltip title="Remove">
                    <IconButton
                      edge="end"
                      onClick={(e) => handleDelete(e, n._id)}
                      sx={{ '&:hover': { color: 'error.main', bgcolor: alpha('#ff1744', 0.1) } }}
                    >
                      <DeleteTwoToneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{
                  cursor: 'pointer',
                  borderBottom: index !== filteredNotifications.length - 1 ? '1px solid #F1F4F9' : 'none',
                  bgcolor: n.isRead ? 'transparent' : alpha('#4318FF', 0.03),
                  '&:hover': { bgcolor: alpha('#4318FF', 0.06) },
                  transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  px: 3,
                  py: 2.5,
                  position: 'relative'
                }}
              >
                {/* Unread Indicator Dot */}
                {!n.isRead && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#4318FF'
                    }}
                  />
                )}

                <ListItemIcon sx={{ minWidth: 50 }}>
                  <Avatar sx={{ bgcolor: alpha(n.type === 'warning' ? '#ed6c02' : '#4318FF', 0.1), width: 45, height: 45 }}>
                    {iconMap[n.type] || iconMap.info}
                  </Avatar>
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={n.isRead ? 600 : 800} color="#1B254B">
                      {n.title}
                    </Typography>
                  }
                  secondary={
                    <Box component="span">
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                        {n.message}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: '#A3AED0', fontWeight: 600 }}>
                          {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}
                        </Typography>
                        {!n.isRead && (
                          <Chip
                            label="New"
                            size="small"
                            sx={{ height: 16, fontSize: '10px', bgcolor: '#4318FF', color: '#fff', fontWeight: 900 }}
                          />
                        )}
                      </Stack>
                    </Box>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
}

// Helper Avatar component to keep code clean
const Avatar = ({ children, sx }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '12px',
      ...sx
    }}
  >
    {children}
  </Box>
);

const Chip = ({ label, sx }) => <Box sx={{ px: 1, borderRadius: '4px', display: 'flex', alignItems: 'center', ...sx }}>{label}</Box>;
