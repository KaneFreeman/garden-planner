import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/Inbox';
import GrassIcon from '@mui/icons-material/Grass';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FilterListIcon from '@mui/icons-material/FilterList';
import { selectFilterPlants, toggleFilterPlants } from './store/slices/plants';
import { useAppDispatch, useAppSelector } from './store/hooks';
import ContainerModal from './containers/ContainerModal';
import PlantModal from './plants/PlantModal';
import TaskModal from './tasks/TaskModal';
import './Actions.css';

const Actions = () => {
  const { pathname } = useLocation();
  const filterPlants = useAppSelector(selectFilterPlants);
  const dispatch = useAppDispatch();

  const [modalOpen, setModalOpen] = useState<'container' | 'plant' | 'task' | null>(null);
  const [open, setOpen] = useState(false);

  const openContainerModal = useCallback(() => {
    setModalOpen('container');
    setOpen(false);
  }, []);

  const openPlantModal = useCallback(() => {
    setModalOpen('plant');
    setOpen(false);
  }, []);

  const openTaskModal = useCallback(() => {
    setModalOpen('task');
    setOpen(false);
  }, []);

  const closeModals = useCallback(() => {
    setModalOpen(null);
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

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
      <Backdrop open={open} sx={{ position: 'fixed', zIndex: 1101 }} />
      <SpeedDial
        classes={{
          root: 'speedDial-root',
          actions: 'speedDial-actions'
        }}
        ariaLabel="Add menu"
        sx={{ position: 'relative', width: 40, height: 36, zIndex: 1102 }}
        icon={<SpeedDialIcon />}
        FabProps={{ size: 'small', onClick: handleOpen }}
        onClose={handleClose}
        open={open}
        direction="down"
      >
        <SpeedDialAction
          key="Add plant"
          icon={<GrassIcon />}
          tooltipTitle="Add plant"
          tooltipOpen
          FabProps={{ onClick: openPlantModal }}
          classes={{
            fab: 'speedDialAction-fab',
            staticTooltipLabel: 'speedDialAction-staticTooltipLabel'
          }}
        />
        <SpeedDialAction
          key="Add container"
          icon={<InboxIcon />}
          tooltipTitle="Add container"
          tooltipOpen
          FabProps={{ onClick: openContainerModal }}
          classes={{
            fab: 'speedDialAction-fab',
            staticTooltipLabel: 'speedDialAction-staticTooltipLabel'
          }}
        />
        <SpeedDialAction
          key="Add task"
          icon={<AddTaskIcon />}
          tooltipTitle="Add task"
          tooltipOpen
          FabProps={{ onClick: openTaskModal }}
          classes={{
            fab: 'speedDialAction-fab',
            staticTooltipLabel: 'speedDialAction-staticTooltipLabel'
          }}
        />
      </SpeedDial>
      <ContainerModal open={modalOpen === 'container'} onClose={closeModals} />
      <PlantModal open={modalOpen === 'plant'} onClose={closeModals} />
      <TaskModal open={modalOpen === 'task'} onClose={closeModals} />
    </Box>
  );
};

export default Actions;
