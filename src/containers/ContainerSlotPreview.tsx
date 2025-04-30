import GrassIcon from '@mui/icons-material/Grass';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { format } from 'date-fns';
import { memo, useCallback, useMemo } from 'react';
import { CLOSED, Container, PLANTED, Plant, Slot, TRANSPLANTED } from '../interface';
import { usePlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import { usePlantInstanceStatus, usePlantInstanceStatusColor } from '../plant-instances/hooks/usePlantInstanceStatus';
import { usePlantInstance } from '../plant-instances/hooks/usePlantInstances';
import PlantAvatar from '../plants/PlantAvatar';
import { useTasksByPlantInstance } from '../tasks/hooks/useTasks';
import { findHistoryFrom, getPlantedEvent } from '../utility/history.util';
import { getPlantTitle } from '../utility/plant.util';
import { getSlotTitle } from '../utility/slot.util';
import useSlotPreviewBadgeColor from './hooks/useSlotPreviewBadgeColor';

interface ContainerSlotPreviewProps {
  index: number;
  container: Container;
  slot?: Slot;
  plant?: Plant;
  size: number;
  isActionable: boolean | undefined;
  isLink: boolean;
  onSlotClick: (slot: Slot | undefined, index: number) => void;
}

const ContainerSlotPreview = memo(
  ({ index, container, slot, plant, size, isActionable, isLink, onSlotClick }: ContainerSlotPreviewProps) => {
    const plantInstance = usePlantInstance(slot?.plantInstanceId);
    const tasks = useTasksByPlantInstance(plantInstance?._id);
    const plantLocation = usePlantInstanceLocation(plantInstance);
    const plantStatus = usePlantInstanceStatus(
      plantInstance,
      {
        containerId: container._id,
        slotId: index
      },
      plantLocation
    );

    const { badgeColor, badgeCount } = useSlotPreviewBadgeColor(tasks);
    const borderColor = usePlantInstanceStatusColor(
      plantInstance,
      {
        containerId: container._id,
        slotId: index
      },
      plantLocation,
      plant
    );

    const url = useMemo(() => `/container/${container._id}/slot/${index}`, [container._id, index]);

    const title = useMemo(() => {
      let slotTitle = `${getSlotTitle(index, container.rows)}`;
      if (!slot) {
        slotTitle += ` - Not Planted`;
      } else if (plant) {
        slotTitle += ` - ${getPlantTitle(plant)}, ${plantStatus}`;
        if (plantStatus === PLANTED) {
          const plantedEvent = getPlantedEvent(plantInstance);
          if (plantedEvent) {
            slotTitle += ` on ${format(plantedEvent.date, 'MMM d, yyyy')}`;
          }
        } else if (plantStatus === TRANSPLANTED) {
          const tranplantedEvent = findHistoryFrom(
            plantInstance,
            {
              containerId: container._id,
              slotId: index
            },
            TRANSPLANTED
          );

          if (tranplantedEvent) {
            slotTitle += ` on ${format(tranplantedEvent.date, 'MMM d, yyyy')}`;
          }
        }
      }

      return slotTitle;
    }, [container._id, container.rows, index, plant, plantInstance, plantStatus, slot]);

    const handleClick = useCallback(() => {
      onSlotClick(slot, index);
    }, [index, onSlotClick, slot]);

    return (
      <IconButton
        component={isLink ? 'a' : 'div'}
        href={isLink ? url : undefined}
        sx={{
          p: 2,
          width: size,
          height: size,
          border: `2px solid ${isActionable === false ? 'rgba(0,0,0,0.7)' : borderColor}`,
          borderRadius: 0
        }}
        onClick={!isLink ? handleClick : undefined}
        title={title}
      >
        {isActionable === false ? (
          <Box
            key="plant-overlay"
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.85)',
              zIndex: 1
            }}
          />
        ) : null}
        {badgeCount ? (
          <Box
            key="plant-badge"
            sx={{
              position: 'absolute',
              right: 12,
              bottom: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Badge
              badgeContent={badgeCount}
              color={badgeColor}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            ></Badge>
          </Box>
        ) : null}
        {plant ? (
          <PlantAvatar
            key="plant-avatar"
            plant={plant}
            size={size - 4}
            variant="square"
            faded={plantStatus === TRANSPLANTED || plantStatus === CLOSED}
          />
        ) : (
          <GrassIcon key="plant-icon" color="disabled" />
        )}
      </IconButton>
    );
  }
);

export default ContainerSlotPreview;
