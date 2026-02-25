import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { ListItemButton, ListItemIcon, ListItemText, Typography, Chip, Avatar } from '@mui/material';

// Project Import - IMPORT THE CORRECT ACTION FROM YOUR SLICE
import { setMenuOpen } from '../../../../../redux/features/customization/customizationSlice';

// assets
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const customization = useSelector((state) => state.customization);

  // LOGIC FIX: Check if the ID exists within the isOpen array
  const isSelected = customization.isOpen.findIndex((id) => id === item.id) > -1;

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon color="inherit" /> : <ArrowForwardIcon color="inherit" fontSize={level > 0 ? 'inherit' : 'default'} />;

  // Sync active state with URL
  useEffect(() => {
    if (pathname === item.url) {
      dispatch(setMenuOpen(item.id));
    }
  }, [pathname, item.url, item.id, dispatch]);

  const itemHandler = (id) => {
    dispatch(setMenuOpen(id));
  };

  return (
    <ListItemButton
      disabled={item.disabled}
      sx={{
        borderRadius: '5px',
        marginBottom: '5px',
        pl: `${level * 16}px`,
        // Style when active
        '&.Mui-selected': {
          bgcolor: theme.palette.primary.light + '25',
          color: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.primary.light + '40'
          }
        }
      }}
      selected={isSelected} // Use our new logic
      component={Link}
      to={item.url}
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon sx={{ minWidth: 25, color: isSelected ? 'primary.main' : 'inherit' }}>{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography sx={{ pl: 1.4 }} variant={isSelected ? 'subtitle1' : 'body1'} color="inherit">
            {item.title}
          </Typography>
        }
      />
    </ListItemButton>
  );
};

// NavItem.propTypes = {
//   item: PropTypes.object,
//   level: PropTypes.number,
//   icon: PropTypes.object,
//   target: PropTypes.object,
//   url: PropTypes.string,
//   disabled: PropTypes.bool,
//   id: PropTypes.string,
//   title: PropTypes.string,
//   caption: PropTypes.string,
//   chip: PropTypes.object,
//   color: PropTypes.string,
//   label: PropTypes.string,
//   avatar: PropTypes.object
// };

export default NavItem;
