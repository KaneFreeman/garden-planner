/* eslint-disable no-param-reassign */
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import { useContainers } from './useContainers';
import StatusChip from './StatusChip';

interface Counts {
  notPlanted: number;
  planted: number;
  transplanted: number;
}

const Containers = () => {
  const navigate = useNavigate();
  const containers = useContainers();

  const counts: Record<string, Counts> = useMemo(() => {
    return containers.reduce((data, container) => {
      if (!container.slots) {
        return data;
      }

      const { slots } = container;

      data[container._id] = Object.keys(slots).reduce(
        (countData, slotId) => {
          const slot = slots[+slotId];
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

  const renderCounts = useCallback((countData?: Counts) => {
    if (!countData) {
      return null;
    }

    return (
      <Box sx={{ ml: 2, gap: 1, display: 'flex' }}>
        {countData.notPlanted > 0 ? <StatusChip count={countData.notPlanted} status="Not Planted" /> : null}
        {countData.planted > 0 ? <StatusChip count={countData.planted} status="Planted" /> : null}
        {countData.transplanted > 0 ? <StatusChip count={countData.transplanted} status="Transplanted" /> : null}
      </Box>
    );
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <nav aria-label="main containers">
        <List>
          {containers.map((container) => (
            <ListItem key={`container-${container._id}`} disablePadding>
              <ListItemButton onClick={() => navigate(`/container/${container._id}`)}>
                <ListItemAvatar>
                  <Avatar>
                    {container.type === 'Inside' ? (
                      <HomeIcon titleAccess="Inside" />
                    ) : (
                      <ParkIcon titleAccess="Inside" />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={container.name}
                  secondary={`${container.rows} x ${container.columns}`}
                  sx={{ flex: 'unset' }}
                />
                {renderCounts(counts[container._id])}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </Box>
  );
};

export default Containers;
