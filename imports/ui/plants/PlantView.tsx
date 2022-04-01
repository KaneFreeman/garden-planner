/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Plant, PlantsCollection } from '../../api/Plants';
import { Picture } from '../../api/Common';
import PicturesView from '../components/pictures/PicturesView';
import TextInlineField from '../components/inline-fields/TextInlineField';

const PlantView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const plant = useTracker(() => PlantsCollection.findOne(id), [id]);

  const updatePlant = useCallback(
    (data: Partial<Plant>) => {
      if (id) {
        PlantsCollection.update(id, { $set: data });
      }
    },
    [id]
  );

  const [deleting, setDeleting] = useState(false);

  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    if (id) {
      PlantsCollection.remove(id);
      navigate('/plants');
    }
  }, [id, navigate]);
  const handleOnClose = useCallback(() => setDeleting(false), []);

  const updatePictures = useCallback((pictures: Picture[]) => updatePlant({ pictures }), [updatePlant]);

  const onUrlClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      if (plant?.url !== undefined) {
        window.location.href = plant.url;
      }
    },
    [plant]
  );

  if (!plant) {
    return (
      <Box sx={{ width: '100%', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 2, width: '100%' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {plant.name}
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
        </Typography>
        <TextInlineField
          label="Url"
          value={plant.url}
          onChange={(value) => updatePlant({ url: value })}
          renderer={(value) =>
            value ? (
              <Button variant="text" onClick={onUrlClick}>
                {value}
              </Button>
            ) : null
          }
        />
        <PicturesView pictures={plant.pictures} alt={plant.name} onChange={updatePictures} />
      </Box>
      <Dialog
        open={deleting}
        onClose={handleOnClose}
        aria-labelledby="deleting-plant-title"
        aria-describedby="deleting-plant-description"
      >
        <DialogTitle id="deleting-plant-title">Delete plant</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-plant-description">
            Are you sure you want to delete this plant?
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

export default PlantView;
