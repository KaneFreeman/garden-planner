import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import GrassIcon from '@mui/icons-material/Grass';
import HomeIcon from '@mui/icons-material/Home';
import LockIcon from '@mui/icons-material/Lock';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
import { CONTAINER_TYPE_INSIDE, Container, FERTILIZE, PLANT, PLANTED, Plant, Slot } from '../interface';
import {
  useBulkReopenClosePlantInstances,
  usePlantInstancesById,
  useUpdatePlantInstanceTasksInContainer
} from '../plant-instances/hooks/usePlantInstances';
import { usePlantsById } from '../plants/usePlants';
import { generateTagColor } from '../utility/color.util';
import useSmallScreen from '../utility/smallScreen.util';
import ContainerEditModal from './ContainerEditModal';
import ContainerSlotPreview from './ContainerSlotPreview';
import { useRemoveContainer, useUpdateContainer } from './hooks/useContainers';

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

  const [selectedPlantInstance, setSelectedPlantInstance] = useState<string | null>(null);

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
        .filter((pi) => !pi?.closed && pi.history?.find((h) => h.status === PLANTED))
        .map((pi) => pi._id),
    [plantInstancesById]
  );
  const plantableInstanceIds = useMemo(
    () =>
      Object.values(plantInstancesById)
        .filter((pi) => !pi?.closed && !pi.history?.find((h) => h.status === PLANTED))
        .map((pi) => pi._id),
    [plantInstancesById]
  );
  const closableInstanceIds = useMemo(
    () =>
      Object.values(plantInstancesById)
        .filter((pi) => !pi?.closed)
        .map((pi) => pi._id),
    [plantInstancesById]
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
    setSelectedPlantInstance(null);
  }, []);
  const handleFertilizeConfirm = useCallback(
    (fertilizeDate: Date) => {
      if (selectedPlantInstance == null) {
        return;
      }
      fertilizeContainer(fertilizeDate, [selectedPlantInstance]);
      setIsFertilizeModalOpen(false);
      setSelectedPlantInstance(null);
    },
    [fertilizeContainer, selectedPlantInstance]
  );
  const handleFertilize = useCallback(() => {
    handleMoreMenuClose();
    setIsFertilizeModalOpen(true);
  }, []);

  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const handlePlantClose = useCallback(() => {
    setIsPlantModalOpen(false);
    setSelectedPlantInstance(null);
  }, []);
  const handlePlantConfirm = useCallback(
    (plantDate: Date) => {
      if (selectedPlantInstance == null) {
        return;
      }
      plantContainer(plantDate, [selectedPlantInstance]);
      setIsPlantModalOpen(false);
      setSelectedPlantInstance(null);
    },
    [plantContainer, selectedPlantInstance]
  );
  const handlePlant = useCallback(() => {
    handleMoreMenuClose();
    setIsPlantModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    if (selectedPlantInstance == null) {
      return;
    }
    bulkReopenClosePlantInstances('close', [selectedPlantInstance]);
    handleMoreMenuClose();
    setSelectedPlantInstance(null);
  }, [bulkReopenClosePlantInstances, selectedPlantInstance]);

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

      setSelectedPlantInstance(slot.plantInstanceId);

      switch (mode) {
        case 'plant':
          handlePlant();
          break;
        case 'fertilize':
          handleFertilize();
          break;
        case 'close':
          handleClose();
          break;
      }
    },
    [container._id, handleClose, handleFertilize, handlePlant, mode, navigate, onSlotClick]
  );

  const handleOnArchiveUnarchiveClick = useCallback(
    (archived: boolean) => () => {
      updateContainer({
        ...container,
        archived
      });
    },
    [container, updateContainer]
  );

  const handleRotate = useCallback(() => {
    const newOrientation = orientation === 'portrait' ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
    window.localStorage.setItem(`container-${container._id}-orientation`, newOrientation);
  }, [container._id, orientation]);

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

      let subPlant: Plant | undefined;
      let subPlantInstance = slot?.subSlot?.plantInstanceId
        ? plantInstancesById[slot?.subSlot?.plantInstanceId]
        : undefined;

      if (subPlantInstance?.closed === true) {
        subPlantInstance = undefined;
      }

      const subPlantId = subPlantInstance ? subPlantInstance.plant : slot?.subSlot?.plant;
      if (subPlantId !== undefined && subPlantId !== null) {
        subPlant = plantsById[subPlantId];
      }

      return (
        <ContainerSlotPreview
          key={`container-slot-${finalIndex}`}
          plant={plant}
          slot={slot}
          container={container}
          index={finalIndex}
          subSlot={slot?.subSlot}
          subPlant={subPlant}
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
  }, [actionableInstanceIds, container, isPortrait, handleSlotClick, plantInstancesById, plantsById]);

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
                        id="basic-menu"
                        anchorEl={moreMenuAnchorElement}
                        open={moreMenuOpen}
                        onClose={handleMoreMenuClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button'
                        }}
                      >
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
                      <Button
                        key="archive-button"
                        variant="outlined"
                        color="warning"
                        onClick={handleOnArchiveUnarchiveClick(!container.archived)}
                        title={`${container.archived ? 'Archive' : 'Unarchive'} container`}
                      >
                        {container.archived ? (
                          <Box
                            key="unarchive"
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <UnarchiveIcon color="warning" fontSize="small" />
                            Unarchive
                          </Box>
                        ) : (
                          <Box
                            key="archive"
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <ArchiveIcon color="warning" fontSize="small" />
                            Archive
                          </Box>
                        )}
                      </Button>
                      <Button
                        key="delete-button"
                        variant="outlined"
                        color="error"
                        onClick={handleOnDelete}
                        title="Delete container"
                      >
                        <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                        Delete
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : null
            }}
          </Breadcrumbs>
          <Box sx={{ mt: 1, mb: 1 }}>
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
              maxHeight: 'calc(100dvh - 128px)',
              boxSizing: 'border-box'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: (isPortrait ? container.rows : (container.columns ?? 1)) * 80 + 4,
                height: (isPortrait ? container.columns : (container.rows ?? 1)) * 80 + 4
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${isPortrait ? container.rows : container.columns}, minmax(0, 1fr))`,
                  width: (isPortrait ? container.rows : (container.columns ?? 1)) * 80,
                  height: (isPortrait ? container.columns : (container.rows ?? 1)) * 80,
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
