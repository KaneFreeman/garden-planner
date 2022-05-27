import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { NOT_PLANTED, PlantInstance } from '../interface';
import { getSlotTitle } from '../utility/slot.util';
import { usePlantInstanceStatus } from '../utility/plantInstance.util';
import { useContainer } from './hooks/useContainers';
import StatusChip from './StatusChip';
import './SlotListItem.css';

interface SlotListItemProps {
  instance: PlantInstance;
  style?: React.CSSProperties;
}

const SlotListItem = ({ instance, style }: SlotListItemProps) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const navigate = useNavigate();

  const status = usePlantInstanceStatus(instance);

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
        <StatusChip status={status ?? NOT_PLANTED} />
      </ListItemButton>
    </ListItem>
  );
};

export default SlotListItem;
