/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import MuiTextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import YardIcon from '@mui/icons-material/Yard';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { Container, FERTILIZE, Plant, Slot } from '../interface';
import { usePlantsById } from '../plants/usePlants';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTasksByContainer } from '../tasks/hooks/useTasks';
import { usePlantInstancesById } from '../plant-instances/hooks/usePlantInstances';
import { getMidnight, setToMidnight } from '../utility/date.util';
import useSmallScreen from '../utility/smallScreen.util';
import { useFertilizeContainer, useRemoveContainer, useUpdateContainer } from './hooks/useContainers';
import ContainerSlotPreview from './ContainerSlotPreview';
import ContainerEditModal from './ContainerEditModal';

interface ContainerViewProperties {
  container: Container;
  readonly?: boolean;
  titleRenderer?: (defaultTitle: string) => ReactNode;
  onSlotClick: (slot: Slot | undefined, index: number) => void;
}

const ContainerView = ({ container, readonly, titleRenderer, onSlotClick }: ContainerViewProperties) => {
  const navigate = useNavigate();

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
  const fertilizeContainer = useFertilizeContainer(container._id);

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
      return Boolean(tasks.overdue.find((task) => task.type === FERTILIZE));
    }

    if (tasks.thisWeek.length > 0) {
      return Boolean(tasks.thisWeek.find((task) => task.type === FERTILIZE));
    }

    if (tasks.active.length > 0) {
      return Boolean(tasks.active.find((task) => task.type === FERTILIZE));
    }

    return false;
  }, [tasks]);

  const [isFertilizeModalOpen, setIsFertilizeModalOpen] = useState(false);
  const [fertilizeDate, setFertilizeDate] = useState<Date>(getMidnight());
  const handleFertilizeClose = useCallback(() => setIsFertilizeModalOpen(false), []);
  const handleFertilizeConfirm = useCallback(() => {
    fertilizeContainer(fertilizeDate);
    setIsFertilizeModalOpen(false);
  }, [fertilizeContainer, fertilizeDate]);
  const handleOnFertilizeClick = useCallback(() => {
    handleMoreMenuClose();
    setFertilizeDate(getMidnight());
    setIsFertilizeModalOpen(true);
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
      const plantId = plantInstance?.plant;
      let plant: Plant | undefined;
      if (plantId !== undefined && plantId !== null) {
        plant = plantsById[plantId];
      } else if (slot && slot.plannedPlantId !== null) {
        plant = plantsById[slot.plannedPlantId];
      }

      let subPlant: Plant | undefined;
      const subPlantInstance = slot?.subSlot?.plantInstanceId
        ? plantInstancesById[slot?.subSlot?.plantInstanceId]
        : undefined;
      const subPlantId = subPlantInstance?.plant;
      if (subPlantId !== undefined && subPlantId !== null) {
        subPlant = plantsById[subPlantId];
      } else if (slot?.subSlot && slot.subSlot.plannedPlantId !== null) {
        subPlant = plantsById[slot.subSlot.plannedPlantId];
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
          onSlotClick={onSlotClick}
        />
      );
    });
  }, [container, isPortrait, onSlotClick, plantInstancesById, plantsById]);

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
                    {container.type === 'Inside' ? (
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
                        {hasActiveFertilizeTasks ? (
                          <MenuItem color="primary" onClick={handleOnFertilizeClick}>
                            <ListItemIcon>
                              <YardIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <Typography color="primary">Fertilze</Typography>
                          </MenuItem>
                        ) : null}
                        <MenuItem color="primary" onClick={handleOnArchiveUnarchiveClick(!container.archived)}>
                          <ListItemIcon>
                            {container.archived ? (
                              <UnarchiveIcon color="warning" fontSize="small" />
                            ) : (
                              <ArchiveIcon color="warning" fontSize="small" />
                            )}
                          </ListItemIcon>
                          <Typography color="warning.main">{container.archived ? 'Unarchive' : 'Archive'}</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleOnDelete}>
                          <ListItemIcon>
                            <DeleteIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <Typography color="error">Delete</Typography>
                        </MenuItem>
                      </Menu>
                    </Box>
                  ) : (
                    <Box key="large-screen-actions" sx={{ display: 'flex', gap: 1.5 }}>
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
                      <Button variant="outlined" color="secondary" onClick={handleRotate} title="Rotate">
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
                      <Button variant="outlined" color="error" onClick={handleOnDelete} title="Delete container">
                        <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                        Delete
                      </Button>
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
      {isFertilizeModalOpen ? (
        <Dialog open onClose={handleFertilizeClose} maxWidth="xs" fullWidth>
          <DialogTitle>Fertilize</DialogTitle>
          <DialogContent>
            <form name="plant-modal-form" onSubmit={handleFertilizeConfirm} noValidate>
              <Box sx={{ display: 'flex', pt: 2, pb: 2 }}>
                <MobileDatePicker
                  label="Fertilized On"
                  value={fertilizeDate}
                  onChange={(newFertilizeDate: Date | null) =>
                    newFertilizeDate && setFertilizeDate(setToMidnight(newFertilizeDate))
                  }
                  renderInput={(params) => (
                    <MuiTextField {...params} className="due-dateTimeInput" sx={{ flexGrow: 1 }} />
                  )}
                />
              </Box>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFertilizeClose}>Cancel</Button>
            <Button onClick={handleFertilizeConfirm} variant="contained">
              Fertilize
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default ContainerView;
