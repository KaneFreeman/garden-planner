/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import AddIcon from '@mui/icons-material/Add';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import GrassIcon from '@mui/icons-material/Grass';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import YardIcon from '@mui/icons-material/Yard';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import CommentsView from '../components/comments/CommentsView';
import DateDialog from '../components/DateDialog';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import NumberInlineField from '../components/inline-fields/NumberInlineField';
import SimpleInlineField from '../components/inline-fields/SimpleInlineField';
import Select from '../components/Select';
import {
  BaseSlot,
  Container,
  Plant,
  PLANTED,
  PlantInstance,
  Season,
  SEASONS,
  Slot,
  SPRING,
  StartedFromType,
  STARTED_FROM_TYPES,
  STARTED_FROM_TYPE_SEED,
  TRANSPLANTED
} from '../interface';
import PicturesView from '../pictures/PicturesView';
import { getPlantInstanceLocation, usePlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import {
  useAddPlantInstance,
  useFertilizePlantInstance,
  useHarvestPlantInstance,
  useUpdateCreatePlantInstance
} from '../plant-instances/hooks/usePlantInstances';
import { getPlantInstanceStatus, usePlantInstanceStatus } from '../plant-instances/hooks/usePlantInstanceStatus';
import PlantInstanceHistoryView from '../plant-instances/PlantInstanceHistoryView';
import PlantAvatar from '../plants/PlantAvatar';
import { usePlants } from '../plants/usePlants';
import ContainerSlotTasksView from '../tasks/container/ContainerSlotTasksView';
import { useTasksByPlantInstance } from '../tasks/hooks/useTasks';
import { getMidnight, setToMidnight } from '../utility/date.util';
import { getPlantedEvent } from '../utility/history.util';
import computeSeason from '../utility/season.util';
import { getSlotTitle } from '../utility/slot.util';
import useSmallScreen from '../utility/smallScreen.util';
import { toTitleCase } from '../utility/string.util';
import DisplayStatusChip, { DisplayStatusChipProps } from './DisplayStatusChip';
import useContainerOptions from './hooks/useContainerOptions';
import { useContainerSlotLocation } from './hooks/useContainerSlotLocation';
import PastSlotPlants from './plants/PastSlotPlants';

interface CircleProps {
  backgroundColor: string;
}

const Circle = styled(Box)<CircleProps>(({ backgroundColor }) => ({
  borderRadius: '50%',
  backgroundColor,
  width: 32,
  height: 32,
  marginLeft: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8125rem'
}));

interface ContainerSlotViewProps {
  id: string;
  index: number;
  type: 'slot' | 'sub-slot';
  container: Container;
  slot: BaseSlot;
  plantInstance: PlantInstance | undefined;
  subSlot?: BaseSlot;
  subPlantInstance?: PlantInstance;
  onSlotChange: (slot: BaseSlot) => Promise<Container | undefined>;
}

const ContainerSlotView = ({
  id,
  index,
  type,
  container,
  slot,
  plantInstance,
  subSlot,
  subPlantInstance,
  onSlotChange
}: ContainerSlotViewProps) => {
  const navigate = useNavigate();

  const isSmallScreen = useSmallScreen();

  const [showTransplantedModal, setShowTransplantedModal] = useState(false);
  const [transplantedDate, setTransplantedDate] = useState<Date>(getMidnight());

  const plants = usePlants();

  const fertilizePlantInstance = useFertilizePlantInstance(plantInstance?._id);
  const harvestPlantInstance = useHarvestPlantInstance(plantInstance?._id);

  const path = useMemo(() => (id ? `/container/${id}/slot/${index}` : undefined), [id, index]);
  const subPlantTasks = useTasksByPlantInstance(subPlantInstance?._id);

  const slotLocation = useContainerSlotLocation(id, index, type === 'sub-slot');

  const [transplantedToContainerId, setTransplantedToContainerId] = useState<string | null>(null);

  useEffect(() => {
    setTransplantedToContainerId(null);
  }, [slot]);

  const [showHowManyPlanted, setShowHowManyPlanted] = useState(false);
  const [plantedCount, setPlantedCount] = useState(1);

  const [showHarvestedDialogue, setShowHarvestedDialogue] = useState(false);
  const [showFertilizedDialogue, setShowFertilizedDialogue] = useState(false);

  const plantedEvent = useMemo(() => getPlantedEvent(plantInstance), [plantInstance]);

  const [moreMenuAnchorElement, setMoreMenuAnchorElement] = React.useState<null | HTMLElement>(null);
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

      // eslint-disable-next-line promise/catch-or-return
      onSlotChange(newSlot);
    },
    [onSlotChange, slot]
  );

  const location = useMemo(() => ({ containerId: id, slotId: index, subSlot: type === 'sub-slot' }), [id, index, type]);
  const updateCreatePlantInstance = useUpdateCreatePlantInstance(plantInstance, location, container);
  const addPlantInstance = useAddPlantInstance();

  const createNewPlantInstance = useCallback(() => {
    if (plantInstance && !plantInstance.closed) {
      return;
    }

    updateSlot({
      plantInstanceId: null
    });

    handleMoreMenuClose();
  }, [plantInstance, updateSlot]);

  const finishPlanning = useCallback(() => {
    if (plantInstance) {
      return;
    }

    addPlantInstance({
      containerId: id,
      slotId: index,
      subSlot: type === 'sub-slot',
      plant: slot.plant ?? null,
      created: new Date(),
      startedFrom: container.startedFrom ?? STARTED_FROM_TYPE_SEED,
      season: computeSeason(),
      plantedCount: 1
    });

    handleMoreMenuClose();
  }, [addPlantInstance, container.startedFrom, id, index, plantInstance, slot.plant, type]);

  const onPlantInstanceChange = useCallback(
    (data: Partial<PlantInstance>) => {
      const finalData = { ...data };
      if (!plantInstance) {
        finalData.plant = slot.plant;
      }
      updateCreatePlantInstance(finalData).then((result) => {
        if (result && slot.plantInstanceId !== result._id) {
          updateSlot({ plantInstanceId: result._id });
        }
      });
    },
    [plantInstance, slot.plant, slot.plantInstanceId, updateCreatePlantInstance, updateSlot]
  );

  const title = useMemo(() => getSlotTitle(index, container?.rows), [container?.rows, index]);

  const plant = useMemo(
    () =>
      plants.find((otherPlant) =>
        plantInstance ? otherPlant._id === plantInstance.plant : otherPlant._id === slot.plant
      ),
    [plants, plantInstance, slot.plant]
  );

  const subPlant = useMemo(
    () =>
      plants.find((otherPlant) =>
        subPlantInstance ? otherPlant._id === subPlantInstance?.plant : otherPlant._id === subSlot?.plant
      ),
    [plants, subPlantInstance, subSlot?.plant]
  );

  const filteredPlants = useMemo(
    () => plants.filter((aPlant) => aPlant.retired !== true || aPlant._id === plantInstance?.plant),
    [plantInstance?.plant, plants]
  );

  const updatePlant = useCallback(
    (value: Plant | null) => {
      if (plantInstance) {
        onPlantInstanceChange({ plant: value?._id ?? null });
        return;
      }

      updateSlot({ plant: value?._id ?? null });
    },
    [onPlantInstanceChange, plantInstance, updateSlot]
  );

  const onPlantClick = useCallback(
    (target: Plant) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (target && path) {
        event.stopPropagation();
        navigate(`/plant/${target._id}?backPath=${path}&backLabel=${title}`);
      }
    },
    [navigate, path, title]
  );

  const onSubPlantClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if ((plantInstance || subPlantInstance) && path) {
        event.stopPropagation();
        navigate(`${path}/sub-slot`);
      }
    },
    [navigate, path, plantInstance, subPlantInstance]
  );

  const renderPlant = useCallback(
    (value: Plant | null | undefined, listType: 'value' | 'options') => {
      if (!value) {
        return undefined;
      }

      if (listType === 'value') {
        return {
          raw: (
            <Button variant="text" onClick={onPlantClick(value)} sx={{ ml: -1 }}>
              <Box sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
                {value.name}
              </Box>
            </Button>
          ),
          avatar: <PlantAvatar plant={value} />
        };
      }

      return {
        primary: value.name,
        avatar: <PlantAvatar plant={value} />
      };
    },
    [onPlantClick]
  );

  const plantInstanceLocation = usePlantInstanceLocation(plantInstance);
  const displayStatus = usePlantInstanceStatus(plantInstance, slotLocation, plantInstanceLocation);
  const renderStatus = useCallback(
    (status: DisplayStatusChipProps['status']) => <DisplayStatusChip status={status} size="large" />,
    []
  );

  const renderedSubPlant = useMemo(() => {
    const subLocation = getPlantInstanceLocation(subPlantInstance);
    const subStatus = getPlantInstanceStatus(
      subPlantInstance,
      {
        containerId: id,
        slotId: index,
        subSlot: true
      },
      subLocation
    );
    const subDisplayStatus = renderStatus(subStatus);

    const { active, thisWeek, overdue } = subPlantTasks;

    let badge: ReactNode = null;
    if (overdue.length > 0) {
      badge = <Circle backgroundColor="error.main">{overdue.length}</Circle>;
    } else if (thisWeek.length > 0) {
      badge = <Circle backgroundColor="warning.main">{thisWeek.length}</Circle>;
    } else if (active.length > 0) {
      badge = <Circle backgroundColor="primary.main">{active.length}</Circle>;
    }

    return (
      <ListItemButton key="sub-plant" onClick={onSubPlantClick} sx={{ ml: -2, mr: -2 }}>
        {subPlant ? (
          <>
            <ListItemAvatar sx={{ display: 'flex' }}>
              <PlantAvatar plant={subPlant} />
            </ListItemAvatar>
            <Button variant="text" onClick={onPlantClick(subPlant)} sx={{ ml: -1 }}>
              <Box sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden' }}>
                {subPlant.name}
              </Box>
            </Button>
            {subPlantInstance ? subDisplayStatus : null}
            {badge}
          </>
        ) : (
          <ListItemText primary="None" />
        )}
      </ListItemButton>
    );
  }, [subPlantInstance, id, index, renderStatus, subPlantTasks, onSubPlantClick, subPlant, onPlantClick]);

  const onPlantedClick = useCallback(() => {
    setShowHowManyPlanted(true);
    handleMoreMenuClose();
  }, []);

  const onTransplantClick = useCallback(() => {
    setTransplantedDate(getMidnight());
    setShowTransplantedModal(true);
    handleMoreMenuClose();
  }, []);

  const onHarvestClick = useCallback(() => {
    setShowHarvestedDialogue(true);
    handleMoreMenuClose();
  }, []);

  const onFertilizeClick = useCallback(() => {
    setShowFertilizedDialogue(true);
    handleMoreMenuClose();
  }, []);

  const onCloseReopen = useCallback(() => {
    onPlantInstanceChange({ closed: !plantInstance?.closed });
    handleMoreMenuClose();
  }, [onPlantInstanceChange, plantInstance?.closed]);

  const updateStartedFrom = useCallback(
    (value: StartedFromType) => {
      if (value) {
        onPlantInstanceChange({ startedFrom: value });
      }
    },
    [onPlantInstanceChange]
  );

  const renderStartedFrom = useCallback((value: StartedFromType | null | undefined) => {
    if (!value) {
      return undefined;
    }

    return {
      primary: value
    };
  }, []);

  const updateSeason = useCallback(
    (value: Season) => {
      if (value) {
        onPlantInstanceChange({ season: value });
      }
    },
    [onPlantInstanceChange]
  );

  const renderSeason = useCallback((value: Season | null | undefined) => {
    if (!value) {
      return undefined;
    }

    return {
      primary: toTitleCase(value)
    };
  }, []);

  const finishUpdateStatusPlanted = useCallback(
    (date: Date) => {
      onPlantInstanceChange({
        history: [
          {
            status: PLANTED,
            date,
            to: {
              containerId: id,
              slotId: index,
              subSlot: type === 'sub-slot'
            }
          }
        ],
        plantedCount
      });
      setShowHowManyPlanted(false);
      setPlantedCount(1);
    },
    [id, index, onPlantInstanceChange, plantedCount, type]
  );

  const finishUpdateStatusHarvested = useCallback(
    (date: Date) => {
      setShowHarvestedDialogue(false);
      harvestPlantInstance(date);
    },
    [harvestPlantInstance]
  );

  const finishUpdateStatusFertilized = useCallback(
    (date: Date) => {
      setShowFertilizedDialogue(false);
      fertilizePlantInstance(date);
    },
    [fertilizePlantInstance]
  );

  const finishUpdateStatusTransplanted = useCallback(() => {
    if (transplantedToContainerId !== null) {
      navigate(
        `/container/${
          container?._id
        }/slot/${index}/transplant/${transplantedToContainerId}?date=${transplantedDate.getTime()}&subSlot=${
          type === 'sub-slot'
        }&backPath=${path}${type === 'sub-slot' ? '/sub-slot' : ''}&backLabel=${
          type === 'sub-slot' ? `${title} - Sub Plant` : title
        }`
      );
    } else if (displayStatus !== TRANSPLANTED) {
      onPlantInstanceChange({
        history: [
          ...(plantInstance?.history ?? []),
          {
            status: TRANSPLANTED,
            date: transplantedDate,
            from: {
              containerId: id,
              slotId: index,
              subSlot: type === 'sub-slot'
            }
          }
        ]
      });
    }
    setShowTransplantedModal(false);
    setTransplantedToContainerId(null);
  }, [
    container?._id,
    displayStatus,
    id,
    index,
    navigate,
    onPlantInstanceChange,
    path,
    plantInstance?.history,
    title,
    transplantedDate,
    transplantedToContainerId,
    type
  ]);

  const onTransplantContainerChange = useCallback(
    (newValue: string | undefined) => {
      if (transplantedToContainerId !== newValue) {
        setTransplantedToContainerId(newValue ?? null);
      }
    },
    [transplantedToContainerId]
  );

  const containerOptions = useContainerOptions();

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
            },
            type === 'sub-slot'
              ? {
                  to: `/container/${container._id}/slot/${index}`,
                  label: title
                }
              : null
          ]}
        >
          {{
            current: type === 'sub-slot' ? 'Sub Plant' : title,
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
                      {plant && plantInstance && !plantedEvent ? (
                        <MenuItem onClick={onPlantedClick}>
                          <ListItemIcon>
                            <GrassIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="success.main">Plant</Typography>
                        </MenuItem>
                      ) : null}
                      {plantedEvent && displayStatus !== 'Transplanted' ? (
                        <MenuItem onClick={onHarvestClick}>
                          <ListItemIcon>
                            <AgricultureIcon color="secondary" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="secondary.main">Harvest</Typography>
                        </MenuItem>
                      ) : null}
                      {plantedEvent && displayStatus !== 'Transplanted' ? (
                        <MenuItem onClick={onFertilizeClick}>
                          <ListItemIcon>
                            <YardIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="primary.main">Fertilize</Typography>
                        </MenuItem>
                      ) : null}
                      {plantInstance ? (
                        <MenuItem onClick={onCloseReopen}>
                          <ListItemIcon>
                            {plantInstance.closed ? (
                              <LockOpenIcon color="success" fontSize="small" />
                            ) : (
                              <LockIcon color="warning" fontSize="small" />
                            )}
                          </ListItemIcon>
                          <Typography color={plantInstance.closed ? 'success.main' : 'warning.main'}>
                            {plantInstance.closed ? 'Reopen' : 'Close'}
                          </Typography>
                        </MenuItem>
                      ) : null}
                      {plantedEvent ? (
                        <MenuItem onClick={onTransplantClick}>
                          <ListItemIcon>
                            <MoveDownIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="error.main">Transplant</Typography>
                        </MenuItem>
                      ) : null}
                      {plantInstance?.closed === true ? (
                        <MenuItem onClick={createNewPlantInstance}>
                          <ListItemIcon>
                            <AddIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="success.main">New Plant</Typography>
                        </MenuItem>
                      ) : null}
                      {!plantInstance ? (
                        <MenuItem onClick={finishPlanning}>
                          <ListItemIcon>
                            <EventAvailableIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="primary.main">Finish Planning</Typography>
                        </MenuItem>
                      ) : null}
                    </Menu>
                  </Box>
                ) : (
                  <Box key="large-screen-actions" sx={{ display: 'flex', gap: 1.5 }}>
                    {plant && plantInstance && !plantedEvent ? (
                      <Button
                        variant="outlined"
                        aria-label="plant"
                        color="success"
                        onClick={onPlantedClick}
                        title="Plant"
                      >
                        <GrassIcon sx={{ mr: 1 }} fontSize="small" />
                        Plant
                      </Button>
                    ) : null}
                    {plantedEvent && displayStatus === 'Planted' ? (
                      <Button
                        variant="outlined"
                        aria-label="harvest"
                        color="secondary"
                        onClick={onHarvestClick}
                        title="Harvest"
                      >
                        <AgricultureIcon sx={{ mr: 1 }} fontSize="small" />
                        Harvest
                      </Button>
                    ) : null}
                    {plantedEvent && displayStatus === 'Planted' ? (
                      <Button
                        variant="outlined"
                        aria-label="fertilize"
                        color="primary"
                        onClick={onFertilizeClick}
                        title="Fertilize"
                      >
                        <YardIcon sx={{ mr: 1 }} fontSize="small" />
                        Fertilize
                      </Button>
                    ) : null}
                    {plantedEvent && displayStatus === 'Planted' ? (
                      <Button
                        variant="outlined"
                        aria-label="transplant"
                        color="error"
                        onClick={onTransplantClick}
                        title="Transplant"
                      >
                        <MoveDownIcon sx={{ mr: 1 }} fontSize="small" />
                        Transplant
                      </Button>
                    ) : null}
                    {plantInstance ? (
                      <Button
                        variant="outlined"
                        aria-label={plantInstance.closed ? 'reopen' : 'close'}
                        color={plantInstance.closed ? 'success' : 'warning'}
                        onClick={onCloseReopen}
                        title={plantInstance.closed ? 'Reopen' : 'Close'}
                      >
                        {plantInstance.closed ? (
                          <LockOpenIcon sx={{ mr: 1 }} color="success" fontSize="small" />
                        ) : (
                          <LockIcon sx={{ mr: 1 }} color="warning" fontSize="small" />
                        )}
                        {plantInstance.closed ? 'Reopen' : 'Close'}
                      </Button>
                    ) : null}
                    {plantInstance?.closed === true ? (
                      <Button
                        variant="outlined"
                        aria-label="new plant"
                        color="success"
                        onClick={createNewPlantInstance}
                        title="New Plant"
                      >
                        <AddIcon sx={{ mr: 1 }} fontSize="small" />
                        New Plant
                      </Button>
                    ) : null}
                    {!plantInstance ? (
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
                    ) : null}
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
            {renderStatus(displayStatus)}
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
        <DrawerInlineSelect
          label="Started From"
          value={plantInstance?.startedFrom}
          defaultValue={STARTED_FROM_TYPE_SEED}
          required
          options={STARTED_FROM_TYPES}
          onChange={updateStartedFrom}
          renderer={renderStartedFrom}
          sx={{ mt: 1 }}
        />
        <DrawerInlineSelect
          label="Season"
          value={plantInstance?.season}
          defaultValue={SPRING}
          required
          options={SEASONS}
          onChange={updateSeason}
          renderer={renderSeason}
          sx={{ mt: 1 }}
        />
        {type === 'slot' && (plantInstance || subPlantInstance) ? (
          <SimpleInlineField label="Sub Plant" value={renderedSubPlant} />
        ) : null}
        {plantedEvent ? (
          <NumberInlineField
            label="Planted Count"
            value={plantInstance?.plantedCount}
            onChange={(value) => onPlantInstanceChange({ plantedCount: value })}
            wholeNumber
            min={0}
          />
        ) : null}
        <ContainerSlotTasksView
          plantInstance={plantInstance}
          containerId={id}
          slotId={index}
          slotTitle={title}
          type={type}
        />
        <PlantInstanceHistoryView plantInstance={plantInstance} slotLocation={slotLocation} />
        <PastSlotPlants slot={slot} location={slotLocation} />
        <PicturesView
          key="container-slot-view-pictures"
          data={plantInstance}
          location={slotLocation}
          container={container}
          alt={title}
        />
        <CommentsView
          id={`container-${id}-slot-${index}`}
          data={plantInstance}
          location={slotLocation}
          container={container}
          alt={title}
        />
      </Box>
      <DateDialog
        open={showHowManyPlanted}
        question="How many did you plant?"
        label="Planted On"
        onClose={() => setShowHowManyPlanted(false)}
        onConfirm={finishUpdateStatusPlanted}
      />
      <Dialog open={showTransplantedModal} onClose={() => setShowHowManyPlanted(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Transplant</DialogTitle>
        <DialogContent>
          <form name="plant-modal-form" onSubmit={finishUpdateStatusTransplanted} noValidate>
            <Box sx={{ display: 'flex', mt: 1, mb: 2, gap: 1 }}>
              <Select
                label="Container"
                value={transplantedToContainerId ?? undefined}
                onChange={onTransplantContainerChange}
                options={containerOptions}
              />
            </Box>
            <Box sx={{ display: 'flex', mt: 1, mb: 0.5 }}>
              <MobileDatePicker
                label="Transplanted On"
                value={transplantedDate}
                onChange={(newPlantedDate: Date | null) =>
                  newPlantedDate && setTransplantedDate(setToMidnight(newPlantedDate))
                }
                renderInput={(params) => (
                  <MuiTextField {...params} className="transplanted-dateTimeInput" sx={{ flexGrow: 1 }} />
                )}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTransplantedModal(false)}>Cancel</Button>
          <Button onClick={finishUpdateStatusTransplanted} variant="contained">
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <DateDialog
        open={showHarvestedDialogue}
        question="When did you harvest?"
        label="Harvested On"
        onClose={() => setShowHarvestedDialogue(false)}
        onConfirm={finishUpdateStatusHarvested}
      />
      <DateDialog
        open={showFertilizedDialogue}
        question="When did you fertilize?"
        label="Fertilized On"
        onClose={() => setShowFertilizedDialogue(false)}
        onConfirm={finishUpdateStatusFertilized}
      />
    </>
  );
};

export default ContainerSlotView;
