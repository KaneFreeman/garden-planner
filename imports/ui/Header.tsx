import React, { useCallback } from 'react';
import { Box, Button, IconButton, Popover, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ContainerModal } from './containers/ContainerModal';

export const Header = () => {
  const [modalOpen, setModalOpen] = React.useState<'container' | 'plant' | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const openContainerModal = useCallback(() => {
    setModalOpen('container');
    setAnchorEl(null);
  }, []);

  const openPlantModal = useCallback(() => {
    setModalOpen('plant');
    setAnchorEl(null);
  }, []);

  const closeModals = useCallback(() => {
    setModalOpen(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'add-popover' : undefined;

  return (
    <>
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <Typography variant="h4">Garden Planner</Typography>
        <IconButton aria-label="delete" onClick={handleClick}>
          <AddIcon />
        </IconButton>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
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
        <Typography
          component="div"
          sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}
        >
          <Button variant="text" sx={{ p: 1, cursor: 'pointer', width: '100%' }} onClick={openContainerModal}>
            Add Container
          </Button>
          <Button
            variant="text"
            sx={{
              p: 1,
              cursor: 'pointer',
              width: '100%'
            }}
            onClick={openPlantModal}
          >
            Add Plant
          </Button>
        </Typography>
      </Popover>
      <ContainerModal open={modalOpen === 'container'} onClose={closeModals} />
    </>
  );
};
