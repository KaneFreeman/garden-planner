import GrassIcon from '@mui/icons-material/Grass';
import InboxIcon from '@mui/icons-material/Inbox';
import MenuIcon from '@mui/icons-material/Menu';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { ListItemButton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Actions from './Actions';
import './Actions.css';
import './Header.css';
import { useTasks } from './tasks/hooks/useTasks';

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const { overdue, thisWeek, active } = useTasks();

  const {
    taskCount,
    taskColor
  }: { taskCount: number; taskColor: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning' } =
    useMemo(() => {
      if (overdue.length > 0) {
        return { taskCount: overdue.length, taskColor: 'error' };
      }

      if (thisWeek.length > 0) {
        return { taskCount: thisWeek.length, taskColor: 'warning' };
      }

      if (active.length > 0) {
        return { taskCount: active.length, taskColor: 'primary' };
      }

      return { taskCount: 0, taskColor: 'default' };
    }, [active.length, thisWeek.length, overdue.length]);

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
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List disablePadding>
              <ListItemButton
                key="Tasks"
                component="div"
                selected={pathname === '/' || pathname.startsWith('/task')}
                onClick={() => navigate('/')}
              >
                <ListItemIcon>
                  <Badge badgeContent={taskCount} color={taskColor}>
                    <TaskAltIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Tasks" />
              </ListItemButton>
              <ListItemButton
                key="Containers"
                component="div"
                selected={pathname === '/containers' || pathname.startsWith('/container')}
                onClick={() => navigate('/containers')}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Containers" />
              </ListItemButton>
              <ListItemButton
                key="Plants"
                component="div"
                selected={pathname === '/plants' || pathname.startsWith('/plant')}
                onClick={() => navigate('/plants')}
              >
                <ListItemIcon>
                  <GrassIcon />
                </ListItemIcon>
                <ListItemText primary="Plants" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
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
