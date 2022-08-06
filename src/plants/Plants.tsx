import { useNavigate } from 'react-router';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { useAppSelector } from '../store/hooks';
import { selectFilterPlants } from '../store/slices/plants';
import { useContainers } from '../containers/hooks/useContainers';
import PlantAvatar from './PlantAvatar';
import { usePlants } from './usePlants';
import useSmallScreen from '../utility/smallScreen.util';
import './Plants.css';

const StyledChip = styled(Chip)({
  height: 24,
  fontSize: 12
});

const Plants = () => {
  const navigate = useNavigate();
  const filterPlants = useAppSelector(selectFilterPlants);
  const containers = useContainers();
  const isSmallScreen = useSmallScreen();

  const plants = usePlants(filterPlants ? containers : undefined);

  return (
    <Box sx={{ width: '100%' }}>
      <nav aria-label="main plants">
        <List>
          {plants.map((plant) => (
            <ListItem key={`plant-${plant._id}`} disablePadding>
              <ListItemButton onClick={() => navigate(`/plant/${plant._id}`)}>
                <ListItemAvatar>
                  <PlantAvatar plant={plant} faded={plant.retired === true} />
                </ListItemAvatar>
                <ListItemText
                  primary={plant.name}
                  classes={{
                    root: 'listItemText-root',
                    primary: 'listItemText-primary'
                  }}
                  sx={isSmallScreen ? {} : { flex: 'unset' }}
                />
                {plant.retired === true ? (
                  <Box sx={{ ml: 2, gap: 1, display: 'flex' }}>
                    <StyledChip label="Retired" color="warning" title="Retired" />
                  </Box>
                ) : null}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </Box>
  );
};

export default Plants;
