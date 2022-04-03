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
import { Picture, Comment } from '../../api/Common';
import { Plant, PlantsCollection, PlantType, PLANT_TYPES } from '../../api/Plants';
import PicturesView from '../components/pictures/PicturesView';
import TextInlineField from '../components/inline-fields/TextInlineField';
import DrawerInlineSelect from '../components/inline-fields/DrawerInlineSelect';
import PlantDataView from './PlantDataView';
import CommentsView from '../components/comments/CommentsView';
import NumberRangeInlineField from '../components/inline-fields/NumberRangeInlineField';

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

  const updateComments = useCallback(
    (comments: Comment[], pictures?: Picture[]) => {
      if (pictures) {
        updatePlant({ comments, pictures });
        return;
      }
      updatePlant({ comments });
    },
    [updatePlant]
  );

  const onUrlClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      if (plant?.url !== undefined) {
        window.location.href = plant.url;
      }
    },
    [plant]
  );

  const renderPlantType = useCallback((value: PlantType | undefined) => {
    if (!value) {
      return undefined;
    }

    return {
      primary: value
    };
  }, []);

  if (!plant) {
    return (
      <Box sx={{ width: '100%', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  console.log(plant);

  return (
    <>
      <Box sx={{ p: 2, width: '100%' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextInlineField valueVariant="h6" value={plant.name} onChange={(name) => updatePlant({ name })} />
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
        <DrawerInlineSelect
          label="Type"
          value={plant.type}
          noValueLabel="No plant type"
          options={PLANT_TYPES}
          onChange={(type) => updatePlant({ type })}
          renderer={renderPlantType}
          sx={{ mt: 1 }}
        />
        <TextInlineField
          label="Url"
          value={plant.url}
          onChange={(url) => updatePlant({ url })}
          renderer={(value) =>
            value ? (
              <Button variant="text" onClick={onUrlClick} sx={{ ml: -1 }}>
                {value}
              </Button>
            ) : null
          }
        />
        <NumberRangeInlineField
          label="Days to Maturity"
          value={plant.daysToMaturity}
          onChange={(daysToMaturity) => updatePlant({ daysToMaturity })}
        />
        <PlantDataView type={plant.type} />
        <PicturesView pictures={plant.pictures} comments={plant.comments} alt={plant.name} onChange={updatePictures} />
        <CommentsView comments={plant.comments} alt={plant.name} pictures={plant.pictures} onChange={updateComments} />
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
