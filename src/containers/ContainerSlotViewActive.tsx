import AddIcon from '@mui/icons-material/Add';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GrassIcon from '@mui/icons-material/Grass';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoveDownIcon from '@mui/icons-material/MoveDown';
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
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import DateDialog from '../components/DateDialog';
import Select from '../components/Select';
import CommentsView from '../components/comments/CommentsView';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import NumberInlineField from '../components/inline-fields/NumberInlineField';
import SimpleInlineField from '../components/inline-fields/SimpleInlineField';
import {
  BaseSlot,
  Container,
  PLANTED,
  Plant,
  PlantInstance,
  SEASONS,
  SPRING,
  STARTED_FROM_TYPES,
  STARTED_FROM_TYPE_SEED,
  Season,
  Slot,
  StartedFromType,
  TRANSPLANTED
} from '../interface';
import PicturesView from '../pictures/PicturesView';
import PlantInstanceHistoryView from '../plant-instances/PlantInstanceHistoryView';
import { getPlantInstanceLocation, usePlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import { getPlantInstanceStatusForSlot, usePlantInstanceStatus } from '../plant-instances/hooks/usePlantInstanceStatus';
import {
  useFertilizePlantInstance,
  useHarvestPlantInstance,
  useRemovePlantInstance,
  useUpdateCreatePlantInstance
} from '../plant-instances/hooks/usePlantInstances';
import PlantAvatar from '../plants/PlantAvatar';
import { usePlants } from '../plants/usePlants';
import ContainerSlotTasksView from '../tasks/container/ContainerSlotTasksView';
import { useTasksByPlantInstance } from '../tasks/hooks/useTasks';
import { getMidnight, setToMidnight } from '../utility/date.util';
import { getPlantedEvent } from '../utility/history.util';
import { getSlotTitle } from '../utility/slot.util';
import useSmallScreen from '../utility/smallScreen.util';
import { toTitleCase } from '../utility/string.util';
import DisplayStatusChip, { DisplayStatusChipProps } from './DisplayStatusChip';
import useContainerOptions from './hooks/useContainerOptions';
import { useContainerSlotLocation } from './hooks/useContainerSlotLocation';
import PastSlotPlants from './plants/PastSlotPlants';
import DialogContentText from '@mui/material/DialogContentText';

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

interface ContainerSlotViewActiveProps {
  id: string;
  index: number;
  type: 'slot' | 'sub-slot';
  container: Container;
  slot: BaseSlot;
  plantInstance: PlantInstance;
  subSlot?: BaseSlot;
  subPlantInstance?: PlantInstance;
  onSlotChange: (slot: BaseSlot) => Promise<Container | undefined>;
}

const ContainerSlotViewActive = ({
  id,
  index,
  type,
  container,
  slot,
  plantInstance,
  subSlot,
  subPlantInstance,
  onSlotChange
}: ContainerSlotViewActiveProps) => {
  const navigate = useNavigate();

  const isSmallScreen = useSmallScreen();

  const [showTransplantedModal, setShowTransplantedModal] = useState(false);
  const [transplantedDate, setTransplantedDate] = useState<Date>(getMidnight());

  const plants = usePlants();

  const fertilizePlantInstance = useFertilizePlantInstance(plantInstance._id);
  const harvestPlantInstance = useHarvestPlantInstance(plantInstance._id);

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

  const location = useMemo(() => ({ containerId: id, slotId: index, subSlot: type === 'sub-slot' }), [id, index, type]);
  const updateCreatePlantInstance = useUpdateCreatePlantInstance(plantInstance, location, container);
  const removePlantInstance = useRemovePlantInstance(plantInstance);

  const createNewPlantInstance = useCallback(() => {
    if (plantInstance && !plantInstance.closed) {
      return;
    }

    updateSlot({
      plantInstanceId: null
    });

    handleMoreMenuClose();
  }, [plantInstance, updateSlot]);

  const onPlantInstanceChange = useCallback(
    (data: Partial<PlantInstance>) => {
      const finalData = { ...data };
      updateCreatePlantInstance(finalData).then((result) => {
        if (result && slot.plantInstanceId !== result._id) {
          updateSlot({ plantInstanceId: result._id });
        }
      });
    },
    [slot.plantInstanceId, updateCreatePlantInstance, updateSlot]
  );

  const onPlantInstanceDelete = useCallback(() => {
    removePlantInstance().then((result) => {
      if (result && plantInstance._id === result._id) {
        navigate(`/container/${container._id}`);
      }
    });
  }, [container._id, navigate, plantInstance._id, removePlantInstance]);

  const title = useMemo(() => getSlotTitle(index, container?.rows), [container?.rows, index]);

  const plant = useMemo(
    () => plants.find((otherPlant) => otherPlant._id === plantInstance.plant),
    [plants, plantInstance]
  );

  const subPlant = useMemo(
    () =>
      plants.find((otherPlant) =>
        subPlantInstance ? otherPlant._id === subPlantInstance.plant : otherPlant._id === subSlot?.plant
      ),
    [plants, subPlantInstance, subSlot?.plant]
  );

  const filteredPlants = useMemo(
    () => plants.filter((aPlant) => aPlant.retired !== true || aPlant._id === plantInstance.plant),
    [plantInstance.plant, plants]
  );

  const updatePlant = useCallback(
    (value: Plant | null) => {
      onPlantInstanceChange({ plant: value?._id ?? null });
      return;
    },
    [onPlantInstanceChange]
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
                {value.type ? `${value.type} - ` : ''}
                {value.name}
              </Box>
            </Button>
          ),
          avatar: <PlantAvatar plant={value} />
        };
      }

      return {
        primary: `${value.type ? `${value.type} - ` : ''}${value.name}`,
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
    const subStatus = getPlantInstanceStatusForSlot(
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
                {subPlant.type ? `${subPlant.type} - ` : ''}
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
    onPlantInstanceChange({ closed: !plantInstance.closed });
    handleMoreMenuClose();
  }, [onPlantInstanceChange, plantInstance.closed]);

  const [deleting, setDeleting] = useState(false);
  const handleOnDelete = useCallback(() => {
    handleMoreMenuClose();
    setDeleting(true);
  }, []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    if (container._id) {
      onPlantInstanceDelete();
    }
  }, [container._id, onPlantInstanceDelete]);
  const handleDeleteOnClose = useCallback(() => setDeleting(false), []);

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
        `/container/${container?._id}/slot/${index}/transplant/${transplantedToContainerId}?date=${transplantedDate.getTime()}&subSlot=${
          type === 'sub-slot'
        }&backPath=${path}${type === 'sub-slot' ? '/sub-slot' : ''}&backLabel=${
          type === 'sub-slot' ? `${title} - Sub Plant` : title
        }`
      );
    } else if (displayStatus !== TRANSPLANTED) {
      onPlantInstanceChange({
        history: [
          ...(plantInstance.history ?? []),
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
    plantInstance.history,
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
                        <>
                          <MenuItem onClick={onPlantedClick}>
                            <ListItemIcon>
                              <GrassIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <Typography color="success.main">Plant</Typography>
                          </MenuItem>
                        </>
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
                      {plantedEvent ? (
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
                      ) : (
                        <MenuItem onClick={handleOnDelete}>
                          <ListItemIcon>
                            <DeleteForeverIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="error.main">Delete</Typography>
                        </MenuItem>
                      )}
                      {plantedEvent && (displayStatus === 'Planted' || displayStatus === 'Transplanted') ? (
                        <MenuItem onClick={onTransplantClick}>
                          <ListItemIcon>
                            <MoveDownIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="error.main">Transplant</Typography>
                        </MenuItem>
                      ) : null}
                      {plantInstance.closed === true ? (
                        <MenuItem onClick={createNewPlantInstance}>
                          <ListItemIcon>
                            <AddIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="success.main">New Plant</Typography>
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
                    {plantedEvent && (displayStatus === 'Planted' || displayStatus === 'Transplanted') ? (
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
                    {plantedEvent ? (
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
                    ) : (
                      <Button
                        variant="outlined"
                        aria-label="delete"
                        color="error"
                        onClick={handleOnDelete}
                        title="Delete"
                      >
                        <DeleteForeverIcon sx={{ mr: 1 }} color="error" fontSize="small" />
                        Delete
                      </Button>
                    )}
                    {plantInstance.closed === true ? (
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
          value={plantInstance.startedFrom}
          defaultValue={STARTED_FROM_TYPE_SEED}
          required
          options={STARTED_FROM_TYPES}
          onChange={updateStartedFrom}
          renderer={renderStartedFrom}
          sx={{ mt: 1 }}
        />
        <DrawerInlineSelect
          label="Season"
          value={plantInstance.season}
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
            value={plantInstance.plantedCount}
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
                slotProps={{ textField: { sx: { flexGrow: 1 } } }}
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
      <Dialog
        open={deleting}
        onClose={handleDeleteOnClose}
        aria-labelledby="deleting-plant-instance-title"
        aria-describedby="deleting-plant-instance-description"
      >
        <DialogTitle id="deleting-plant-instance-title">Delete plant instance</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-plant-instance-description">
            Are you sure you want to delete this plant instance?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteOnClose} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleOnDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContainerSlotViewActive;
