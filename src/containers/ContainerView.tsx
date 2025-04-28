import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import GrassIcon from '@mui/icons-material/Grass';
import HomeIcon from '@mui/icons-material/Home';
import LockIcon from '@mui/icons-material/Lock';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import ParkIcon from '@mui/icons-material/Park';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import YardIcon from '@mui/icons-material/Yard';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import React, { MouseEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Chip from '../components/Chip';
import DateDialog from '../components/DateDialog';
import Select from '../components/Select';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { CONTAINER_TYPE_INSIDE, Container, FERTILIZE, PLANT, PLANTED, Plant, Slot } from '../interface';
import {
  useBulkReopenClosePlantInstances,
  usePlantInstancesById,
  useUpdatePlantInstanceTasksInContainer
} from '../plant-instances/hooks/usePlantInstances';
import { usePlantsById } from '../plants/usePlants';
import { generateTagColor } from '../utility/color.util';
import { getTransplantedDate } from '../utility/history.util';
import useSmallScreen from '../utility/smallScreen.util';
import ContainerEditModal from './ContainerEditModal';
import ContainerSlotPreview from './ContainerSlotPreview';
import useContainerOptions from './hooks/useContainerOptions';
import { useFinishPlanningContainer, useRemoveContainer, useUpdateContainer } from './hooks/useContainers';

const MAX_SLOT_WIDTH = 80;
const MIN_SLOT_WIDTH = 50;
const SLOT_BORDER_WIDTH = 4;
const APP_PADDING = 32;

type ActionMode = 'none' | 'plant' | 'fertilize' | 'close';

interface ContainerViewProperties {
  container: Container;
  readonly?: boolean;
  titleRenderer?: (defaultTitle: string) => ReactNode;
  onSlotClick?: (slot: Slot | undefined, otherIndex: number) => void;
}

const ContainerView = ({ container, readonly, titleRenderer, onSlotClick }: ContainerViewProperties) => {
  const navigate = useNavigate();

  const [mode, setMode] = useState<ActionMode>('none');
  const handleModeChange = useCallback((_event: MouseEvent, newMode: ActionMode) => {
    setMode(newMode ?? 'none');
  }, []);

  const [selectedPlantInstances, setSelectedPlantInstances] = useState<string[]>([]);

  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');
  const isSmallScreen = useSmallScreen();

  const [searchParams] = useSearchParams();
  const backLabel = searchParams.get('backLabel');
  const backPath = searchParams.get('backPath');

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

  useEffect(() => {
    const storedOrientation = window.localStorage.getItem(`container-${container._id}-orientation`);
    if (storedOrientation && (storedOrientation === 'portrait' || storedOrientation === 'landscape')) {
      setOrientation(storedOrientation);
    }
  }, [container._id]);

  const updateContainer = useUpdateContainer();
  const removeContainer = useRemoveContainer();
  const finishPlanningContainer = useFinishPlanningContainer(container._id);
  const fertilizeContainer = useUpdatePlantInstanceTasksInContainer(container._id, FERTILIZE);
  const plantContainer = useUpdatePlantInstanceTasksInContainer(container._id, PLANT);

  const plantsById = usePlantsById();
  const plantInstancesById = usePlantInstancesById();

  const isPortrait = useMemo(() => orientation === 'portrait', [orientation]);

  const [deleting, setDeleting] = useState(false);
  const handleOnDelete = useCallback(() => {
    handleMoreMenuClose();
    setDeleting(true);
  }, []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    if (container._id) {
      removeContainer(container._id);
      navigate('/containers');
    }
  }, [container._id, navigate, removeContainer]);
  const handleDeleteOnClose = useCallback(() => setDeleting(false), []);

  const [editing, setEditing] = useState(false);
  const handleEditOpen = useCallback(() => setEditing(true), []);
  const handleEditClose = useCallback(() => setEditing(false), []);

  const fertilizableInstanceIds = useMemo(
    () =>
      Object.values(plantInstancesById)
        .filter(
          (pi) => pi.containerId === container._id && !pi?.closed && pi.history?.find((h) => h.status === PLANTED)
        )
        .map((pi) => pi._id),
    [container._id, plantInstancesById]
  );
  const plantableInstanceIds = useMemo(
    () =>
      Object.values(plantInstancesById)
        .filter(
          (pi) => pi.containerId === container._id && !pi?.closed && !pi.history?.find((h) => h.status === PLANTED)
        )
        .map((pi) => pi._id),
    [container._id, plantInstancesById]
  );
  const transplantableInstanceIds = useMemo(
    () =>
      Object.values(plantInstancesById)
        .filter((pi) => pi.containerId === container._id && !pi?.closed && getTransplantedDate(pi, pi))
        .map((pi) => pi._id),
    [container._id, plantInstancesById]
  );
  const closableInstanceIds = useMemo(
    () =>
      Object.values(plantInstancesById)
        .filter((pi) => pi.containerId === container._id && !pi?.closed)
        .map((pi) => pi._id),
    [container._id, plantInstancesById]
  );

  const actionableInstanceIds = useMemo(() => {
    switch (mode) {
      case 'plant':
        return plantableInstanceIds;
      case 'fertilize':
        return fertilizableInstanceIds;
      case 'close':
        return closableInstanceIds;
      default:
        return undefined;
    }
  }, [closableInstanceIds, fertilizableInstanceIds, mode, plantableInstanceIds]);

  const bulkReopenClosePlantInstances = useBulkReopenClosePlantInstances();

  const [isFertilizeModalOpen, setIsFertilizeModalOpen] = useState(false);
  const handleFertilizeClose = useCallback(() => {
    setIsFertilizeModalOpen(false);
    setSelectedPlantInstances([]);
  }, []);
  const handleFertilizeConfirm = useCallback(
    (fertilizeDate: Date) => {
      if (selectedPlantInstances.length === 0) {
        return;
      }
      fertilizeContainer(fertilizeDate, selectedPlantInstances);
      setIsFertilizeModalOpen(false);
      setSelectedPlantInstances([]);
    },
    [fertilizeContainer, selectedPlantInstances]
  );
  const handleFertilize = useCallback(() => {
    handleMoreMenuClose();
    setIsFertilizeModalOpen(true);
  }, []);

  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const handlePlantClose = useCallback(() => {
    setIsPlantModalOpen(false);
    setSelectedPlantInstances([]);
  }, []);
  const handlePlantConfirm = useCallback(
    (plantDate: Date) => {
      if (selectedPlantInstances.length === 0) {
        return;
      }
      plantContainer(plantDate, selectedPlantInstances);
      setIsPlantModalOpen(false);
      setSelectedPlantInstances([]);
    },
    [plantContainer, selectedPlantInstances]
  );
  const handlePlant = useCallback(() => {
    handleMoreMenuClose();
    setIsPlantModalOpen(true);
  }, []);

  const handleClose = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) {
        return;
      }
      bulkReopenClosePlantInstances('close', ids);
      handleMoreMenuClose();
      setSelectedPlantInstances([]);
    },
    [bulkReopenClosePlantInstances]
  );

  const handleSlotClick = useCallback(
    (slot: Slot | undefined, index: number) => {
      if (onSlotClick) {
        onSlotClick(slot, index);
        return;
      }

      if (mode === 'none') {
        if (container?._id) {
          navigate(`/container/${container._id}/slot/${index}`);
        }
        return;
      }

      if (slot?.plantInstanceId == null) {
        return;
      }

      setSelectedPlantInstances([slot.plantInstanceId]);

      switch (mode) {
        case 'plant':
          if (plantableInstanceIds.includes(slot.plantInstanceId)) {
            handlePlant();
          }
          break;
        case 'fertilize':
          if (fertilizableInstanceIds.includes(slot.plantInstanceId)) {
            handleFertilize();
          }
          break;
        case 'close':
          if (closableInstanceIds.includes(slot.plantInstanceId)) {
            handleClose([slot.plantInstanceId]);
          }
          break;
      }
    },
    [
      closableInstanceIds,
      container._id,
      fertilizableInstanceIds,
      handleClose,
      handleFertilize,
      handlePlant,
      mode,
      navigate,
      onSlotClick,
      plantableInstanceIds
    ]
  );

  const handleOnFertilizeContainerClick = useCallback(() => {
    setSelectedPlantInstances([...fertilizableInstanceIds]);
    handleFertilize();
  }, [fertilizableInstanceIds, handleFertilize]);

  const handleOnArchiveUnarchiveClick = useCallback(
    (archived: boolean) => () => {
      updateContainer({
        ...container,
        archived
      });
    },
    [container, updateContainer]
  );

  const [areYouDonePlanning, setAreYouDonePlanning] = useState(false);
  const handleFinishPlanningClick = useCallback(() => {
    handleMoreMenuClose();
    setAreYouDonePlanning(true);
  }, []);
  const handleFinishPlanningConfirm = useCallback(() => {
    setAreYouDonePlanning(false);
    finishPlanningContainer();
  }, [finishPlanningContainer]);
  const handleFinishPlanningClose = useCallback(() => setAreYouDonePlanning(false), []);

  const [showTransplantedModal, setShowTransplantedModal] = useState(false);
  const [transplantedToContainerId, setTransplantedToContainerId] = useState<string | null>(null);
  const onTransplantClick = useCallback(() => {
    setShowTransplantedModal(true);
    handleMoreMenuClose();
  }, []);
  const finishUpdateStatusTransplanted = useCallback(() => {
    if (transplantedToContainerId !== null) {
      navigate(
        `/container/${container?._id}/bulk-transplant/${transplantedToContainerId}?backPath=${`/container/${container._id}`}&backLabel=${container.name}`
      );
    }
  }, [container._id, container.name, navigate, transplantedToContainerId]);

  const containerOptions = useContainerOptions();
  const onTransplantContainerChange = useCallback(
    (newValue: string | undefined) => {
      if (transplantedToContainerId !== newValue) {
        setTransplantedToContainerId(newValue ?? null);
      }
    },
    [transplantedToContainerId]
  );

  const hasSlotsInPlanning = useMemo(() => {
    if (!container._id || !container.slots) {
      return false;
    }

    const slotIndexes = Object.keys(container.slots);
    for (const slotIndex of slotIndexes) {
      const slot = container.slots[+slotIndex];
      if (!slot) {
        continue;
      }

      if (!slot.plantInstanceId && slot.plant) {
        return true;
      }
    }

    return false;
  }, [container._id, container.slots]);

  const handleRotate = useCallback(() => {
    const newOrientation = orientation === 'portrait' ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
    window.localStorage.setItem(`container-${container._id}-orientation`, newOrientation);
  }, [container._id, orientation]);

  const { width } = useWindowDimensions();
  const slotWidth = useMemo(() => {
    const w =
      Math.floor((width - APP_PADDING) / ((isPortrait ? container.rows : container.columns) ?? 1)) - SLOT_BORDER_WIDTH;

    return Math.min(Math.max(w, MIN_SLOT_WIDTH), MAX_SLOT_WIDTH);
  }, [container.columns, container.rows, isPortrait, width]);

  const slots = useMemo(() => {
    if (!container._id) {
      return [];
    }

    return [...Array(container.rows * container.columns)].map((_, index) => {
      let finalIndex = index;
      if (!isPortrait) {
        finalIndex =
          (container.columns - ((index % container.columns) + 1)) * container.rows +
          Math.floor(index / container.columns);
      }

      const slot = container.slots?.[finalIndex];
      const plantInstance = slot?.plantInstanceId ? plantInstancesById[slot?.plantInstanceId] : undefined;
      const plantId = plantInstance ? plantInstance.plant : slot?.plant;
      let plant: Plant | undefined;
      if (plantId !== undefined && plantId !== null) {
        plant = plantsById[plantId];
      }

      return (
        <ContainerSlotPreview
          key={`container-slot-${finalIndex}`}
          plant={plant}
          slot={slot}
          container={container}
          index={finalIndex}
          size={slotWidth}
          isActionable={
            actionableInstanceIds !== undefined
              ? plantInstance
                ? actionableInstanceIds.includes(plantInstance?._id)
                : false
              : undefined
          }
          onSlotClick={handleSlotClick}
        />
      );
    });
  }, [container, isPortrait, plantInstancesById, slotWidth, actionableInstanceIds, handleSlotClick, plantsById]);

  return (
    <>
      <Box sx={{ p: 2, flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
          <Breadcrumbs
            trail={[
              backLabel && backPath
                ? {
                    to: backPath,
                    label: backLabel
                  }
                : {
                    to: `/containers`,
                    label: 'Containers'
                  }
            ]}
          >
            {{
              current: (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: readonly ? 'default' : 'pointer',
                    width: '100%'
                  }}
                  onClick={!readonly ? handleEditOpen : undefined}
                >
                  <Box
                    sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                    title={container.name}
                  >
                    {titleRenderer ? titleRenderer(container.name) : container.name}
                  </Box>
                  {container.year != null ? (
                    <Chip title={`${container.year}`} colors={generateTagColor(container.year)} sx={{ ml: 1 }}>
                      {container.year}
                    </Chip>
                  ) : null}
                  <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{ ml: 1, display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}
                    color="GrayText"
                  >
                    {container.type === CONTAINER_TYPE_INSIDE ? (
                      <HomeIcon titleAccess="Inside" />
                    ) : (
                      <ParkIcon titleAccess="Inside" />
                    )}
                    {container.rows} x {container.columns}
                  </Typography>
                </Box>
              ),
              actions: !readonly ? (
                <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                  {isSmallScreen ? (
                    <Box key="small-screen-actions" sx={{ display: 'flex' }}>
                      <IconButton
                        key="rotate-mobile-button"
                        aria-label="rotate"
                        color="secondary"
                        size="small"
                        sx={{
                          transition: 'transform 333ms ease-out',
                          transform: `scaleX(${isPortrait ? '-1' : '1'})`
                        }}
                        onClick={handleRotate}
                        title="Rotate container"
                      >
                        <RotateLeftIcon fontSize="small" />
                      </IconButton>
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
                        anchorEl={moreMenuAnchorElement}
                        open={moreMenuOpen}
                        onClose={handleMoreMenuClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button'
                        }}
                      >
                        {fertilizableInstanceIds.length > 0 ? (
                          <MenuItem
                            key="fertlize-mobile-button"
                            color="primary"
                            onClick={handleOnFertilizeContainerClick}
                          >
                            <ListItemIcon>
                              <YardIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <Typography color="primary">Fertilze Container</Typography>
                          </MenuItem>
                        ) : null}
                        {hasSlotsInPlanning ? (
                          <MenuItem key="finish-planning-mobile-button" onClick={handleFinishPlanningClick}>
                            <ListItemIcon>
                              <EditNoteIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <Typography color="primary">Finish Planning</Typography>
                          </MenuItem>
                        ) : null}
                        {transplantableInstanceIds ? (
                          <MenuItem onClick={onTransplantClick}>
                            <ListItemIcon>
                              <MoveDownIcon color="error" fontSize="small" />
                            </ListItemIcon>
                            <Typography color="error.main">Bulk Transplant</Typography>
                          </MenuItem>
                        ) : null}
                        <MenuItem
                          key="archive-mobile-button"
                          color="primary"
                          onClick={handleOnArchiveUnarchiveClick(!container.archived)}
                        >
                          <ListItemIcon>
                            {container.archived ? (
                              <UnarchiveIcon color="warning" fontSize="small" />
                            ) : (
                              <ArchiveIcon color="warning" fontSize="small" />
                            )}
                          </ListItemIcon>
                          <Typography color="warning.main">{container.archived ? 'Unarchive' : 'Archive'}</Typography>
                        </MenuItem>
                        <MenuItem key="delete-mobile-button" onClick={handleOnDelete}>
                          <ListItemIcon>
                            <DeleteIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="error">Delete</Typography>
                        </MenuItem>
                      </Menu>
                    </Box>
                  ) : (
                    <Box key="large-screen-actions" sx={{ display: 'flex', gap: 1.5 }}>
                      <Button
                        key="rotate-button"
                        variant="outlined"
                        color="secondary"
                        onClick={handleRotate}
                        title="Rotate"
                      >
                        <RotateLeftIcon
                          sx={{
                            mr: 1,
                            transition: 'transform 333ms ease-out',
                            transform: `scaleX(${isPortrait ? '-1' : '1'})`
                          }}
                          fontSize="small"
                        />
                        Rotate
                      </Button>
                      {fertilizableInstanceIds.length > 0 ? (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleOnFertilizeContainerClick}
                          title="Fertilize container"
                        >
                          <YardIcon sx={{ mr: 1 }} fontSize="small" />
                          Fertilze Container
                        </Button>
                      ) : null}
                      {hasSlotsInPlanning ? (
                        <Button
                          key="finish-planning-button"
                          variant="outlined"
                          color="primary"
                          onClick={handleFinishPlanningClick}
                          title="Finish planning container"
                        >
                          <EditNoteIcon sx={{ mr: 1 }} fontSize="small" />
                          Finish Planning
                        </Button>
                      ) : null}
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
                        anchorEl={moreMenuAnchorElement}
                        open={moreMenuOpen}
                        onClose={handleMoreMenuClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button'
                        }}
                      >
                        {transplantableInstanceIds ? (
                          <MenuItem onClick={onTransplantClick}>
                            <ListItemIcon>
                              <MoveDownIcon color="error" fontSize="small" />
                            </ListItemIcon>
                            <Typography color="error.main">Bulk Transplant</Typography>
                          </MenuItem>
                        ) : null}
                        <MenuItem
                          key="archive-mobile-button"
                          color="primary"
                          onClick={handleOnArchiveUnarchiveClick(!container.archived)}
                        >
                          <ListItemIcon>
                            {container.archived ? (
                              <UnarchiveIcon color="warning" fontSize="small" />
                            ) : (
                              <ArchiveIcon color="warning" fontSize="small" />
                            )}
                          </ListItemIcon>
                          <Typography color="warning.main">{container.archived ? 'Unarchive' : 'Archive'}</Typography>
                        </MenuItem>
                        <MenuItem key="delete-mobile-button" onClick={handleOnDelete}>
                          <ListItemIcon>
                            <DeleteIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="error">Delete</Typography>
                        </MenuItem>
                      </Menu>
                    </Box>
                  )}
                </Box>
              ) : null
            }}
          </Breadcrumbs>
          <Box sx={{ mt: 1, mb: 1, height: '47px' }}>
            <ToggleButtonGroup value={mode} exclusive onChange={handleModeChange} aria-label="action mode">
              <ToggleButton value="none" sx={{ pl: 3, pr: 3 }}>
                <VisibilityIcon fontSize="small"></VisibilityIcon>
                {!isSmallScreen ? <Typography sx={{ ml: 1 }}>View</Typography> : null}
              </ToggleButton>
              <ToggleButton value="plant" sx={{ pl: 3, pr: 3 }}>
                <GrassIcon color="success" fontSize="small" />
                {!isSmallScreen ? (
                  <Typography sx={{ ml: 1 }} color="success.main">
                    Plant
                  </Typography>
                ) : null}
              </ToggleButton>
              <ToggleButton value="fertilize" sx={{ pl: 3, pr: 3 }}>
                <YardIcon color="primary" fontSize="small" />
                {!isSmallScreen ? (
                  <Typography sx={{ ml: 1 }} color="primary.main">
                    Fertilize
                  </Typography>
                ) : null}
              </ToggleButton>
              <ToggleButton value="close" sx={{ pl: 3, pr: 3 }}>
                <LockIcon color="warning" fontSize="small" />
                {!isSmallScreen ? (
                  <Typography sx={{ ml: 1 }} color="warning.main">
                    Close
                  </Typography>
                ) : null}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box
            sx={{
              display: 'flex',
              mt: 1,
              overflowX: 'auto',
              overflowY: 'auto',
              maxHeight: 'calc(100dvh - 183px)',
              boxSizing: 'border-box'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: ((isPortrait ? container.rows : container.columns) ?? 1) * slotWidth + SLOT_BORDER_WIDTH,
                height: ((isPortrait ? container.columns : container.rows) ?? 1) * slotWidth + SLOT_BORDER_WIDTH
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${isPortrait ? container.rows : container.columns}, minmax(0, 1fr))`,
                  width: ((isPortrait ? container.rows : container.columns) ?? 1) * slotWidth,
                  height: ((isPortrait ? container.columns : container.rows) ?? 1) * slotWidth,
                  border: '2px solid #2c2c2c'
                }}
              >
                {slots}
              </Box>
            </Box>
          </Box>
        </Typography>
      </Box>
      <Dialog
        open={deleting}
        onClose={handleDeleteOnClose}
        aria-labelledby="deleting-container-title"
        aria-describedby="deleting-container-description"
      >
        <DialogTitle id="deleting-container-title">Delete container</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-container-description">
            Are you sure you want to delete this container?
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
      <Dialog
        open={areYouDonePlanning}
        onClose={handleFinishPlanningClose}
        aria-labelledby="finish-planning-container-title"
        aria-describedby="finish-planning-container-description"
      >
        <DialogTitle id="finish-planning-container-title">Finish planning container</DialogTitle>
        <DialogContent>
          <DialogContentText id="finish-planning-container-description">
            Are you sure you are finished planning this container?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFinishPlanningClose} color="secondary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleFinishPlanningConfirm} color="primary">
            Finish Planning
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showTransplantedModal} onClose={() => setShowTransplantedModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Bulk Transplant</DialogTitle>
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTransplantedModal(false)}>Cancel</Button>
          <Button onClick={finishUpdateStatusTransplanted} variant="contained">
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <ContainerEditModal open={editing} container={container} onClose={handleEditClose} />
      <DateDialog
        open={isPlantModalOpen}
        question="When did you plant?"
        label="Plantd On"
        onClose={handlePlantClose}
        onConfirm={handlePlantConfirm}
      />
      <DateDialog
        open={isFertilizeModalOpen}
        question="When did you fertilize?"
        label="Fertilized On"
        onClose={handleFertilizeClose}
        onConfirm={handleFertilizeConfirm}
      />
    </>
  );
};

export default ContainerView;
