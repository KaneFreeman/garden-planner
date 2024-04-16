import AddTaskIcon from '@mui/icons-material/AddTask';
import FilterListIcon from '@mui/icons-material/FilterList';
import GrassIcon from '@mui/icons-material/Grass';
import InboxIcon from '@mui/icons-material/Inbox';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Actions.css';
import ContainerModal from '../containers/ContainerModal';
import PlantModal from '../plants/PlantModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectFilterPlants, toggleFilterPlants } from '../store/slices/plants';
import TaskModal from '../tasks/TaskModal';

const Actions = () => {
  const { pathname } = useLocation();
  const filterPlants = useAppSelector(selectFilterPlants);
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [modalOpen, setModalOpen] = useState<'container' | 'plant' | 'task' | null>(null);

  const openContainerModal = useCallback(() => {
    setModalOpen('container');
    handleClose();
  }, []);

  const openPlantModal = useCallback(() => {
    setModalOpen('plant');
    handleClose();
  }, []);

  const openTaskModal = useCallback(() => {
    setModalOpen('task');
    handleClose();
  }, []);

  const closeModals = useCallback(() => {
    setModalOpen(null);
    handleClose();
  }, []);

  return (
    <Box className="actions" sx={{ display: 'flex', gap: 2 }}>
      {pathname === '/plants' ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            aria-label="delete"
            size="small"
            sx={{ ml: 1 }}
            onClick={() => dispatch(toggleFilterPlants())}
            title="Delete comment"
            color={filterPlants ? 'secondary' : 'default'}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : null}
      <IconButton
        id="add-menu-button"
        aria-label="add menu"
        aria-controls={open ? 'add-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
        sx={{ width: '50px' }}
      >
        <SpeedDialIcon sx={{ transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.333s' }} />
      </IconButton>
      <Menu
        id="add-menu"
        aria-labelledby="add-menu-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={openPlantModal}>
          <ListItemIcon>
            <GrassIcon />
          </ListItemIcon>
          <ListItemText>Add plant</ListItemText>
        </MenuItem>
        <MenuItem onClick={openContainerModal}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText>Add container</ListItemText>
        </MenuItem>
        <MenuItem onClick={openTaskModal}>
          <ListItemIcon>
            <AddTaskIcon />
          </ListItemIcon>
          <ListItemText>Add task</ListItemText>
        </MenuItem>
      </Menu>
      <ContainerModal open={modalOpen === 'container'} onClose={closeModals} />
      <PlantModal open={modalOpen === 'plant'} onClose={closeModals} />
      <TaskModal open={modalOpen === 'task'} onClose={closeModals} />
    </Box>
  );
};

export default Actions;
