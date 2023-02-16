/* eslint-disable react/jsx-props-no-spreading */
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import GrassIcon from '@mui/icons-material/Grass';
import HomeIcon from '@mui/icons-material/Home';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ParkIcon from '@mui/icons-material/Park';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
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
import Typography from '@mui/material/Typography';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import DateDialog from '../components/DateDialog';
import { Container, CONTAINER_TYPE_INSIDE, FERTILIZE, PLANT, Plant, Slot } from '../interface';
import { useBulkReopenClosePlantInstances, usePlantInstancesById } from '../plant-instances/hooks/usePlantInstances';
import { usePlantsById } from '../plants/usePlants';
import { useTasksByContainer } from '../tasks/hooks/useTasks';
import { getMidnight } from '../utility/date.util';
import useSmallScreen from '../utility/smallScreen.util';
import ContainerEditModal from './ContainerEditModal';
import ContainerSlotPreview from './ContainerSlotPreview';
import { useRemoveContainer, useUpdateContainer, useUpdateContainerTasks } from './hooks/useContainers';

interface ContainerViewProperties {
  container: Container;
  readonly?: boolean;
  titleRenderer?: (defaultTitle: string) => ReactNode;
  onSlotClick: (slot: Slot | undefined, index: number) => void;
}

const ContainerView = ({ container, readonly, titleRenderer, onSlotClick }: ContainerViewProperties) => {
  const navigate = useNavigate();
  const [selectedPlantInstances, setSelectedPlantInstances] = useState<string[]>([]);

  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');
  const isSmallScreen = useSmallScreen();

  const [searchParams] = useSearchParams();
  const backLabel = searchParams.get('backLabel');
  const backPath = searchParams.get('backPath');

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

  useEffect(() => {
    const storedOrientation = window.localStorage.getItem(`container-${container._id}-orientation`);
    if (storedOrientation && (storedOrientation === 'portrait' || storedOrientation === 'landscape')) {
      setOrientation(storedOrientation);
    }
  }, [container._id]);

  const updateContainer = useUpdateContainer();
  const removeContainer = useRemoveContainer();
  const fertilizeContainer = useUpdateContainerTasks(container._id, FERTILIZE);
  const plantContainer = useUpdateContainerTasks(container._id, PLANT);

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

  const tasks = useTasksByContainer(container._id);
  const hasActiveFertilizeTasks = useMemo(() => {
    if (tasks.overdue.length > 0) {
      return Boolean(
        tasks.overdue.find(
          (task) =>
            (selectedPlantInstances.length === 0 ||
              (task.plantInstanceId && selectedPlantInstances.includes(task.plantInstanceId))) &&
            task.type === FERTILIZE
        )
      );
    }

    if (tasks.thisWeek.length > 0) {
      return Boolean(
        tasks.thisWeek.find(
          (task) =>
            (selectedPlantInstances.length === 0 ||
              (task.plantInstanceId && selectedPlantInstances.includes(task.plantInstanceId))) &&
            task.type === FERTILIZE
        )
      );
    }

    if (tasks.active.length > 0) {
      return Boolean(
        tasks.active.find(
          (task) =>
            (selectedPlantInstances.length === 0 ||
              (task.plantInstanceId && selectedPlantInstances.includes(task.plantInstanceId))) &&
            task.type === FERTILIZE
        )
      );
    }

    return false;
  }, [selectedPlantInstances, tasks.active, tasks.overdue, tasks.thisWeek]);

  const hasActivePlantTasks = useMemo(() => {
    if (tasks.overdue.length > 0) {
      return Boolean(
        tasks.overdue.find(
          (task) =>
            (selectedPlantInstances.length === 0 ||
              (task.plantInstanceId && selectedPlantInstances.includes(task.plantInstanceId))) &&
            task.type === PLANT
        )
      );
    }

    if (tasks.thisWeek.length > 0) {
      return Boolean(
        tasks.thisWeek.find(
          (task) =>
            (selectedPlantInstances.length === 0 ||
              (task.plantInstanceId && selectedPlantInstances.includes(task.plantInstanceId))) &&
            task.type === PLANT
        )
      );
    }

    if (tasks.active.length > 0) {
      return Boolean(
        tasks.active.find(
          (task) =>
            (selectedPlantInstances.length === 0 ||
              (task.plantInstanceId && selectedPlantInstances.includes(task.plantInstanceId))) &&
            task.type === PLANT
        )
      );
    }

    return false;
  }, [selectedPlantInstances, tasks.active, tasks.overdue, tasks.thisWeek]);

  const reopenablePlantInstances = useMemo(
    () => selectedPlantInstances.filter((plantInstanceId) => plantInstancesById[plantInstanceId]?.closed),
    [plantInstancesById, selectedPlantInstances]
  );

  const closablePlantInstances = useMemo(
    () => selectedPlantInstances.filter((plantInstanceId) => !plantInstancesById[plantInstanceId]?.closed),
    [plantInstancesById, selectedPlantInstances]
  );

  const bulkReopenClosePlantInstances = useBulkReopenClosePlantInstances();

  const [isFertilizeModalOpen, setIsFertilizeModalOpen] = useState(false);
  const [fertilizeDate, setFertilizeDate] = useState<Date>(getMidnight());
  const handleFertilizeClose = useCallback(() => setIsFertilizeModalOpen(false), []);
  const handleFertilizeConfirm = useCallback(() => {
    fertilizeContainer(fertilizeDate, selectedPlantInstances.length > 0 ? selectedPlantInstances : undefined);
    setIsFertilizeModalOpen(false);
    setTimeout(() => {
      setSelectedPlantInstances([]);
    }, 250);
  }, [fertilizeContainer, fertilizeDate, selectedPlantInstances]);
  const handleOnFertilizeClick = useCallback(() => {
    handleMoreMenuClose();
    setFertilizeDate(getMidnight());
    setIsFertilizeModalOpen(true);
  }, []);

  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [plantDate, setPlantDate] = useState<Date>(getMidnight());
  const handlePlantClose = useCallback(() => setIsPlantModalOpen(false), []);
  const handlePlantConfirm = useCallback(() => {
    plantContainer(plantDate, selectedPlantInstances.length > 0 ? selectedPlantInstances : undefined);
    setIsPlantModalOpen(false);
    setTimeout(() => {
      setSelectedPlantInstances([]);
    }, 250);
  }, [plantContainer, plantDate, selectedPlantInstances]);
  const handleOnPlantClick = useCallback(() => {
    handleMoreMenuClose();
    setPlantDate(getMidnight());
    setIsPlantModalOpen(true);
  }, []);

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

  const handleSelectToggle = useCallback((plantInstanceId: string) => {
    setSelectedPlantInstances((oldSelectedPlantInstances) => {
      const newSelectedPlantInstances = [...oldSelectedPlantInstances];
      const index = newSelectedPlantInstances.indexOf(plantInstanceId);
      if (index >= 0) {
        newSelectedPlantInstances.splice(index, 1);
        return newSelectedPlantInstances;
      }

      newSelectedPlantInstances.push(plantInstanceId);
      return newSelectedPlantInstances;
    });
  }, []);

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

      const isSelected = Boolean(slot?.plantInstanceId && selectedPlantInstances.includes(slot.plantInstanceId));

      return (
        <ContainerSlotPreview
          key={`container-slot-${finalIndex}`}
          plant={plant}
          slot={slot}
          slotSelected={isSelected}
          container={container}
          index={finalIndex}
          subSlot={slot?.subSlot}
          subPlant={subPlant}
          isSelecting={selectedPlantInstances.length > 0}
          onSlotClick={onSlotClick}
          onSlotSelect={handleSelectToggle}
        />
      );
    });
  }, [container, handleSelectToggle, isPortrait, onSlotClick, plantInstancesById, plantsById, selectedPlantInstances]);

  const onReopen = useCallback(() => {
    bulkReopenClosePlantInstances('reopen', reopenablePlantInstances);
    handleMoreMenuClose();
    setTimeout(() => {
      setSelectedPlantInstances([]);
    }, 250);
  }, [bulkReopenClosePlantInstances, reopenablePlantInstances]);

  const onClose = useCallback(() => {
    bulkReopenClosePlantInstances('close', closablePlantInstances);
    handleMoreMenuClose();
    setTimeout(() => {
      setSelectedPlantInstances([]);
    }, 250);
  }, [bulkReopenClosePlantInstances, closablePlantInstances]);

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
                        {hasActivePlantTasks ? (
                          <MenuItem key="plant-mobile-button" onClick={handleOnPlantClick}>
                            <ListItemIcon>
                              <GrassIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <Typography color="success.main">Plant</Typography>
                          </MenuItem>
                        ) : null}
                        {hasActiveFertilizeTasks ? (
                          <MenuItem key="fertlize-mobile-button" color="primary" onClick={handleOnFertilizeClick}>
                            <ListItemIcon>
                              <YardIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <Typography color="primary">Fertilze</Typography>
                          </MenuItem>
                        ) : null}
                        {selectedPlantInstances.length === 0 ? (
                          <>
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
                              <Typography color="warning.main">
                                {container.archived ? 'Unarchive' : 'Archive'}
                              </Typography>
                            </MenuItem>
                            <MenuItem key="delete-mobile-button" onClick={handleOnDelete}>
                              <ListItemIcon>
                                <DeleteIcon color="error" fontSize="small" />
                              </ListItemIcon>
                              <Typography color="error">Delete</Typography>
                            </MenuItem>
                          </>
                        ) : (
                          <>
                            {reopenablePlantInstances.length > 0 ? (
                              <MenuItem key="reopen-mobile-button" onClick={onReopen}>
                                <ListItemIcon>
                                  <LockOpenIcon color="success" fontSize="small" />
                                </ListItemIcon>
                                <Typography color="success.main">Reopen</Typography>
                              </MenuItem>
                            ) : null}
                            {closablePlantInstances.length > 0 ? (
                              <MenuItem key="close-mobile-button" onClick={onClose}>
                                <ListItemIcon>
                                  <LockIcon color="warning" fontSize="small" />
                                </ListItemIcon>
                                <Typography color="warning.main">Close</Typography>
                              </MenuItem>
                            ) : null}
                          </>
                        )}
                      </Menu>
                    </Box>
                  ) : (
                    <Box key="large-screen-actions" sx={{ display: 'flex', gap: 1.5 }}>
                      {hasActivePlantTasks ? (
                        <Button variant="outlined" color="success" onClick={handleOnPlantClick} title="Plant container">
                          <GrassIcon sx={{ mr: 1 }} fontSize="small" />
                          Plant
                        </Button>
                      ) : null}
                      {hasActiveFertilizeTasks ? (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleOnFertilizeClick}
                          title="Fertilize container"
                        >
                          <YardIcon sx={{ mr: 1 }} fontSize="small" />
                          Fertilze
                        </Button>
                      ) : null}
                      {selectedPlantInstances.length === 0 ? (
                        <>
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
                        </>
                      ) : (
                        <>
                          {reopenablePlantInstances.length > 0 ? (
                            <Button
                              key="reopen-button"
                              variant="outlined"
                              aria-label="reopen"
                              color="success"
                              onClick={onReopen}
                              title="Reopen"
                            >
                              <LockOpenIcon sx={{ mr: 1 }} color="success" fontSize="small" />
                              Reopen
                            </Button>
                          ) : null}
                          {closablePlantInstances.length > 0 ? (
                            <Button
                              key="close-button"
                              variant="outlined"
                              aria-label="close"
                              color="warning"
                              onClick={onClose}
                              title="Close"
                            >
                              <LockIcon sx={{ mr: 1 }} color="warning" fontSize="small" />
                              Close
                            </Button>
                          ) : null}
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              ) : null
            }}
          </Breadcrumbs>
          <Box
            sx={{
              display: 'flex',
              mt: 1,
              overflowX: 'auto',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 128px)',
              boxSizing: 'border-box'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: (isPortrait ? container.rows : container.columns ?? 1) * 80 + 4,
                height: (isPortrait ? container.columns : container.rows ?? 1) * 80 + 4
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${isPortrait ? container.rows : container.columns}, minmax(0, 1fr))`,
                  width: (isPortrait ? container.rows : container.columns ?? 1) * 80,
                  height: (isPortrait ? container.columns : container.rows ?? 1) * 80,
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
