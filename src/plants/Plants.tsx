import { useNavigate } from 'react-router';
import { Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import PlantAvatar from './PlantAvatar';
import { usePlants } from './usePlants';

const Plants = () => {
  const navigate = useNavigate();

  const plants = usePlants();

  return (
    <Box sx={{ width: '100%' }}>
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
