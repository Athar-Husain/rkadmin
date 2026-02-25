import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  Fade,
  List,
  ListItemText,
  ListItemButton,
  CircularProgress,
  Badge,
  ListItemIcon,
  Stack
} from '@mui/material';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markAsRead, clearBadge } from '../../../../redux/features/Notifications/NotificationSlice';

const iconMap = {
  info: <InfoIcon color="info" />,
  warning: <WarningIcon color="warning" />,
  success: <CheckCircleIcon color="success" />
};

const NotificationSection = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const dispatch = useDispatch();

  const { notifications, isNotificationLoading, hasSeenTray } = useSelector((state) => state.notifications);

  // Logical Badge Count: Only show if tray hasn't been "seen"
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const badgeContent = hasSeenTray ? 0 : unreadCount;

  // useEffect(() => {
  // dispatch(getNotifications());
  // }, [dispatch]);

  const handleToggle = () => {
    setOpen((prev) => {
      if (!prev) dispatch(clearBadge()); // Clear badge when opening
      return !prev;
    });
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const handleRead = (id) => {
    dispatch(markAsRead(id));
  };

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} color="inherit" size="large">
        <Badge badgeContent={badgeContent > 99 ? '99+' : badgeContent} color="error">
          <NotificationsNoneTwoToneIcon />
        </Badge>
      </IconButton>

      <Popper open={open} anchorEl={anchorRef.current} transition placement="bottom-end" disablePortal sx={{ zIndex: 1300 }}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper sx={{ width: 360, maxHeight: 500, overflowY: 'auto', mt: 1, boxShadow: 3 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Typography variant="h6" px={2} pt={2}>
                    Notifications
                  </Typography>

                  {isNotificationLoading && notifications.length === 0 ? (
                    <Box px={2} py={3} display="flex" justifyContent="center">
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <List>
                      {notifications.slice(0, 5).map((n) => (
                        <ListItemButton
                          key={n._id}
                          onClick={() => handleRead(n._id)}
                          sx={{
                            bgcolor: n.isRead ? 'transparent' : 'action.hover',
                            borderLeft: n.isRead ? '4px solid transparent' : '4px solid',
                            borderColor: 'primary.main',
                            py: 1.5
                          }}
                        >
                          <ListItemIcon>{iconMap[n.type] || iconMap.info}</ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography fontWeight={n.isRead ? 400 : 600} variant="subtitle2" noWrap>
                                {n.title}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {n.message}
                              </Typography>
                            }
                          />
                          <Typography variant="caption" sx={{ ml: 1, whiteSpace: 'nowrap' }}>
                            {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}
                          </Typography>
                        </ListItemButton>
                      ))}
                    </List>
                  )}
                  <Box textAlign="center" py={1} borderTop="1px solid" borderColor="divider">
                    <Button component={Link} to="/notifications" size="small" fullWidth onClick={() => setOpen(false)}>
                      View All
                    </Button>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
