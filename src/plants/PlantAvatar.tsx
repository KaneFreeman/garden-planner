import { memo, useMemo } from 'react';
import Avatar from '@mui/material/Avatar';
import { SxProps, Theme } from '@mui/material/styles';
import GrassIcon from '@mui/icons-material/Grass';
import { useStatusColor } from '../utility/slot.util';
import { Plant, Slot } from '../interface';

interface PlantAvatarProperties {
  plant?: Plant;
  size?: number;
  variant?: 'square' | 'circular' | 'rounded' | undefined;
  slot?: Slot;
  sx?: SxProps<Theme> | undefined;
  faded?: boolean;
}

const PlantAvatar = memo(({ plant, size = 40, variant, slot, sx, faded = false }: PlantAvatarProperties) => {
  const statusColor = useStatusColor(slot, plant, 'transparent');
  const borderSx: SxProps<Theme> | undefined = useMemo(() => {
    if (slot === undefined || statusColor === 'transparent') {
      return {};
    }

    return {
      border: `3px solid ${statusColor}`
    };
  }, [slot, statusColor]);

  const extraSx: SxProps<Theme> = { opacity: faded ? 0.25 : 1 };

  if (!plant) {
    return (
      <Avatar
        variant={variant}
        alt="Empty"
        sx={{ width: size, height: size, boxSizing: 'border-box', ...borderSx, ...extraSx, ...sx }}
      >
        <GrassIcon />
      </Avatar>
    );
  }

  if (!plant.pictures || plant.pictures.length === 0) {
    return (
      <Avatar
        variant={variant}
        alt={plant.name}
        sx={{ width: size, height: size, boxSizing: 'border-box', ...borderSx, ...extraSx, ...sx }}
      >
        <GrassIcon color="primary" />
      </Avatar>
    );
  }

  return (
    <Avatar
      variant={variant}
      src={plant.pictures[0].thumbnail}
      alt={plant.name}
      sx={{ width: size, height: size, boxSizing: 'border-box', ...borderSx, ...extraSx, ...sx }}
    />
  );
});

export default PlantAvatar;
