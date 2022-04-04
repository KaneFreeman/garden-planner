import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  AppBar,
  Badge,
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
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import './Actions.css';
import Actions from './Actions';
import useTasks from './hooks/useTasks';

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

  const { overdue, current } = useTasks();

  const {
    taskCount,
    taskColor
  }: { taskCount: number; taskColor: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning' } =
    useMemo(() => {
      if (overdue.length > 0) {
        return { taskCount: overdue.length, taskColor: 'error' };
      }

      if (current.length > 0) {
        return { taskCount: current.length, taskColor: 'primary' };
      }

      return { taskCount: 0, taskColor: 'default' };
    }, [current.length, overdue.length]);

  return (
    <AppBar position="fixed" sx={{ top: 0 }}>
      <Toolbar>
        <IconButton aria-label="menu" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List disablePadding>
              <ListItem
                button
                key="Tasks"
                selected={pathname === '/' || pathname.startsWith('/task')}
                onClick={() => navigate('/')}
              >
                <ListItemIcon>
                  <Badge badgeContent={taskCount} color={taskColor}>
                    <TaskAltIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Tasks" />
              </ListItem>
              <ListItem
                button
                key="Containers"
                selected={pathname === '/containers' || pathname.startsWith('/container')}
                onClick={() => navigate('/containers')}
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
