import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import format from 'date-fns/format';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { green, red } from '@mui/material/colors';
import GrassIcon from '@mui/icons-material/Grass';
import PlantAvatar from '../plants/PlantAvatar';
import { BaseSlot, Container, Plant, Slot } from '../interface';
import { getSlotTitle, useStatusColor } from '../utility/slot.util';
import { useTasksByPath } from '../tasks/hooks/useTasks';

interface ContainerSlotPreviewProps {
  id: string;
  index: number;
  container: Container;
  slot?: Slot;
  plant?: Plant;
  subSlot?: BaseSlot;
  subPlant?: Plant;
}

const ContainerSlotPreview = React.memo(
  ({ id, index, container, slot, plant, subSlot, subPlant }: ContainerSlotPreviewProps) => {
    const navigate = useNavigate();

    const path = useMemo(() => `/container/${container._id}/slot/${index}`, [container._id, index]);
    const tasks = useTasksByPath(path);

    const subPlantPath = useMemo(() => `${path}/sub-slot`, [path]);
    const subPlantTasks = useTasksByPath(subPlantPath);

    const { badgeColor, badgeCount } = useMemo(() => {
      const { current, overdue } = tasks;

      let color: 'success' | 'default' | 'primary' | 'error';

      if (overdue.length > 0) {
        color = 'error';
        return { badgeColor: color, badgeCount: overdue.length };
      }

      if (current.length > 0) {
        color = 'primary';
        return { badgeColor: color, badgeCount: current.length };
      }

      color = 'default';
      return { badgeColor: color, badgeCount: 0 };
    }, [tasks]);

    const borderColor = useStatusColor(slot, plant);

    const { subPlantBadgeColor, subPlantBadgeCount } = useMemo(() => {
      const { current, overdue } = subPlantTasks;

      let color: 'success' | 'default' | 'primary' | 'error';

      if (overdue.length > 0) {
        color = 'error';
        return { subPlantBadgeColor: color, subPlantBadgeCount: overdue.length };
      }

      if (current.length > 0) {
        color = 'primary';
        return { subPlantBadgeColor: color, subPlantBadgeCount: current.length };
      }

      color = 'default';
      return { subPlantBadgeColor: color, subPlantBadgeCount: 0 };
    }, [subPlantTasks]);

    const subPlantBorderColor = useMemo(() => {
      if (!subPlant) {
        return '#2c2c2c';
      }

      if (subSlot?.status === 'Planted') {
        return green[300];
      }

      if (subSlot?.status === 'Transplanted') {
        return red[300];
      }

      return '#1f1f1f';
    }, [subPlant, subSlot?.status]);

    const title = useMemo(() => {
      let slotTitle = `${getSlotTitle(index, container.rows)}`;
      if (!slot || slot.status === 'Not Planted') {
        return `${slotTitle} - Not Planted`;
      }

      if (plant) {
        slotTitle += ` - ${plant.name}`;

        if (slot.status === 'Planted') {
          slotTitle += `, Planted`;
          if (slot.plantedDate) {
            slotTitle += ` on ${format(slot.plantedDate, 'MMM d, yyyy')}`;
          }
        } else if (slot.status === 'Transplanted') {
          slotTitle += `, Transplanted`;
          if (slot.transplantedDate) {
            slotTitle += ` on ${format(slot.transplantedDate, 'MMM d, yyyy')}`;
          }
        }
      }

      if (slot.subSlot) {
        if (subPlant) {
          slotTitle += ` and ${subPlant.name}`;

          if (slot.subSlot.status === 'Planted') {
            slotTitle += `, Planted`;
            if (slot.subSlot.plantedDate) {
              slotTitle += ` on ${format(slot.subSlot.plantedDate, 'MMM d, yyyy')}`;
            }
          } else if (slot.subSlot.status === 'Transplanted') {
            slotTitle += `, Transplanted`;
            if (slot.subSlot.transplantedDate) {
              slotTitle += ` on ${format(slot.subSlot.transplantedDate, 'MMM d, yyyy')}`;
            }
          }
        }
      }

      return slotTitle;
    }, [container.rows, index, plant, slot, subPlant]);

    return (
      <IconButton
        sx={{ p: 2, width: 80, height: 80, border: `2px solid ${borderColor}`, borderRadius: 0 }}
        onClick={() => navigate(`/container/${id}/slot/${index}`)}
        title={title}
      >
        {badgeCount ? (
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
        {plant ? <PlantAvatar plant={plant} size={76} variant="square" /> : <GrassIcon color="disabled" />}
        {subSlot && subPlant ? (
          <Box
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
            <PlantAvatar plant={subPlant} size={29} variant="square" />
          </Box>
        ) : null}
      </IconButton>
    );
  }
);

export default ContainerSlotPreview;
