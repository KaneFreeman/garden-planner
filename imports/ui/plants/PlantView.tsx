import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Box, Typography, CircularProgress } from '@mui/material';
import { PlantsCollection } from '../../api/Plants';
import PictureUpload from '../components/PictureUpload';
import Picture from '../components/Picture';

const PlantView = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const plant = useTracker(() => PlantsCollection.findOne(id), [id]);

  console.log('plant', plant);

  useEffect(() => {
    if (plant) {
      setLoading(false);
      return () => {};
    }

    if (loading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [loading, plant]);

  const addPicture = useCallback(
    (dataUrl: string) => {
      if (id && plant) {
        PlantsCollection.update(id, { $set: { pictures: [...(plant.pictures ?? []), dataUrl] } });
      }
    },
    [id, plant]
  );

  const removePicture = useCallback(
    (index: number) => {
      if (id && plant) {
        const newPictures = [...(plant.pictures ?? [])];
        newPictures.splice(index, 1);
        PlantsCollection.update(id, { $set: { pictures: newPictures } });
      }
    },
    [id, plant]
  );

  if (!plant) {
    return (
      <Box sx={{ width: '100%', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? <CircularProgress /> : 'No plant found'}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {plant.name}
      </Typography>
      <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
        Pictures
        <PictureUpload onChange={addPicture} />
      </Typography>
      {plant.pictures?.map((picture, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Picture key={`picture-${index}`} picture={picture} alt={plant.name} onDelete={() => removePicture(index)} />
      ))}
    </Box>
  );
};

export default PlantView;
