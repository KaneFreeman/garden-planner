import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { PLANTED, PlantInstance } from '../interface';
import { getSlotTitle } from '../utility/slot.util';
import useSmallScreen from '../utility/smallScreen.util';
import { usePlantInstanceStatus } from '../plant-instances/hooks/usePlantInstanceStatus';
import { useContainer } from './hooks/useContainers';
import StatusChip from './DisplayStatusChip';
import './SlotListItem.css';

interface SlotListItemProps {
  instance: PlantInstance;
  style?: React.CSSProperties;
}

const SlotListItem = ({ instance, style }: SlotListItemProps) => {
  const isSmallScreen = useSmallScreen();

  const navigate = useNavigate();

  const status = usePlantInstanceStatus(instance, null, null);

  const onClickHandler = useCallback(() => {
    navigate(`/container/${instance.containerId}/slot/${instance.slotId}${instance.subSlot ? '/sub-slot' : ''}`);
  }, [navigate, instance]);

  const container = useContainer(instance.containerId);
  const title = useMemo(() => {
    return `${getSlotTitle(instance.slotId, container?.rows)}${instance.subSlot ? ' - Sub-Slot' : ''}`;
  }, [container?.rows, instance]);

  return (
    <ListItem style={style} className="slot" disablePadding>
      <ListItemButton
        onClick={onClickHandler}
        sx={{
          width: '100%',
          gap: 2,
          justifyContent: isSmallScreen ? 'space-between' : undefined
        }}
      >
        <ListItemText
          primary={container?.name}
          secondary={title}
          classes={{
            root: 'textRoot',
            primary: 'textPrimary',
            secondary: 'textSecondary'
          }}
        />
        <StatusChip status={status ?? PLANTED} />
      </ListItemButton>
    </ListItem>
  );
};

export default SlotListItem;
