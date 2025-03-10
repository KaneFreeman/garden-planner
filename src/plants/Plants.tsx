import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import TabPanel from '../components/tabs/TabPanel';
import Tabs from '../components/tabs/Tabs';
import { useContainers } from '../containers/hooks/useContainers';
import { Plant } from '../interface';
import { useAppSelector } from '../store/hooks';
import { selectFilterPlants } from '../store/slices/plants';
import useSmallScreen from '../utility/smallScreen.util';
import PlantAvatar from './PlantAvatar';
import './Plants.css';
import { usePlants } from './usePlants';

const Plants = () => {
  const navigate = useNavigate();
  const filterPlants = useAppSelector(selectFilterPlants);
  const containers = useContainers();
  const isSmallScreen = useSmallScreen();

  const plants = usePlants(filterPlants ? containers : undefined);

  const [tab, setTab] = useState(0);

  const createListItem = useCallback(
    (plant: Plant) => (
      <ListItem key={`plant-${plant._id}`} disablePadding>
        <ListItemButton onClick={() => navigate(`/plant/${plant._id}`)}>
          <ListItemAvatar>
            <PlantAvatar plant={plant} />
          </ListItemAvatar>
          <ListItemText
            primary={`${plant.type ? `${plant.type} - ` : ''}${plant.name}`}
            classes={{
              root: 'listItemText-root',
              primary: 'listItemText-primary'
            }}
            sx={isSmallScreen ? {} : { flex: 'unset' }}
          />
        </ListItemButton>
      </ListItem>
    ),
    [isSmallScreen, navigate]
  );

  const activePlants = useMemo(() => {
    return plants.filter((plant) => plant.retired !== true).map(createListItem);
  }, [plants, createListItem]);

  const archivedPlants = useMemo(() => {
    return plants.filter((plant) => plant.retired === true).map(createListItem);
  }, [plants, createListItem]);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs ariaLabel="tasks tabs" onChange={(newTab) => setTab(newTab)} sxRoot={{ top: 56 }}>
        {{
          label: 'Active'
        }}
        {{
          label: 'Archived'
        }}
      </Tabs>
      <TabPanel value={tab} index={0}>
        <nav key="active" aria-label="main plants active">
          <List>{activePlants}</List>
        </nav>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <nav key="archived" aria-label="main plants archived">
          <List>{archivedPlants}</List>
        </nav>
      </TabPanel>
    </Box>
  );
};

export default Plants;
