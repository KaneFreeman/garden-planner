/* eslint-disable react/no-array-index-key */
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Box, Typography, CircularProgress } from '@mui/material';
import { PlantsCollection } from '../../api/Plants';
import { Picture } from '../../api/Common';
import PicturesView from '../components/pictures/PicturesView';

const PlantView = () => {
  const { id } = useParams();

  const plant = useTracker(() => PlantsCollection.findOne(id), [id]);

  console.log('plant', plant);

  const updatePictures = useCallback(
    (pictures: Picture[]) => {
      if (id && plant) {
        PlantsCollection.update(id, {
          $set: {
            pictures
          }
        });
      }
    },
    [id, plant]
  );

  if (!plant) {
    return (
      <Box sx={{ width: '100%', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {plant.name}
      </Typography>
      <PicturesView pictures={plant.pictures} alt={plant.name} onChange={updatePictures} />
    </Box>
  );
};

export default PlantView;
