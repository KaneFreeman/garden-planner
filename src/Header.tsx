import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
import InboxIcon from '@mui/icons-material/Inbox';
import GrassIcon from '@mui/icons-material/Grass';
import MenuIcon from '@mui/icons-material/Menu';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import './Actions.css';
import Actions from './Actions';
import { useTasks } from './tasks/useTasks';
import './Header.css';

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
    <AppBar className="app-header" position="fixed" sx={{ top: 0 }}>
      <Toolbar
        classes={{
          root: 'header-toolbar'
        }}
      >
        <IconButton aria-label="menu" onClick={toggleDrawer(true)}>
          <Badge badgeContent={taskCount} color={taskColor}>
            <MenuIcon />
          </Badge>
        </IconButton>
        <SwipeableDrawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
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
        </SwipeableDrawer>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            ml: 1,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}
        >
          Garden Planner
        </Typography>
        <Actions />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
