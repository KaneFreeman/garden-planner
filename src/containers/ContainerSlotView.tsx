/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import React, { ReactNode, useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiTextField from '@mui/material/TextField';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import GrassIcon from '@mui/icons-material/Grass';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import PicturesView from '../pictures/PicturesView';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import PlantAvatar from '../plants/PlantAvatar';
import NumberTextField from '../components/NumberTextField';
import CommentsView from '../components/comments/CommentsView';
import { getSlotTitle } from '../utility/slot.util';
import {
  PictureData,
  Plant,
  Slot,
  Comment,
  Container,
  BaseSlot,
  STARTED_FROM_TYPES,
  StartedFromType,
  PlantInstance,
  PLANTED,
  TRANSPLANTED,
  STARTED_FROM_TYPE_SEED,
  HARVESTED
} from '../interface';
import { usePlants } from '../plants/usePlants';
import Select from '../components/Select';
import ContainerSlotTasksView from '../tasks/container/ContainerSlotTasksView';
import SimpleInlineField from '../components/inline-fields/SimpleInlineField';
import Breadcrumbs from '../components/Breadcrumbs';
import PlantInstanceHistoryView from '../plant-instances/PlantInstanceHistoryView';
import { getMidnight, setToMidnight } from '../utility/date.util';
import { useAddPlantInstance, useUpdatePlantInstance } from '../plant-instances/hooks/usePlantInstances';
import { getPlantInstanceStatus, usePlantInstanceStatus } from '../plant-instances/hooks/usePlantInstanceStatus';
import useSmallScreen from '../utility/smallScreen.util';
import { getPlantInstanceLocation, usePlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import NumberInlineField from '../components/inline-fields/NumberInlineField';
import useContainerOptions from './hooks/useContainerOptions';
import { useContainerSlotLocation } from './hooks/useContainerSlotLocation';
import DisplayStatusChip, { DisplayStatusChipProps } from './DisplayStatusChip';
import { useTasksByPlantInstance } from '../tasks/hooks/useTasks';

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
  subPlantInstance?: PlantInstance;
  onSlotChange: (slot: BaseSlot) => Promise<Container | undefined>;
}

function hasPlant(data: Partial<PlantInstance>): data is Partial<PlantInstance> & { plant: PlantInstance['plant'] } {
  return data.plant !== undefined;
}

const ContainerSlotView = ({
  id,
  index,
  type,
  container,
  slot,
  plantInstance,
  subPlantInstance,
  onSlotChange
}: ContainerSlotViewProps) => {
  const navigate = useNavigate();

  const isSmallScreen = useSmallScreen();

  const [version, setVersion] = useState(0);
  const [showTransplantedModal, setShowTransplantedModal] = useState(false);
  const [transplantedDate, setTransplantedDate] = useState<Date>(getMidnight());

  const plants = usePlants();

  const addPlantInstance = useAddPlantInstance();
  const updatePlantInstance = useUpdatePlantInstance();

  const path = useMemo(() => (id ? `/container/${id}/slot/${index}` : undefined), [id, index]);
  const subPlantTasks = useTasksByPlantInstance(subPlantInstance?._id);

  const slotLocation = useContainerSlotLocation(id, index, type === 'sub-slot');

  const [transplantedToContainerId, setTransplantedToContainerId] = useState<string | null>(null);

  useEffect(() => {
    setTransplantedToContainerId(null);
  }, [slot]);

  const [showHowManyPlanted, setShowHowManyPlanted] = useState(false);
  const [plantedCount, setPlantedCount] = useState(1);
  const [plantedDate, setPlantedDate] = useState<Date>(getMidnight());

  const [showHarvestedDialogue, setShowHarvestedDialogue] = useState(false);
  const [harvestedDate, setHarvestedDate] = useState<Date>(getMidnight());

  const plantedEvent = useMemo(() => plantInstance?.history?.[0], [plantInstance]);

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
      onSlotChange(newSlot).finally(() => {
        setVersion(version + 1);
      });
    },
    [onSlotChange, slot, version]
  );

  const onPlantInstanceChange = useCallback(
    (data: Partial<PlantInstance>) => {
      if (!plantInstance) {
        if (!hasPlant(data)) {
          return;
        }

        const newPlantInstance: Omit<PlantInstance, '_id'> = {
          ...data,
          containerId: id,
          slotId: index,
          subSlot: type === 'sub-slot',
          created: new Date(),
          plantedCount: 1,
          startedFrom: container.startedFrom ?? STARTED_FROM_TYPE_SEED
        };

        addPlantInstance(newPlantInstance).then((createdPlantInstance) => {
          setVersion(version + 1);
          if (createdPlantInstance) {
            updateSlot({ plantInstanceId: createdPlantInstance._id });
          }
        });
        return;
      }

      const newPlantInstance: PlantInstance = {
        ...plantInstance,
        ...data
      };

      updatePlantInstance(newPlantInstance).finally(() => {
        setVersion(version + 1);
      });
    },
    [addPlantInstance, container.startedFrom, id, index, plantInstance, type, updatePlantInstance, updateSlot, version]
  );

  const updatePictures = useCallback(
    (pictures: PictureData[]) => {
      onPlantInstanceChange({ pictures });
    },
    [onPlantInstanceChange]
  );

  const updateComments = useCallback(
    (comments: Comment[], pictures?: PictureData[]) => {
      if (pictures) {
        onPlantInstanceChange({ comments, pictures });
        return;
      }
      onPlantInstanceChange({ comments });
    },
    [onPlantInstanceChange]
  );

  const title = useMemo(() => getSlotTitle(index, container?.rows), [container?.rows, index]);

  const plant = useMemo(
    () => plants.find((otherPlant) => otherPlant._id === plantInstance?.plant),
    [plants, plantInstance?.plant]
  );
  const subPlant = useMemo(
    () => plants.find((otherPlant) => otherPlant._id === subPlantInstance?.plant),
    [plants, subPlantInstance?.plant]
  );

  const updatePlant = useCallback(
    (value: Plant | null) => {
      onPlantInstanceChange({ plant: value?._id ?? null });
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
    setPlantedDate(getMidnight());
    setShowHowManyPlanted(true);
    handleMoreMenuClose();
  }, []);

  const onTransplantClick = useCallback(() => {
    setTransplantedDate(getMidnight());
    setShowTransplantedModal(true);
    handleMoreMenuClose();
  }, []);

  const onHarvestClick = useCallback(() => {
    setHarvestedDate(getMidnight());
    setShowHarvestedDialogue(true);
    handleMoreMenuClose();
  }, []);

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

  const finishUpdateStatusPlanted = useCallback(() => {
    onPlantInstanceChange({
      history: [
        {
          status: PLANTED,
          date: plantedDate,
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
  }, [id, index, onPlantInstanceChange, plantedCount, plantedDate, type]);

  const finishUpdateStatusHarvested = useCallback(() => {
    onPlantInstanceChange({
      history: [
        ...(plantInstance?.history ?? []),
        {
          status: HARVESTED,
          date: transplantedDate,
          from: {
            containerId: id,
            slotId: index,
            subSlot: type === 'sub-slot'
          }
        }
      ]
    });
    setShowHarvestedDialogue(false);
  }, [id, index, onPlantInstanceChange, plantInstance?.history, transplantedDate, type]);

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
    } else {
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
                      {plant && !plantedEvent ? (
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
                            <AgricultureIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="primary.main">Harvest</Typography>
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
                    </Menu>
                  </Box>
                ) : (
                  <Box key="large-screen-actions" sx={{ display: 'flex', gap: 1.5 }}>
                    {plant && !plantedEvent ? (
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
                    {plantedEvent && displayStatus !== 'Transplanted' ? (
                      <Button
                        variant="outlined"
                        aria-label="harvest"
                        color="primary"
                        onClick={onHarvestClick}
                        title="Harvest"
                      >
                        <AgricultureIcon sx={{ mr: 1 }} fontSize="small" />
                        Harvest
                      </Button>
                    ) : null}
                    {plantedEvent ? (
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
          options={plants}
          onChange={updatePlant}
          renderer={renderPlant}
          sx={{ mt: 1 }}
        />
        <DrawerInlineSelect
          label="Started From"
          value={plantInstance?.startedFrom}
          defaultValue="Seed"
          required
          options={STARTED_FROM_TYPES}
          onChange={updateStartedFrom}
          renderer={renderStartedFrom}
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
        <PicturesView
          key="container-slot-view-pictures"
          pictures={plantInstance?.pictures}
          comments={plantInstance?.comments}
          alt={title}
          onChange={updatePictures}
        />
        <CommentsView
          id={`container-${id}-slot-${index}`}
          comments={plantInstance?.comments}
          alt={title}
          pictures={plantInstance?.pictures}
          onChange={updateComments}
        />
      </Box>
      <Dialog open={showHowManyPlanted} onClose={() => setShowHowManyPlanted(false)} maxWidth="xs" fullWidth>
        <DialogTitle>How many did you plant?</DialogTitle>
        <DialogContent>
          <form name="plant-modal-form" onSubmit={finishUpdateStatusPlanted} noValidate>
            <NumberTextField
              label="Count"
              value={plantedCount}
              onChange={setPlantedCount}
              required
              variant="outlined"
            />
            <Box sx={{ display: 'flex', pt: 2 }}>
              <MobileDatePicker
                label="Planted On"
                value={plantedDate}
                onChange={(newPlantedDate: Date | null) =>
                  newPlantedDate && setPlantedDate(setToMidnight(newPlantedDate))
                }
                renderInput={(params) => (
                  <MuiTextField {...params} className="planted-dateTimeInput" sx={{ flexGrow: 1 }} />
                )}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHowManyPlanted(false)}>Cancel</Button>
          <Button onClick={finishUpdateStatusPlanted} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
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
      <Dialog open={showHarvestedDialogue} onClose={() => setShowHarvestedDialogue(false)} maxWidth="xs" fullWidth>
        <DialogTitle>When did you harvest?</DialogTitle>
        <DialogContent>
          <form name="plant-modal-form" onSubmit={finishUpdateStatusHarvested} noValidate>
            <Box sx={{ display: 'flex', pt: 2 }}>
              <MobileDatePicker
                label="Harvested On"
                value={harvestedDate}
                onChange={(newHarvestedDate: Date | null) =>
                  newHarvestedDate && setHarvestedDate(setToMidnight(newHarvestedDate))
                }
                renderInput={(params) => (
                  <MuiTextField {...params} className="harvested-dateTimeInput" sx={{ flexGrow: 1 }} />
                )}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHarvestedDialogue(false)}>Cancel</Button>
          <Button onClick={finishUpdateStatusHarvested} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContainerSlotView;
