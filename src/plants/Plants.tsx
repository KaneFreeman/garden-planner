import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { format } from 'date-fns/format';
import { useCallback, useMemo, useState } from 'react';
import Chip from '../components/Chip';
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

interface PlantRenderOptions {
  showPlantedCount?: boolean;
  showLinkToPage?: boolean;
}

const Plants = () => {
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
    (
      plant: Plant,
      countData: Counts | undefined | null,
      { showPlantedCount = false, showLinkToPage = false }: PlantRenderOptions
    ) => (
      <ListItem key={`plant-${plant._id}`} disablePadding>
        <ListItemButton component="a" href={`/plant/${plant._id}`}>
          <ListItemAvatar>
            <PlantAvatar plant={plant} />
          </ListItemAvatar>
          <ListItemText
            primary={plant.name}
            secondary={plant.lastOrdered ? `Last ordered on ${format(plant.lastOrdered, 'MMM d, yyyy')}` : undefined}
            classes={{
              root: 'listItemText-root',
              primary: 'listItemText-primary',
              secondary: 'listItemText-secondary'
            }}
            sx={isSmallScreen ? {} : { flex: 'unset' }}
          />
          {showPlantedCount ? (
            <Box sx={{ ml: 2, gap: 1, display: 'flex' }}>
              {countData && countData.planned > 0 ? (
                <DisplayStatusChip count={countData.planned} status="Planning" shrink={isSmallScreen} />
              ) : null}
              {countData && countData.planted > 0 ? (
                <DisplayStatusChip count={countData.planted} status="Planted" shrink={isSmallScreen} />
              ) : null}
            </Box>
          ) : null}
          {showLinkToPage && plant.url ? (
            <a href={plant.url} target="_blank" rel="noopener noreferrer">
              <IconButton sx={{ marginLeft: '8px' }} onClick={(event) => event.stopPropagation()}>
                <OpenInNewIcon></OpenInNewIcon>
              </IconButton>
            </a>
          ) : null}
        </ListItemButton>
      </ListItem>
    ),
    [isSmallScreen]
  );

  const buildPlantList = useCallback(
    (filter: (plant: Plant) => boolean, options: PlantRenderOptions = {}) => {
      return plants.filter(filter).reduce<Record<string, JSX.Element[]>>((acc, plant) => {
        const plantType = plant.type ?? 'Other';
        if (!(plantType in acc)) {
          acc[plantType] = [];
        }

        acc[plantType].push(createListItem(plant, plantCounts[plant._id], options));
        return acc;
      }, {});
    },
    [createListItem, plantCounts, plants]
  );

  const activePlants = useMemo(
    () => buildPlantList((plant) => plant.retired !== true, { showPlantedCount: true }),
    [buildPlantList]
  );
  const archivedPlants = useMemo(() => buildPlantList((plant) => plant.retired === true), [buildPlantList]);

  const reorderPlantCount = useMemo(() => plants.filter((plant) => plant.reorder === true).length, [plants]);
  const reorderPlants = useMemo(
    () => buildPlantList((plant) => plant.reorder === true, { showLinkToPage: true }),
    [buildPlantList]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs ariaLabel="tasks tabs" onChange={(newTab) => setTab(newTab)} sxRoot={{ top: 56 }}>
        {{
          label: 'Active'
        }}
        {{
          label: 'Archived'
        }}
        {{
          label: (
            <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <div>Reorder List</div>
              <Chip title={`${reorderPlantCount}`} size="extra-small" color="info">
                {reorderPlantCount}
              </Chip>
            </Box>
          )
        }}
      </Tabs>
      <TabPanel value={tab} index={0}>
        <nav key="active" aria-label="main plants active">
          {Object.keys(activePlants).map((plantType) => {
            const renderedPlants = activePlants[plantType];
            return (
              <List
                key={`list-${plantType}`}
                subheader={
                  <ListSubheader
                    component="div"
                    sx={{ backgroundColor: '#191919', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}
                  >
                    {plantType}
                  </ListSubheader>
                }
              >
                {renderedPlants}
              </List>
            );
          })}
        </nav>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <nav key="archived" aria-label="main plants archived">
          {Object.keys(archivedPlants).map((plantType) => {
            const renderedPlants = archivedPlants[plantType];
            return (
              <List
                key={`list-${plantType}`}
                subheader={
                  <ListSubheader
                    component="div"
                    sx={{ backgroundColor: '#191919', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}
                  >
                    {plantType}
                  </ListSubheader>
                }
              >
                {renderedPlants}
              </List>
            );
          })}
        </nav>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <nav key="archived" aria-label="main plants reorder">
          {Object.keys(reorderPlants).map((plantType) => {
            const renderedPlants = reorderPlants[plantType];
            return (
              <List
                key={`list-${plantType}`}
                subheader={
                  <ListSubheader
                    component="div"
                    sx={{ backgroundColor: '#191919', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}
                  >
                    {plantType}
                  </ListSubheader>
                }
              >
                {renderedPlants}
              </List>
            );
          })}
        </nav>
      </TabPanel>
    </Box>
  );
};

export default Plants;
