import React, { useCallback } from 'react';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import GrassIcon from '@mui/icons-material/Grass';
import ContainerModal from './containers/ContainerModal';
import PlantModal from './plants/PlantModal';
import './Actions.css';

const Actions = () => {
  const [modalOpen, setModalOpen] = React.useState<'container' | 'plant' | null>(null);
  const [open, setOpen] = React.useState(false);

  const openContainerModal = useCallback(() => {
    setModalOpen('container');
    setOpen(false);
  }, []);

  const openPlantModal = useCallback(() => {
    setModalOpen('plant');
    setOpen(false);
  }, []);

  const closeModals = useCallback(() => {
    setModalOpen(null);
    setOpen(false);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box className="actions">
      <SpeedDial
        classes={{
          root: 'speedDial-root',
          actions: 'speedDial-actions'
        }}
        ariaLabel="Add menu"
        sx={{ position: 'absolute', bottom: 16, right: 8 }}
        icon={<SpeedDialIcon />}
        FabProps={{ size: 'small', onClick: handleOpen }}
        onClose={handleClose}
        open={open}
      >
        <SpeedDialAction
          key="Add plant"
          icon={<GrassIcon />}
          tooltipTitle="Add plant"
          FabProps={{ onClick: openPlantModal }}
        />
        <SpeedDialAction
          key="Add container"
          icon={<InboxIcon />}
          tooltipTitle="Add container"
          FabProps={{ onClick: openContainerModal }}
        />
      </SpeedDial>
      <ContainerModal open={modalOpen === 'container'} onClose={closeModals} />
      <PlantModal open={modalOpen === 'plant'} onClose={closeModals} />
    </Box>
  );
};

export default Actions;
