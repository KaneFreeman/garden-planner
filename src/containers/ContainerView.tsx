/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import useMediaQuery from '@mui/material/useMediaQuery';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import MuiTextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import YardIcon from '@mui/icons-material/Yard';
import ContainerSlotPreview from './ContainerSlotPreview';
import { FERTILIZE, Plant } from '../interface';
import { usePlants } from '../plants/usePlants';
import Breadcrumbs from '../components/Breadcrumbs';
import Loading from '../components/Loading';
import { useContainer, useFertilizeContainer, useRemoveContainer } from './hooks/useContainers';
import ContainerEditModal from './ContainerEditModal';
import { useTasksByContainer } from '../tasks/hooks/useTasks';

const ContainerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');
  const isSmallScreen = useMediaQuery('(max-width:600px)');

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
    const storedOrientation = window.localStorage.getItem(`container-${id}-orientation`);
    if (storedOrientation && (storedOrientation === 'portrait' || storedOrientation === 'landscape')) {
      setOrientation(storedOrientation);
    }
  }, [id]);

  const removeContainer = useRemoveContainer();
  const fertilizeContainer = useFertilizeContainer(id);

  const container = useContainer(id);
  const plants = usePlants();
  const plantsById = useMemo(
    () =>
      plants.reduce((plantsLookup, plant) => {
        const newPlantsLookup = plantsLookup;
        if (plant._id !== undefined) {
          newPlantsLookup[plant._id] = plant;
        }
        return newPlantsLookup;
      }, {} as Record<string, Plant>),
    [plants]
  );

  const isPortrait = useMemo(() => orientation === 'portrait', [orientation]);

  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => {
    handleMoreMenuClose();
    setDeleting(true);
  }, []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    if (id) {
      removeContainer(id);
      navigate('/containers');
    }
  }, [id, navigate, removeContainer]);
  const handleDeleteOnClose = useCallback(() => setDeleting(false), []);

  const [editing, setEditing] = useState(false);
  const handleEditOpen = useCallback(() => setEditing(true), []);
  const handleEditClose = useCallback(() => setEditing(false), []);

  const tasks = useTasksByContainer(id);
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
  const [fertilizeDate, setFertilizeDate] = useState<Date>(new Date());
  const handleFertilizeClose = useCallback(() => setIsFertilizeModalOpen(false), []);
  const handleFertilizeConfirm = useCallback(() => {
    fertilizeContainer(fertilizeDate);
    setIsFertilizeModalOpen(false);
  }, [fertilizeContainer, fertilizeDate]);
  const handleOnFertilizeClick = useCallback(() => {
    handleMoreMenuClose();
    setFertilizeDate(new Date());
    setIsFertilizeModalOpen(true);
  }, []);

  const handleRotate = useCallback(() => {
    const newOrientation = orientation === 'portrait' ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
    window.localStorage.setItem(`container-${id}-orientation`, newOrientation);
  }, [id, orientation]);

  const slots = useMemo(() => {
    if (!id || !container) {
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
      const plantId = slot?.plant;
      let plant: Plant | undefined;
      if (plantId !== undefined && plantId !== null) {
        plant = plantsById[plantId];
      }

      let subPlant: Plant | undefined;
      const subPlantId = slot?.subSlot?.plant;
      if (subPlantId !== undefined && subPlantId !== null) {
        subPlant = plantsById[subPlantId];
      }

      return (
        <ContainerSlotPreview
          key={`container-slot-${finalIndex}`}
          plant={plant}
          slot={slot}
          container={container}
          id={id}
          index={finalIndex}
          subSlot={slot?.subSlot}
          subPlant={subPlant}
        />
      );
    });
  }, [container, id, isPortrait, plantsById]);

  if (!container || container._id !== id) {
    return <Loading />;
  }

  return (
    <>
      <Box sx={{ p: 2, flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
          <Breadcrumbs
            trail={[
              {
                to: `/containers`,
                label: 'Containers'
              }
            ]}
          >
            {{
              current: (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}
                  onClick={handleEditOpen}
                >
                  <Box
                    sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                    title={container.name}
                  >
                    {container.name}
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
              actions: (
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
                      <Button variant="outlined" color="error" onClick={handleOnDelete} title="Delete container">
                        <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                        Delete
                      </Button>
                    </Box>
                  )}
                </Box>
              )
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
                <MobileDateTimePicker
                  label="Fertilized On"
                  value={fertilizeDate}
                  onChange={(newFertilizeDate: Date | null) => newFertilizeDate && setFertilizeDate(newFertilizeDate)}
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
