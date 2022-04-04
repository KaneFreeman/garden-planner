import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ContainersCollection } from '../../api/Containers';
import { Plant, PlantsCollection } from '../../api/Plants';
import useScreenOrientation from '../../hooks/useOrientation';
import ContainerSlotPreview from './ContainerSlotPreview';

const ContainerView = () => {
  const { id } = useParams();
  const orientation = useScreenOrientation();
  const navigate = useNavigate();

  const container = useTracker(() => ContainersCollection.findOne(id), [id]);
  const plants = useTracker(() => PlantsCollection.find().fetch(), []);
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

  const isPortrait = useMemo(() => orientation.startsWith('portrait'), [orientation]);

  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    if (id) {
      ContainersCollection.remove(id);
      navigate('/containers');
    }
  }, [id, navigate]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

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
      if (plantId !== undefined) {
        plant = plantsById[plantId];
      }

      return (
        <ContainerSlotPreview
          key={`container-slot-${finalIndex}`}
          plant={plant}
          slot={slot}
          id={id}
          index={finalIndex}
        />
      );
    });
  }, [container, id, isPortrait, plantsById]);

  if (!container) {
    return (
      <Box sx={{ width: '100%', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 2, flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {container.name}
            <Typography variant="subtitle1" component="span" sx={{ ml: 1 }} color="GrayText">
              {container.rows} x {container.columns}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={{ ml: 1 }}
                onClick={handleOnDelete}
                title="Delete picture"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
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
        onClose={handleOnClose}
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
          <Button onClick={handleOnClose} color="primary" autoFocus>
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

export default ContainerView;
