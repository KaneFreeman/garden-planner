/* eslint-disable no-param-reassign */
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import { useTasksByContainers } from '../tasks/hooks/useTasks';
import TaskBadge from '../tasks/TaskBadge';
import Tabs from '../components/tabs/Tabs';
import TabPanel from '../components/tabs/TabPanel';
import { useContainers } from './hooks/useContainers';
import StatusChip from './StatusChip';
import './Containers.css';
import { Container } from '../interface';

interface Counts {
  notPlanted: number;
  planted: number;
  transplanted: number;
}

const Containers = () => {
  const navigate = useNavigate();
  const containers = useContainers();

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [tab, setTab] = useState(0);

  const counts: Record<string, Counts> = useMemo(() => {
    return containers.reduce((data, container) => {
      if (!container.slots) {
        return data;
      }

      const { slots } = container;

      data[container._id] = Object.keys(slots).reduce(
        (countData, slotId) => {
          const slot = slots[+slotId];
          if (slot.plant) {
            switch (slot.status) {
              case 'Planted':
                countData.planted += 1;
                break;
              case 'Transplanted':
                countData.transplanted += 1;
                break;
              default:
                countData.notPlanted += 1;
                break;
            }
          }

          if (slot.subSlot && slot.subSlot.plant) {
            switch (slot.subSlot.status) {
              case 'Planted':
                countData.planted += 1;
                break;
              case 'Transplanted':
                countData.transplanted += 1;
                break;
              default:
                countData.notPlanted += 1;
                break;
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
    }, {} as Record<string, Counts>);
  }, [containers]);

  const renderCounts = useCallback(
    (countData?: Counts) => {
      if (!countData) {
        return null;
      }

      return (
        <Box sx={{ ml: 2, gap: 1, display: 'flex' }}>
          {countData.notPlanted > 0 ? (
            <StatusChip count={countData.notPlanted} status="Not Planted" shrink={isSmallScreen} />
          ) : null}
          {countData.planted > 0 ? (
            <StatusChip count={countData.planted} status="Planted" shrink={isSmallScreen} />
          ) : null}
          {countData.transplanted > 0 ? (
            <StatusChip count={countData.transplanted} status="Transplanted" shrink={isSmallScreen} />
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
