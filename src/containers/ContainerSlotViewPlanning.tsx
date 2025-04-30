import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import { Container, Plant, STARTED_FROM_TYPE_SEED, Slot } from '../interface';
import { useAddPlantInstance } from '../plant-instances/hooks/usePlantInstances';
import PlantAvatar from '../plants/PlantAvatar';
import { usePlants } from '../plants/usePlants';
import { getPlantTitle } from '../utility/plant.util';
import computeSeason from '../utility/season.util';
import { getSlotTitle } from '../utility/slot.util';
import useSmallScreen from '../utility/smallScreen.util';
import DisplayStatusChip from './DisplayStatusChip';
import { useContainerSlotLocation } from './hooks/useContainerSlotLocation';
import PastSlotPlants from './plants/PastSlotPlants';

interface ContainerSlotViewPlanningProps {
  id: string;
  index: number;
  container: Container;
  slot: Slot;
  onSlotChange: (slot: Slot) => Promise<Container | undefined>;
}

const ContainerSlotViewPlanning = ({ id, index, container, slot, onSlotChange }: ContainerSlotViewPlanningProps) => {
  const isSmallScreen = useSmallScreen();

  const plants = usePlants();

  const path = useMemo(() => (id ? `/container/${id}/slot/${index}` : undefined), [id, index]);

  const slotLocation = useContainerSlotLocation(id, index);

  const [moreMenuAnchorElement, setMoreMenuAnchorElement] = useState<null | HTMLElement>(null);
  const moreMenuOpen = useMemo(() => Boolean(moreMenuAnchorElement), [moreMenuAnchorElement]);
  const handleMoreMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchorElement(event.currentTarget);
  };
  const handleMoreMenuClose = () => {
    setMoreMenuAnchorElement(null);
  };

  useEffect(() => {
    handleMoreMenuClose();
  }, [isSmallScreen]);

  const updateSlot = useCallback(
    (data: Partial<Slot>) => {
      const newSlot: Slot = {
        ...slot,
        ...data
      };

      onSlotChange(newSlot);
    },
    [onSlotChange, slot]
  );

  const addPlantInstance = useAddPlantInstance();

  const finishPlanning = useCallback(() => {
    addPlantInstance({
      containerId: id,
      slotId: index,
      plant: slot.plant ?? null,
      created: new Date(),
      startedFrom: container.startedFrom ?? STARTED_FROM_TYPE_SEED,
      season: computeSeason()
    });

    handleMoreMenuClose();
  }, [addPlantInstance, container.startedFrom, id, index, slot.plant]);

  const title = useMemo(() => getSlotTitle(index, container?.rows), [container?.rows, index]);

  const plant = useMemo(() => plants.find((otherPlant) => otherPlant._id === slot.plant), [plants, slot.plant]);

  const filteredPlants = useMemo(() => plants.filter((aPlant) => aPlant.retired !== true), [plants]);

  const updatePlant = useCallback(
    (value: Plant | null) => {
      updateSlot({ plant: value?._id ?? null });
    },
    [updateSlot]
  );

  const renderPlant = useCallback(
    (value: Plant | null | undefined, listType: 'value' | 'options') => {
      if (!value) {
        return undefined;
      }

      if (listType === 'value') {
        return {
          raw: (
            <Button
              component="a"
              variant="text"
              href={`/plant/${value._id}?backPath=${path}&backLabel=${title}`}
              sx={{ ml: -1 }}
            >
              <Box sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
                {getPlantTitle(value)}
              </Box>
            </Button>
          ),
          avatar: <PlantAvatar plant={value} />
        };
      }

      return {
        primary: getPlantTitle(value),
        avatar: <PlantAvatar plant={value} />
      };
    },
    [path, title]
  );

  return (
    <>
      <Box sx={{ p: 2, width: '100%', boxSizing: 'border-box' }}>
        <Breadcrumbs
          trail={[
            {
              to: `/containers`,
              label: 'Containers'
            },
            {
              to: `/container/${container._id}`,
              label: container.name
            }
          ]}
        >
          {{
            current: title,
            actions: (
              <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                {isSmallScreen ? (
                  <Box key="small-screen-actions" sx={{ display: 'flex' }}>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={moreMenuOpen ? 'long-menu' : undefined}
                      aria-expanded={moreMenuOpen ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={handleMoreMenuClick}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={moreMenuAnchorElement}
                      open={moreMenuOpen}
                      onClose={handleMoreMenuClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button'
                      }}
                    >
                      <MenuItem onClick={finishPlanning}>
                        <ListItemIcon>
                          <EventAvailableIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <Typography color="primary.main">Finish Planning</Typography>
                      </MenuItem>
                    </Menu>
                  </Box>
                ) : (
                  <Box key="large-screen-actions" sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                      variant="outlined"
                      aria-label="finish planning"
                      color="primary"
                      onClick={finishPlanning}
                      title="Finish Planning"
                    >
                      <EventAvailableIcon sx={{ mr: 1 }} fontSize="small" />
                      Finish Planning
                    </Button>
                  </Box>
                )}
              </Box>
            )
          }}
        </Breadcrumbs>
        <Box>
          <Typography variant="subtitle1" component="div" color="GrayText">
            Status
          </Typography>
          <Typography variant="body1" component="div" sx={{ mt: 1, mb: 1 }}>
            {<DisplayStatusChip status="Planning" size="large" />}
          </Typography>
        </Box>
        <DrawerInlineSelect
          label="Plant"
          value={plant}
          noValueLabel="No plant"
          options={filteredPlants}
          onChange={updatePlant}
          renderer={renderPlant}
          sx={{ mt: 1 }}
        />
        <PastSlotPlants slot={slot} location={slotLocation} />
      </Box>
    </>
  );
};

export default ContainerSlotViewPlanning;
