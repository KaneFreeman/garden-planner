import { useNavigate } from 'react-router';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useAppSelector } from '../store/hooks';
import { selectFilterPlants } from '../store/slices/plants';
import { useContainers } from '../containers/hooks/useContainers';
import PlantAvatar from './PlantAvatar';
import { usePlants } from './usePlants';
import './Plants.css';

const Plants = () => {
  const navigate = useNavigate();
  const filterPlants = useAppSelector(selectFilterPlants);
  const containers = useContainers();

  const plants = usePlants(filterPlants ? containers : undefined);

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
                <ListItemText
                  primary={plant.name}
                  classes={{
                    root: 'listItemText-root',
                    primary: 'listItemText-primary'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </Box>
  );
};

export default Plants;
