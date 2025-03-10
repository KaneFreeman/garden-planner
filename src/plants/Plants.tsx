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
import DisplayStatusChip from '../containers/DisplayStatusChip';
import { useContainers, useContainersById } from '../containers/hooks/useContainers';
import { NOT_PLANTED, Plant, PLANTED } from '../interface';
import { usePlantInstances } from '../plant-instances/hooks/usePlantInstances';
import { getPlantInstanceStatus } from '../plant-instances/hooks/usePlantInstanceStatus';
import { useAppSelector } from '../store/hooks';
import { selectFilterPlants } from '../store/slices/plants';
import useSmallScreen from '../utility/smallScreen.util';
import PlantAvatar from './PlantAvatar';
import './Plants.css';
import { usePlants } from './usePlants';

interface Counts {
  planned: number;
  planted: number;
}

const Plants = () => {
  const navigate = useNavigate();
  const filterPlants = useAppSelector(selectFilterPlants);
  const containers = useContainers();
  const containersById = useContainersById();
  const plantInstances = usePlantInstances();
  const isSmallScreen = useSmallScreen();

  const [tab, setTab] = useState(0);

  const plants = usePlants(filterPlants ? containers : undefined);

  const plantCounts = useMemo(() => {
    const counts = plants.reduce<Record<string, Counts>>((acc, plant) => {
      acc[plant._id] = {
        planned: 0,
        planted: 0
      };

      return acc;
    }, {});

    containers.forEach((container) => {
      if (!container.slots || container.archived) {
        return;
      }

      Object.values(container.slots).forEach((slot) => {
        if (!slot.plantInstanceId && slot.plant && slot.plant in counts) {
          counts[slot.plant].planned += 1;
        }

        const subSlot = slot.subSlot;
        if (subSlot && !subSlot.plantInstanceId && subSlot.plant && subSlot.plant in counts) {
          counts[subSlot.plant].planned += 1;
        }
      });
    });

    plantInstances.forEach((plantInstance) => {
      if (!plantInstance || plantInstance.closed || !plantInstance.plant || !(plantInstance.plant in counts)) {
        return;
      }

      const container = containersById[plantInstance.containerId];
      if (container.archived) {
        return;
      }

      const status = getPlantInstanceStatus(plantInstance);
      switch (status) {
        case NOT_PLANTED:
          counts[plantInstance.plant].planned += 1;
          break;
        case PLANTED:
          counts[plantInstance.plant].planted += 1;
          break;
        default:
          break;
      }
    });

    return counts;
  }, [containers, containersById, plantInstances, plants]);

  const createListItem = useCallback(
    (plant: Plant, countData: Counts | undefined | null) => (
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
          <Box sx={{ ml: 2, gap: 1, display: 'flex' }}>
            {countData && countData.planned > 0 ? (
              <DisplayStatusChip count={countData.planned} status="Planning" shrink={isSmallScreen} />
            ) : null}
            {countData && countData.planted > 0 ? (
              <DisplayStatusChip count={countData.planted} status="Planted" shrink={isSmallScreen} />
            ) : null}
          </Box>
        </ListItemButton>
      </ListItem>
    ),
    [isSmallScreen, navigate]
  );

  const activePlants = useMemo(() => {
    return plants.filter((plant) => plant.retired !== true).map((p) => createListItem(p, plantCounts[p._id]));
  }, [plants, createListItem, plantCounts]);

  const archivedPlants = useMemo(() => {
    return plants.filter((plant) => plant.retired === true).map((p) => createListItem(p, plantCounts[p._id]));
  }, [plants, createListItem, plantCounts]);

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
