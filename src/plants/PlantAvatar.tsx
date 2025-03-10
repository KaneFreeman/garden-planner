import GrassIcon from '@mui/icons-material/Grass';
import Avatar from '@mui/material/Avatar';
import { SxProps, Theme } from '@mui/material/styles';
import { memo, useMemo } from 'react';
import { ContainerSlotIdentifier, Plant, PlantInstance } from '../interface';
import { usePlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import { usePlantInstanceStatusColor } from '../plant-instances/hooks/usePlantInstanceStatus';
import { getPlantTitle } from '../utility/plant.util';

interface PlantAvatarProperties {
  plant?: Plant;
  size?: number;
  variant?: 'square' | 'circular' | 'rounded' | undefined;
  slotLocation?: ContainerSlotIdentifier | null;
  plantInstance?: PlantInstance;
  sx?: SxProps<Theme> | undefined;
  faded?: boolean;
}

const PlantAvatar = memo(
  ({ plant, size = 40, variant, slotLocation, plantInstance, sx, faded = false }: PlantAvatarProperties) => {
    const plantLocation = usePlantInstanceLocation(plantInstance);
    const statusColor = usePlantInstanceStatusColor(plantInstance, slotLocation, plantLocation, plant, 'transparent');
    const borderSx: SxProps<Theme> | undefined = useMemo(() => {
      if (plantInstance === undefined || statusColor === 'transparent') {
        return {};
      }

      return {
        border: `3px solid ${statusColor}`
      };
    }, [plantInstance, statusColor]);

    const extraSx: SxProps<Theme> = { opacity: faded ? 0.25 : 1 };

    if (!plant) {
      return (
        <Avatar
          variant={variant}
          alt="Empty"
          sx={{ width: size, height: size, minWidth: size, boxSizing: 'border-box', ...borderSx, ...extraSx, ...sx }}
        >
          <GrassIcon />
        </Avatar>
      );
    }

    if (!plant.pictures || plant.pictures.length === 0) {
      return (
        <Avatar
          variant={variant}
          alt={getPlantTitle(plant)}
          sx={{ width: size, height: size, minWidth: size, boxSizing: 'border-box', ...borderSx, ...extraSx, ...sx }}
        >
          <GrassIcon color="primary" />
        </Avatar>
      );
    }

    return (
      <Avatar
        variant={variant}
        src={plant.pictures[0].thumbnail}
        alt={getPlantTitle(plant)}
        sx={{ width: size, height: size, minWidth: size, boxSizing: 'border-box', ...borderSx, ...extraSx, ...sx }}
      />
    );
  }
);

export default PlantAvatar;
