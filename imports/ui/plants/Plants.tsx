import React from 'react';
import { useNavigate } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { PlantsCollection } from '../../api/Plants';
import PlantAvatar from './PlantAvatar';

const Plants = () => {
  const navigate = useNavigate();

  const plants = useTracker(() =>
    PlantsCollection.find()
      .fetch()
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <nav aria-label="main plants">
        <List>
          {plants.map((plant) => (
            <ListItem key={`plant-${plant._id}`} disablePadding>
              <ListItemButton onClick={() => navigate(`/plant/${plant._id}`)}>
                <ListItemAvatar>
                  <PlantAvatar plant={plant} />
                </ListItemAvatar>
                <ListItemText primary={plant.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </Box>
  );
};

export default Plants;
