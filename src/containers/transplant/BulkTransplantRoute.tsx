import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/system/useTheme';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import DateDialog from '../../components/DateDialog';
import Loading from '../../components/Loading';
import { Slot, TRANSPLANTED } from '../../interface';
import { usePlantInstancesById, useUpdatePlantInstance } from '../../plant-instances/hooks/usePlantInstances';
import PlantAvatar from '../../plants/PlantAvatar';
import { usePlantsById } from '../../plants/usePlants';
import { getMidnight } from '../../utility/date.util';
import { getTransplantedDate } from '../../utility/history.util';
import { getPlantTitle } from '../../utility/plant.util';
import { getSlotTitle } from '../../utility/slot.util';
import useSmallScreen from '../../utility/smallScreen.util';
import { useContainer } from '../hooks/useContainers';
import { getContainerSlotLocation } from '../hooks/useContainerSlotLocation';

import './BulkTransplantRoute.css';

const BulkTransplantRoute = () => {
  const { id: containerId, otherContainerId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useSmallScreen();

  const container = useContainer(containerId);
  const otherContainer = useContainer(otherContainerId);
  const updatePlantInstance = useUpdatePlantInstance({ skipRefresh: true });

  const plantInstanceById = usePlantInstancesById();
  const plantsById = usePlantsById();

  const [moreMenuAnchorElement, setMoreMenuAnchorElement] = useState<null | HTMLElement>(null);
  const moreMenuOpen = useMemo(() => Boolean(moreMenuAnchorElement), [moreMenuAnchorElement]);
  const handleMoreMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchorElement(event.currentTarget);
  };
  const handleMoreMenuClose = () => {
    setMoreMenuAnchorElement(null);
  };

  const slotsToTransplant = useMemo<{ index: number; slot: Slot }[]>(
    () =>
      Object.entries(container?.slots ?? {})
        .map(([index, slot]) => ({ index: +index, slot }))
        .filter(({ index, slot }) => {
          if (slot.plantInstanceId == null) {
            return false;
          }

          const plantInstance = plantInstanceById[slot.plantInstanceId];
          return (
            plantInstance?.plant != null &&
            !plantInstance.closed &&
            getTransplantedDate(plantInstance, getContainerSlotLocation(container?._id, index)) == null
          );
        }),
    [container?._id, container?.slots, plantInstanceById]
  );

  const slotsCanTransplantTo = useMemo<ReactNode[]>(
    () =>
      Object.entries(otherContainer?.slots ?? {})
        .filter(([_index, slot]) => !slot.plantInstanceId)
        .map(([index, slot]) => {
          if (slot.plantInstanceId != null || slot.plant == null) {
            return null;
          }

          const plant = plantsById[slot.plant];
          if (plant == null) {
            return null;
          }

          const slotTitle = getSlotTitle(+index, otherContainer?.rows);

          return (
            <MenuItem key={`option-slot-${index}`} value={index}>
              <ListItemAvatar>
                <PlantAvatar key="plant-avatar" plant={plant} />
              </ListItemAvatar>
              <ListItemText
                primary={getPlantTitle(plant)}
                secondary={slotTitle}
                classes={{
                  root: 'transplant-slot-text',
                  primary: 'transplant-slot-text-primary',
                  secondary: 'transplant-slot-text-secondary'
                }}
              />
            </MenuItem>
          );
        }),
    [otherContainer?.rows, otherContainer?.slots, plantsById]
  );

  const [transplantTargets, setTransplantTargets] = useState<Record<number, number | null>>({});

  useEffect(() => {
    if (Object.keys(transplantTargets).length !== 0 || !container || !otherContainer) {
      return;
    }

    const otherSlots = otherContainer.slots ?? {};
    const otherSlotsByPlants = Object.keys(otherSlots).reduce<Record<string, number[]>>((acc, otherIndex) => {
      const slot = otherSlots[+otherIndex];
      if (slot.plantInstanceId || !slot.plant) {
        return acc;
      }

      if (!(slot.plant in acc)) {
        acc[slot.plant] = [];
      }

      acc[slot.plant].push(+otherIndex);

      return acc;
    }, {});

    const slots = container.slots ?? {};
    const slotTransplantSuggestions = Object.keys(slots).reduce<Record<number, number | null>>((acc, index) => {
      const slot = slots[+index];
      if (!slot.plantInstanceId) {
        return acc;
      }

      const plantInstance = plantInstanceById[slot.plantInstanceId];
      if (!plantInstance || !plantInstance.plant || !(plantInstance.plant in otherSlotsByPlants)) {
        return acc;
      }

      const suggestion = otherSlotsByPlants[plantInstance.plant].shift();
      if (suggestion == null) {
        return acc;
      }

      acc[+index] = suggestion;

      return acc;
    }, {});

    setTransplantTargets(slotTransplantSuggestions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, otherContainer, plantInstanceById]);

  const handleTransplantChange = useCallback((slotIndex: number, event: SelectChangeEvent) => {
    const targetSlot = event.target.value;
    setTransplantTargets((value) => {
      const newValue = { ...value };
      newValue[slotIndex] = targetSlot === 'NONE' ? null : +targetSlot;
      return newValue;
    });
  }, []);

  const [processing, setProcessing] = useState(false);
  const [showTransplantedModal, setShowTransplantedModal] = useState(false);
  const [transplantedDate, setTransplantedDate] = useState<Date>(getMidnight());
  const onTransplantClick = useCallback(() => {
    setTransplantedDate(getMidnight());
    setShowTransplantedModal(true);
    handleMoreMenuClose();
  }, []);

  const finishUpdateStatusTransplanted = useCallback(async () => {
    setProcessing(true);
    const sourceSlots = container?.slots ?? {};
    const sourceSlotIndexes = Object.keys(transplantTargets);
    for (const sourceSlotIndex of sourceSlotIndexes) {
      const sourceSlot = sourceSlots[+sourceSlotIndex];
      const destinationSlotIndex = transplantTargets[+sourceSlotIndex];
      if (
        sourceSlot == null ||
        sourceSlot.plantInstanceId == null ||
        destinationSlotIndex == null ||
        containerId == null ||
        otherContainerId == null
      ) {
        continue;
      }

      const plantInstance = plantInstanceById[sourceSlot.plantInstanceId];
      if (plantInstance == null) {
        continue;
      }

      await updatePlantInstance({
        ...plantInstance,
        history: [
          ...(plantInstance.history ?? []),
          {
            from: {
              containerId,
              slotId: +sourceSlotIndex
            },
            to: {
              containerId: otherContainerId,
              slotId: destinationSlotIndex
            },
            date: transplantedDate,
            status: TRANSPLANTED
          }
        ]
      });
    }

    setProcessing(false);
    navigate(`/container/${otherContainerId}`);
  }, [
    container?.slots,
    containerId,
    navigate,
    otherContainerId,
    plantInstanceById,
    transplantTargets,
    transplantedDate,
    updatePlantInstance
  ]);

  if (!container || !otherContainer || container._id !== containerId) {
    return <Loading key="container-view-loading" />;
  }

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
            current: 'Transplant',
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
                      <MenuItem onClick={onTransplantClick}>
                        <ListItemIcon>
                          <MoveDownIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <Typography color="error.main">Finish Transplant</Typography>
                      </MenuItem>
                    </Menu>
                  </Box>
                ) : (
                  <Box key="large-screen-actions" sx={{ display: 'flex', gap: 1.5 }}>
                    <LoadingButton
                      variant="outlined"
                      aria-label="transplant"
                      color="error"
                      onClick={onTransplantClick}
                      loading={processing}
                      title="Transplant"
                    >
                      <MoveDownIcon sx={{ mr: 1 }} fontSize="small" />
                      Finish Transplant
                    </LoadingButton>
                  </Box>
                )}
              </Box>
            )
          }}
        </Breadcrumbs>
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '24px',
            gap: '8px',
            [theme.breakpoints.down('sm')]: {
              gap: '20px'
            }
          }}
        >
          {slotsToTransplant.map(({ index, slot }) => {
            if (slot.plantInstanceId == null) {
              return null;
            }

            const plantInstance = plantInstanceById[slot.plantInstanceId];
            if (plantInstance?.plant == null) {
              return null;
            }

            const plant = plantsById[plantInstance.plant];
            const slotTitle = getSlotTitle(index, container?.rows);

            return (
              <ListItem
                key={`from-slot-${index}`}
                className="transplant-slot"
                disablePadding
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '4px'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '356px' }}>
                  <ListItemAvatar>
                    <PlantAvatar key="plant-avatar" plant={plant} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={getPlantTitle(plant)}
                    secondary={slotTitle}
                    classes={{
                      root: 'transplant-slot-text',
                      primary: 'transplant-slot-text-primary',
                      secondary: 'transplant-slot-text-secondary'
                    }}
                  />
                </Box>
                <Select
                  value={`${transplantTargets[index] ?? 'NONE'}`}
                  onChange={(event) => handleTransplantChange(index, event)}
                  disabled={processing}
                  sx={{
                    padding: 0,
                    '.MuiSelect-select': { padding: '4px 12px' },
                    [theme.breakpoints.down('sm')]: { marginLeft: '56px' }
                  }}
                  renderValue={(value) => {
                    if (value === 'NONE') {
                      return (
                        <ListItem component="div" disablePadding sx={{ height: '44px' }}>
                          None
                        </ListItem>
                      );
                    }

                    const otherSlots = otherContainer?.slots ?? {};
                    const otherSlot = otherSlots[+value];
                    if (otherSlot == null || otherSlot.plant == null) {
                      return null;
                    }

                    const otherPlant = plantsById[otherSlot.plant];
                    if (otherPlant == null) {
                      return null;
                    }

                    const otherSlotTitle = getSlotTitle(+value, otherContainer?.rows);

                    return (
                      <ListItem component="div" disablePadding sx={{ height: '44px' }}>
                        <ListItemAvatar>
                          <PlantAvatar key="plant-avatar" plant={otherPlant} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={getPlantTitle(otherPlant)}
                          secondary={otherSlotTitle}
                          classes={{
                            root: 'transplant-slot-text',
                            primary: 'transplant-slot-text-primary',
                            secondary: 'transplant-slot-text-secondary'
                          }}
                        />
                      </ListItem>
                    );
                  }}
                >
                  <MenuItem value="NONE">None</MenuItem>
                  {slotsCanTransplantTo}
                </Select>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <DateDialog
        open={showTransplantedModal}
        question="When did you transplant?"
        label="Transplanted On"
        onClose={() => setShowTransplantedModal(false)}
        onConfirm={finishUpdateStatusTransplanted}
      />
    </>
  );
};

export default BulkTransplantRoute;
