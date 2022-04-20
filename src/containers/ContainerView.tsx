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
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ContainerSlotPreview from './ContainerSlotPreview';
import { Plant } from '../interface';
import { usePlants } from '../plants/usePlants';
import Breadcrumbs from '../components/Breadcrumbs';
import Loading from '../components/Loading';
import { useContainer, useRemoveContainer } from './hooks/useContainers';
import ContainerEditModal from './ContainerEditModal';

const ContainerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const storedOrientation = window.localStorage.getItem(`container-${id}-orientation`);
    if (storedOrientation && (storedOrientation === 'portrait' || storedOrientation === 'landscape')) {
      setOrientation(storedOrientation);
    }
  }, [id]);

  const removeContainer = useRemoveContainer();

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

  const handleOnDelete = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
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

  const handleRotate = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      const newOrientation = orientation === 'portrait' ? 'landscape' : 'portrait';
      setOrientation(newOrientation);
      window.localStorage.setItem(`container-${id}-orientation`, newOrientation);
    },
    [id, orientation]
  );

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
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}
            onClick={handleEditOpen}
          >
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
                  <>
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
                  </>
                )
              }}
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
              {isSmallScreen ? (
                <Box sx={{ display: 'flex', ml: 1, gap: 0.5 }}>
                  <IconButton
                    aria-label="rotate"
                    color="info"
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
                    aria-label="delete"
                    color="error"
                    size="small"
                    onClick={handleOnDelete}
                    title="Delete container"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', ml: 2, gap: 1.5 }}>
                  <Button variant="outlined" color="primary" onClick={handleRotate} title="Rotate">
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
                  <Button variant="outlined" color="error" onClick={handleOnDelete} title="Delete task">
                    <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
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
    </>
  );
};

export default ContainerView;
