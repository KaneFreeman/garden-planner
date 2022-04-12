import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import GrassIcon from '@mui/icons-material/Grass';
import PlantAvatar from '../plants/PlantAvatar';
import { BaseSlot, Container, Plant, Slot } from '../interface';
import getSlotTitle from '../utility/slot.util';

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

    const subPlantBadgeColor = useMemo(() => {
      if (!subPlant) {
        return 'default';
      }

      if (subSlot?.status === 'Planted') {
        return 'success';
      }

      if (subSlot?.status === 'Transplanted') {
        return 'error';
      }

      return 'primary';
    }, [subPlant, subSlot?.status]);

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
              border: '1px solid #1f1f1f'
            }}
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
            <PlantAvatar plant={subPlant} size={29} variant="square" />
          </Box>
        ) : null}
      </IconButton>
    );
  }
);

export default ContainerSlotPreview;
