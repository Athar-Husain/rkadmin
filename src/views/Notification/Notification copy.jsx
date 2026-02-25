import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getNotifications, markAsRead, deleteNotification } from '../../../features/notifications/notificationSlice';
import { getNotifications, markAsRead, deleteNotification } from '../../redux/features/Notifications/NotificationSlice';
import { List, ListItem, ListItemIcon, ListItemText, Typography, Box, CircularProgress, Paper, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { formatDistanceToNow } from 'date-fns';

const iconMap = {
  info: <InfoIcon color="info" />,
  warning: <WarningIcon color="warning" />,
  success: <CheckCircleIcon color="success" />
};

export default function Notifications() {
  const dispatch = useDispatch();
  const { notifications, isNotificationLoading, isNotificationError, notificationMessage } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleRead = (id) => dispatch(markAsRead(id));
  const handleDelete = (e, id) => {
    e.stopPropagation(); // Prevents marking as read when clicking delete
    dispatch(deleteNotification(id));
  };

  if (isNotificationLoading && notifications.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4, px: 2 }}>
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Typography variant="h5" sx={{ p: 3, bgcolor: 'background.paper', fontWeight: 'bold' }}>
          Your Notifications
        </Typography>

        {isNotificationError && (
          <Typography color="error" sx={{ px: 3, pb: 2 }}>
            {notificationMessage}
          </Typography>
        )}

        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <Box py={10} textAlign="center">
              <Typography color="text.secondary">No notifications to show</Typography>
            </Box>
          ) : (
            notifications.map((n) => (
              <ListItem
                key={n._id}
                onClick={() => handleRead(n._id)}
                secondaryAction={
                  <Tooltip title="Delete">
                    <IconButton edge="end" onClick={(e) => handleDelete(e, n._id)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{
                  cursor: 'pointer',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: n.isRead ? 'transparent' : 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                  transition: '0.2s',
                  px: 3,
                  py: 2
                }}
              >
                <ListItemIcon sx={{ minWidth: 45 }}>{iconMap[n.type] || iconMap.info}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={n.isRead ? 500 : 700}>
                      {n.title}
                    </Typography>
                  }
                  secondary={
                    <Box component="span" sx={{ display: 'block' }}>
                      <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}
                      </Typography>
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
