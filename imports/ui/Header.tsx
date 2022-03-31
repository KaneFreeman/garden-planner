import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import GrassIcon from '@mui/icons-material/Grass';
import MenuIcon from '@mui/icons-material/Menu';
import './Actions.css';
import Actions from './Actions';

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = useCallback(
    (newDrawerOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDrawerOpen(newDrawerOpen);
    },
    []
  );

  return (
    <AppBar position="sticky" sx={{ top: -1 }}>
      <Toolbar>
        <IconButton aria-label="menu" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List disablePadding>
              <ListItem
                button
                key="Containers"
                selected={pathname === '/' || pathname.startsWith('/container')}
                onClick={() => navigate('/')}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Containers" />
              </ListItem>
              <ListItem
                button
                key="Plants"
                selected={pathname === '/plants' || pathname.startsWith('/plant')}
                onClick={() => navigate('/plants')}
              >
                <ListItemIcon>
                  <GrassIcon />
                </ListItemIcon>
                <ListItemText primary="Plants" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
          Garden Planner
        </Typography>
        <Actions />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
