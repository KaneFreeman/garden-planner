import React, { MouseEvent, useCallback, useMemo } from 'react';
import format from 'date-fns/format';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import GrassIcon from '@mui/icons-material/Grass';
import PlantAvatar from '../plants/PlantAvatar';
import { BaseSlot, CLOSED, Container, Plant, PLANTED, Slot, TRANSPLANTED } from '../interface';
import { getSlotTitle } from '../utility/slot.util';
import { usePlantInstance } from '../plant-instances/hooks/usePlantInstances';
import useSlotPreviewBadgeColor from './hooks/useSlotPreviewBadgeColor';
import { usePlantInstanceStatus, usePlantInstanceStatusColor } from '../plant-instances/hooks/usePlantInstanceStatus';
import { usePlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import { useTasksByPlantInstance } from '../tasks/hooks/useTasks';
import { findHistoryFrom, getPlantedEvent } from '../utility/history.util';
import useSmallScreen from '../utility/smallScreen.util';

interface ContainerSlotPreviewProps {
  index: number;
  container: Container;
  slot?: Slot;
  slotSelected: boolean;
  plant?: Plant;
  subSlot?: BaseSlot;
  subPlant?: Plant;
  isSelecting: boolean;
  onSlotClick: (slot: Slot | undefined, index: number) => void;
  onSlotSelect: (plantInstanceId: string) => void;
}

const ContainerSlotPreview = React.memo(
  ({
    index,
    container,
    slot,
    slotSelected,
    plant,
    subSlot,
    subPlant,
    isSelecting,
    onSlotClick,
    onSlotSelect
  }: ContainerSlotPreviewProps) => {
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
      if (!slot) {
        slotTitle += ` - Not Planted`;
      } else if (plant) {
        slotTitle += ` - ${plant.name}, ${plantStatus}`;
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
              slotId: index,
              subSlot: false
            },
            TRANSPLANTED
          );

          if (tranplantedEvent) {
            slotTitle += ` on ${format(tranplantedEvent.date, 'MMM d, yyyy')}`;
          }
        }
      }

      if (slot?.subSlot && subPlantInstance?.closed !== true && subPlant) {
        slotTitle += ` and ${subPlant.name}, ${subPlantStatus}`;

        if (subPlantStatus === PLANTED) {
          slotTitle += `, Planted`;
          const subPlantedEvent = getPlantedEvent(subPlantInstance);
          if (subPlantedEvent) {
            slotTitle += ` on ${format(subPlantedEvent.date, 'MMM d, yyyy')}`;
          }
        } else if (subPlantStatus === TRANSPLANTED) {
          slotTitle += `, Transplanted`;
          const subTranplantedEvent = findHistoryFrom(
            plantInstance,
            {
              containerId: container._id,
              slotId: index,
              subSlot: true
            },
            TRANSPLANTED
          );

          if (subTranplantedEvent) {
            slotTitle += ` on ${format(subTranplantedEvent.date, 'MMM d, yyyy')}`;
          }
        }
      }

      return slotTitle;
    }, [
      container._id,
      container.rows,
      index,
      plant,
      plantInstance,
      plantStatus,
      slot,
      subPlant,
      subPlantInstance,
      subPlantStatus
    ]);

    const handleSelect = useCallback(
      (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (slot?.plantInstanceId) {
          onSlotSelect(slot.plantInstanceId);
        }
      },
      [onSlotSelect, slot]
    );

    const handleClick = useCallback(
      (event: MouseEvent) => {
        if ((isSelecting || event.shiftKey) && slot?.plantInstanceId) {
          onSlotSelect(slot.plantInstanceId);
          return;
        }

        if (!isSelecting) {
          onSlotClick(slot, index);
        }
      },
      [index, isSelecting, onSlotClick, onSlotSelect, slot]
    );

    const isSmallScreen = useSmallScreen();

    return (
      <IconButton
        sx={{
          p: 2,
          width: 80,
          height: 80,
          border: `2px solid ${slotSelected ? '#e6e6e6' : borderColor}`,
          borderRadius: 0
        }}
        onClick={handleClick}
        onContextMenu={isSmallScreen ? handleSelect : undefined}
        title={title}
      >
        {slotSelected ? (
          <Box
            key="plant-overlay"
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.6)',
              zIndex: 1
            }}
          />
        ) : null}
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
            faded={plantStatus === TRANSPLANTED || plantStatus === CLOSED}
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
            <PlantAvatar
              plant={subPlant}
              size={29}
              variant="square"
              faded={subPlantStatus === TRANSPLANTED || subPlantStatus === CLOSED}
            />
          </Box>
        ) : null}
      </IconButton>
    );
  }
);

export default ContainerSlotPreview;
