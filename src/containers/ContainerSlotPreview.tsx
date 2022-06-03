import React, { useMemo } from 'react';
// import format from 'date-fns/format';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import GrassIcon from '@mui/icons-material/Grass';
import PlantAvatar from '../plants/PlantAvatar';
import { BaseSlot, Container, Plant, Slot } from '../interface';
import { getSlotTitle } from '../utility/slot.util';
import { usePlantInstance } from '../plant-instances/hooks/usePlantInstances';
import useSlotPreviewBadgeColor from './hooks/useSlotPreviewBadgeColor';
import { usePlantInstanceStatus, usePlantInstanceStatusColor } from '../plant-instances/hooks/usePlantInstanceStatus';
import { usePlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import { useTasksByPlantInstance } from '../tasks/hooks/useTasks';

interface ContainerSlotPreviewProps {
  index: number;
  container: Container;
  slot?: Slot;
  plant?: Plant;
  subSlot?: BaseSlot;
  subPlant?: Plant;
  onSlotClick: (slot: Slot | undefined, index: number) => void;
}

const ContainerSlotPreview = React.memo(
  ({ index, container, slot, plant, subSlot, subPlant, onSlotClick }: ContainerSlotPreviewProps) => {
    const plantInstance = usePlantInstance(slot?.plantInstanceId);
    const tasks = useTasksByPlantInstance(plantInstance?._id);
    const plantLocation = usePlantInstanceLocation(plantInstance);
    const plantStatus = usePlantInstanceStatus(
      plantInstance,
      {
        containerId: container._id,
        slotId: index,
        subSlot: false
      },
      plantLocation
    );

    const subPlantInstance = usePlantInstance(subSlot?.plantInstanceId);
    const subPlantTasks = useTasksByPlantInstance(subPlantInstance?._id);
    const subPlantStatus = usePlantInstanceStatus(
      subPlantInstance,
      {
        containerId: container._id,
        slotId: index,
        subSlot: true
      },
      plantLocation
    );

    const { badgeColor, badgeCount } = useSlotPreviewBadgeColor(tasks);
    const borderColor = usePlantInstanceStatusColor(
      plantInstance,
      {
        containerId: container._id,
        slotId: index,
        subSlot: false
      },
      plantLocation,
      plant
    );

    const { badgeColor: subPlantBadgeColor, badgeCount: subPlantBadgeCount } = useSlotPreviewBadgeColor(subPlantTasks);
    const subPlantBorderColor = usePlantInstanceStatusColor(
      subPlantInstance,
      {
        containerId: container._id,
        slotId: index,
        subSlot: true
      },
      plantLocation,
      subPlant,
      '#2c2c2c',
      '#1f1f1f'
    );

    const title = useMemo(() => {
      let slotTitle = `${getSlotTitle(index, container.rows)}`;
      if (!slot || plantStatus === 'Not Planted') {
        slotTitle += ` - Not Planted`;
      } else if (plant) {
        slotTitle += ` - ${plant.name}`;

        if (plantStatus === 'Planted') {
          slotTitle += `, Planted`;
          // TODO if (slot.plantedDate) {
          //   slotTitle += ` on ${format(slot.plantedDate, 'MMM d, yyyy')}`;
          // }
        } else if (plantStatus === 'Transplanted') {
          slotTitle += `, Transplanted`;
          // TODO if (slot.transplantedDate) {
          //   slotTitle += ` on ${format(slot.transplantedDate, 'MMM d, yyyy')}`;
          // }
        }
      }

      if (slot?.subSlot) {
        if (subPlant) {
          slotTitle += ` and ${subPlant.name}`;

          if (subPlantStatus === 'Planted') {
            slotTitle += `, Planted`;
            // TODO if (slot.subSlot.plantedDate) {
            //   slotTitle += ` on ${format(slot.subSlot.plantedDate, 'MMM d, yyyy')}`;
            // }
          } else if (subPlantStatus === 'Transplanted') {
            slotTitle += `, Transplanted`;
            // TODO if (slot.subSlot.transplantedDate) {
            //   slotTitle += ` on ${format(slot.subSlot.transplantedDate, 'MMM d, yyyy')}`;
            // }
          }
        }
      }

      return slotTitle;
    }, [container.rows, index, plant, plantStatus, slot, subPlant, subPlantStatus]);

    return (
      <IconButton
        sx={{ p: 2, width: 80, height: 80, border: `2px solid ${borderColor}`, borderRadius: 0 }}
        onClick={() => onSlotClick(slot, index)}
        title={title}
      >
        {badgeCount ? (
          <Box
            key="plant-badge"
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
              badgeContent={badgeCount}
              color={badgeColor}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Box sx={{ width: 52, height: 52, display: 'flex', boxSizing: 'border-box' }} />
            </Badge>
          </Box>
        ) : null}
        {plant ? (
          <PlantAvatar
            key="plant-avatar"
            plant={plant}
            size={76}
            variant="square"
            faded={plantStatus === 'Transplanted'}
          />
        ) : (
          <GrassIcon key="plant-icon" color="disabled" />
        )}
        {subSlot && subPlant ? (
          <Box
            key="sub-plant"
            sx={{
              position: 'absolute',
              width: '37.5%',
              height: '37.5%',
              bottom: 0,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${subPlantBorderColor}`
            }}
          >
            {subPlantBadgeCount ? (
              <Box
                key="sub-plant-badge"
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
                  badgeContent={subPlantBadgeCount}
                  color={subPlantBadgeColor}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  variant="dot"
                >
                  <Box sx={{ width: 18, height: 18, display: 'flex', boxSizing: 'border-box' }} />
                </Badge>
              </Box>
            ) : null}
            <PlantAvatar plant={subPlant} size={29} variant="square" faded={subPlantStatus === 'Transplanted'} />
          </Box>
        ) : null}
      </IconButton>
    );
  }
);

export default ContainerSlotPreview;
