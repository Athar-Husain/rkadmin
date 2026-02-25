import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Fade,
  Button,
  ClickAwayListener,
  Paper,
  Popper,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton
} from '@mui/material';
import {
  PersonTwoTone as ProfileIcon,
  DraftsTwoTone as MessagesIcon,
  LockOpenTwoTone as LockIcon,
  SettingsTwoTone as SettingsIcon,
  AccountCircleTwoTone as AvatarIcon,
  MeetingRoomTwoTone as LogoutIcon
} from '@mui/icons-material';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { AdminLogout } from '../redux/features/Admin/adminSlice';
import { AdminLogout } from '../../../../redux/features/Admin/adminSlice';

const ProfileSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const handleLogout = () => {
    setOpen(false);

    dispatch(AdminLogout());
    // TODO: Clear auth tokens, user context, etc.
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Settings',
      icon: <SettingsIcon />,
      to: '/settings' // Add this route if not created yet
    },
    {
      label: 'Profile',
      icon: <ProfileIcon />,
      to: '/profile'
    },
    {
      label: 'My Messages',
      icon: <MessagesIcon />,
      to: '/messages' // Placeholder
    },
    {
      label: 'Lock Screen',
      icon: <LockIcon />,
      to: '/lock' // Placeholder
    }
  ];

  return (
    <>
      <Button
        sx={{ minWidth: { sm: 50, xs: 35 } }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="inherit"
      >
        <AvatarIcon sx={{ fontSize: '1.5rem' }} />
      </Button>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        modifiers={[
          { name: 'offset', options: { offset: [0, 10] } },
          { name: 'preventOverflow', options: { altAxis: true } }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    minWidth: 250,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '10px'
                  }}
                >
                  {menuItems.map((item, index) => (
                    <ListItemButton
                      key={item.label}
                      component={Link}
                      to={item.to}
                      onClick={(e) => {
                        handleClose(e);
                        setSelectedIndex(index);
                      }}
                      selected={selectedIndex === index}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ))}

                  {/* Logout Button */}
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
