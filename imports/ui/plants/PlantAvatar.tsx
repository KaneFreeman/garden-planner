import React from 'react';
import { Avatar } from '@mui/material';
import GrassIcon from '@mui/icons-material/Grass';
import { Plant } from '../../api/Plants';

interface PlantAvatarProperties {
  plant?: Plant;
  size?: number;
  variant?: "square" | "circular" | "rounded" | undefined;
}

const PlantAvatar = React.memo(({ plant, size = 40, variant }: PlantAvatarProperties) => {
  if (!plant) {
    return null;
  }

  if (!plant.pictures || plant.pictures.length === 0) {
    return (
      <Avatar variant={variant} alt={plant.name} sx={{ width: size, height: size }}>
        <GrassIcon color="primary" />
      </Avatar>
    );
  }

  return (
    <Avatar variant={variant} src={plant.pictures[0].thumbnail ?? plant.pictures[0].dataUrl} alt={plant.name} sx={{ width: size, height: size }} />
  );
});

export default PlantAvatar;
