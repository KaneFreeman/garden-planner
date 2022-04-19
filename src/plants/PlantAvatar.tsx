import React from 'react';
import Avatar from '@mui/material/Avatar';
import { SxProps, Theme } from '@mui/material/styles';
import GrassIcon from '@mui/icons-material/Grass';
import { Plant } from '../interface';

interface PlantAvatarProperties {
  plant?: Plant;
  size?: number;
  variant?: 'square' | 'circular' | 'rounded' | undefined;
  sx?: SxProps<Theme> | undefined;
}

const PlantAvatar = React.memo(({ plant, size = 40, variant, sx }: PlantAvatarProperties) => {
  if (!plant) {
    return (
      <Avatar variant={variant} alt="Empty" sx={{ width: size, height: size, ...sx }}>
        <GrassIcon />
      </Avatar>
    );
  }

  if (!plant.pictures || plant.pictures.length === 0) {
    return (
      <Avatar variant={variant} alt={plant.name} sx={{ width: size, height: size, ...sx }}>
        <GrassIcon color="primary" />
      </Avatar>
    );
  }

  return (
    <Avatar
      variant={variant}
      src={plant.pictures[0].thumbnail}
      alt={plant.name}
      sx={{ width: size, height: size, ...sx }}
    />
  );
});

export default PlantAvatar;
