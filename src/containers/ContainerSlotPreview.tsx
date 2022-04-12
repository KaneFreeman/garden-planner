import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import GrassIcon from '@mui/icons-material/Grass';
import PlantAvatar from '../plants/PlantAvatar';
import { Container, Plant, Slot } from '../interface';
import getSlotTitle from '../utility/slot.util';

interface ContainerSlotProps {
  id: string;
  index: number;
  container: Container;
  slot?: Slot;
  plant?: Plant;
}

const ContainerSlotPreview = React.memo(({ id, index, container, slot, plant }: ContainerSlotProps) => {
  const navigate = useNavigate();

  const badgeColor = useMemo(() => {
    if (!plant) {
      return 'default';
    }

    if (slot?.status === 'Planted') {
      return 'success';
    }

    if (slot?.status === 'Transplanted') {
      return 'error';
    }

    return 'primary';
  }, [plant, slot?.status]);

  const title = useMemo(() => {
    let slotTitle = `${getSlotTitle(index, container.rows)}`;
    if (!slot || slot.status === 'Not Planted') {
      return `${slotTitle} - Not Planted`;
    }

    if (plant) {
      slotTitle += ` - ${plant.name}`;
    }

    if (slot.status === 'Planted') {
      slotTitle += ` - Planted`;
      if (slot.plantedDate) {
        slotTitle += ` on ${slot.plantedDate}`;
      }
    } else if (slot.status === 'Transplanted') {
      slotTitle += ` - Transplanted`;
      if (slot.transplantedDate) {
        slotTitle += ` on ${slot.transplantedDate}`;
      }
    }

    return slotTitle;
  }, [container.rows, index, plant, slot]);

  return (
    <IconButton
      sx={{ p: 2, width: 80, height: 80, border: '2px solid #2c2c2c', borderRadius: 0 }}
      onClick={() => navigate(`/container/${id}/slot/${index}`)}
      title={title}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Badge
          badgeContent=" "
          color={badgeColor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <Box sx={{ width: 52, height: 52, display: 'flex', boxSizing: 'border-box' }} />
        </Badge>
      </Box>
      {plant ? <PlantAvatar plant={plant} size={76} variant="square" /> : <GrassIcon color="disabled" />}
    </IconButton>
  );
});

export default ContainerSlotPreview;
