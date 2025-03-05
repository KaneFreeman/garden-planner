import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import Avatar from '@mui/material/Avatar';
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
import { Container } from '../interface';
import { getPlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import { usePlantInstancesById } from '../plant-instances/hooks/usePlantInstances';
import { getPlantInstanceStatus } from '../plant-instances/hooks/usePlantInstanceStatus';
import { useTasksByContainers } from '../tasks/hooks/useTasks';
import TaskBadge from '../tasks/TaskBadge';
import useSmallScreen from '../utility/smallScreen.util';
import './Containers.css';
import DisplayStatusChip from './DisplayStatusChip';
import { useContainers } from './hooks/useContainers';

interface Counts {
  notPlanted: number;
  planted: number;
  transplanted: number;
}

const Containers = () => {
  const navigate = useNavigate();
  const containers = useContainers();
  const plantInstancesById = usePlantInstancesById();

  const isSmallScreen = useSmallScreen();

  const [tab, setTab] = useState(0);

  const counts: Record<string, Counts> = useMemo(() => {
    return containers.reduce(
      (data, container) => {
        if (!container.slots) {
          return data;
        }

        const { slots } = container;

        data[container._id] = Object.keys(slots).reduce(
          (countData, slotId) => {
            const slot = slots[+slotId];
            if (slot.plantInstanceId) {
              const plantInstance = plantInstancesById[slot.plantInstanceId];
              if (plantInstance) {
                const location = getPlantInstanceLocation(plantInstance);
                const status = getPlantInstanceStatus(
                  plantInstance,
                  {
                    containerId: container._id,
                    slotId: +slotId,
                    subSlot: false
                  },
                  location
                );
                switch (status) {
                  case 'Planted':
                    countData.planted += 1;
                    break;
                  case 'Transplanted':
                    countData.transplanted += 1;
                    break;
                  case 'Not Planted':
                    countData.notPlanted += 1;
                    break;
                  default:
                    break;
                }
              }
            }

            const subPlantInstanceId = slot.subSlot?.plantInstanceId;
            if (subPlantInstanceId) {
              const plantInstance = plantInstancesById[subPlantInstanceId];
              if (plantInstance) {
                const location = getPlantInstanceLocation(plantInstance);
                const status = getPlantInstanceStatus(
                  plantInstance,
                  {
                    containerId: container._id,
                    slotId: +slotId,
                    subSlot: true
                  },
                  location
                );
                switch (status) {
                  case 'Planted':
                    countData.planted += 1;
                    break;
                  case 'Transplanted':
                    countData.transplanted += 1;
                    break;
                  case 'Not Planted':
                    countData.notPlanted += 1;
                    break;
                  default:
                    break;
                }
              }
            }

            return countData;
          },
          {
            notPlanted: 0,
            planted: 0,
            transplanted: 0
          } as Counts
        );

        return data;
      },
      {} as Record<string, Counts>
    );
  }, [containers, plantInstancesById]);

  const renderCounts = useCallback(
    (countData?: Counts) => {
      if (!countData) {
        return null;
      }

      return (
        <Box sx={{ ml: 2, gap: 1, display: 'flex' }}>
          {countData.notPlanted > 0 ? (
            <DisplayStatusChip count={countData.notPlanted} status="Not Planted" shrink={isSmallScreen} />
          ) : null}
          {countData.planted > 0 ? (
            <DisplayStatusChip count={countData.planted} status="Planted" shrink={isSmallScreen} />
          ) : null}
          {countData.transplanted > 0 ? (
            <DisplayStatusChip count={countData.transplanted} status="Transplanted" shrink={isSmallScreen} />
          ) : null}
        </Box>
      );
    },
    [isSmallScreen]
  );

  const tasksByContainers = useTasksByContainers();

  const createListItem = useCallback(
    (container: Container) => (
      <ListItem key={`container-${container._id}`} disablePadding>
        <ListItemButton onClick={() => navigate(`/container/${container._id}`)}>
          <ListItemAvatar>
            <TaskBadge tasks={tasksByContainers[container._id]}>
              <Avatar>
                {container.type === 'Inside' ? <HomeIcon titleAccess="Inside" /> : <ParkIcon titleAccess="Inside" />}
              </Avatar>
            </TaskBadge>
          </ListItemAvatar>
          <ListItemText
            primary={container.name}
            secondary={`${container.rows} x ${container.columns}`}
            classes={{
              root: 'listItemText-root',
              primary: 'listItemText-primary'
            }}
            sx={isSmallScreen ? {} : { flex: 'unset' }}
          />
          {renderCounts(counts[container._id])}
        </ListItemButton>
      </ListItem>
    ),
    [counts, isSmallScreen, navigate, renderCounts, tasksByContainers]
  );

  const activeContainers = useMemo(() => {
    return containers.filter((container) => !container.archived).map(createListItem);
  }, [containers, createListItem]);

  const archivedContainers = useMemo(() => {
    return containers.filter((container) => container.archived).map(createListItem);
  }, [containers, createListItem]);

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
        <nav key="active" aria-label="main containers active">
          <List>{activeContainers}</List>
        </nav>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <nav key="archived" aria-label="main containers archived">
          <List>{archivedContainers}</List>
        </nav>
      </TabPanel>
    </Box>
  );
};

export default Containers;
