import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import TabPanel from '../components/tabs/TabPanel';
import Tabs from '../components/tabs/Tabs';
import { Container } from '../interface';
import { getPlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import { usePlantInstancesById } from '../plant-instances/hooks/usePlantInstances';
import { getPlantInstanceStatusForSlot } from '../plant-instances/hooks/usePlantInstanceStatus';
import { useTasksByContainers } from '../tasks/hooks/useTasks';
import TaskBadge from '../tasks/TaskBadge';
import useSmallScreen from '../utility/smallScreen.util';
import './Containers.css';
import DisplayStatusChip from './DisplayStatusChip';
import { useContainers } from './hooks/useContainers';
import Chip from '../components/Chip';
import { generateTagColor } from '../utility/color.util';
import ContainersYearGroup from './ContainersYearGroup';

function sortContainers(a: Container, b: Container): number {
  let result: number;
  if (a.year == null && b.year == null) {
    result = 0;
  } else if (a.year == null) {
    result = -1;
  } else if (b.year == null) {
    result = 1;
  } else {
    result = b.year - a.year;
  }

  if (result === 0) {
    return a.name.localeCompare(b.name);
  }

  return result;
}

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
                const status = getPlantInstanceStatusForSlot(
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
                const status = getPlantInstanceStatusForSlot(
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
            secondary={
              <>
                {container.rows} x {container.columns}
                {container.year != null ? (
                  <Chip title={`${container.year}`} colors={generateTagColor(container.year)} sx={{ ml: 1 }}>
                    {container.year}
                  </Chip>
                ) : null}
              </>
            }
            classes={{
              root: 'listItemText-root',
              primary: 'listItemText-primary',
              secondary: 'listItemText-secondary'
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
    const data = containers.filter((container) => !container.archived);

    data.sort(sortContainers);

    return data.map(createListItem);
  }, [containers, createListItem]);

  const [years, archivedContainers] = useMemo(() => {
    const data = containers.filter((container) => container.archived);

    data.sort(sortContainers);

    return data.reduce<[string[], Record<string, ReactNode[]>]>(
      (acc, container) => {
        if (container.year !== undefined && !acc[0].includes(`${container.year}`)) {
          acc[0].push(`${container.year}`);
          acc[1][`${container.year}`] = [];
        } else {
          if (!('None' in acc[1])) {
            acc[1]['None'] = [];
          }
        }

        acc[1][container.year !== undefined ? `${container.year}` : 'None'].push(createListItem(container));

        return acc;
      },
      [[], {}]
    );
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
          <List>
            {'None' in archivedContainers ? archivedContainers['None'] : null}
            {years.map((year) => (
              <ContainersYearGroup year={year}>{archivedContainers[year]}</ContainersYearGroup>
            ))}
          </List>
        </nav>
      </TabPanel>
    </Box>
  );
};

export default Containers;
