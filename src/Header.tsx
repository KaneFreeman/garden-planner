import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import GrassIcon from '@mui/icons-material/Grass';
import InboxIcon from '@mui/icons-material/Inbox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Actions from './Actions';
import './Actions.css';
import './Header.css';
import GardenModal from './gardens/GardenModal';
import { Garden } from './interface';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectGardens, selectSelectedGarden, setSelectedGarden } from './store/slices/gardens';
import { useTasks } from './tasks/hooks/useTasks';

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const dispatch = useAppDispatch();
  const garden = useAppSelector(selectSelectedGarden);
  const gardens = useAppSelector(selectGardens);
  const [gardenMenuAnchorEl, setGardenMenuAnchorEl] = useState<null | HTMLElement>(null);
  const gardenMenuOpen = Boolean(gardenMenuAnchorEl);
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setGardenMenuAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setGardenMenuAnchorEl(null);
  }, []);

  const [gardenModalOpen, setGardenModalOpen] = useState(false);
  const handleGardenModalOpen = useCallback(() => {
    handleClose();
    setGardenModalOpen(true);
  }, [handleClose]);
  const handleGardenModalClose = useCallback(() => {
    setGardenModalOpen(false);
  }, []);
  const handleGardenClick = useCallback(
    (g: Garden) => () => {
      dispatch(setSelectedGarden(g._id));
      handleClose();
    },
    [dispatch, handleClose]
  );

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
        <Button
          id="garden-button"
          aria-controls={gardenMenuOpen ? 'garden-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={gardenMenuOpen ? 'true' : undefined}
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            ml: 1.5,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            color: 'text.primary',
            textTransform: 'unset',
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontWeight: 500,
            fontSize: '1.25rem',
            px: 1.5,
            py: 0.5
          }}
        >
          {garden?.name ?? 'Garden Planner'}
        </Button>
        <Menu
          id="garden-menu"
          anchorEl={gardenMenuAnchorEl}
          open={gardenMenuOpen}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'garden-button'
          }}
        >
          {(gardens ?? []).map((g) => (
            <MenuItem key={g._id} onClick={g._id === garden?._id ? undefined : handleGardenClick(g)}>
              {g._id === garden?._id ? (
                <ListItemIcon>
                  <CheckIcon fontSize="small" />
                </ListItemIcon>
              ) : null}
              <ListItemText inset={g._id !== garden?._id}>{g.name}</ListItemText>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={handleGardenModalOpen}>
            <ListItemIcon>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Garden</ListItemText>
          </MenuItem>
        </Menu>
        <Box sx={{ flexGrow: 1 }} />
        <Actions />
        <GardenModal open={gardenModalOpen} onClose={handleGardenModalClose} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
