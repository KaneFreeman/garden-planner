import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Badge, Box, IconButton } from '@mui/material';
import GrassIcon from '@mui/icons-material/Grass';
import PlantAvatar from '../plants/PlantAvatar';
import { Plant, Slot } from '../interface';

interface ContainerSlotProps {
  id: string;
  index: number;
  slot?: Slot;
  plant?: Plant;
}

const ContainerSlotPreview = React.memo(({ id, index, slot, plant }: ContainerSlotProps) => {
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

  return (
    <IconButton
      sx={{ p: 2, width: 80, height: 80, border: '2px solid #2c2c2c', borderRadius: 0 }}
      onClick={() => navigate(`/container/${id}/slot/${index}`)}
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
