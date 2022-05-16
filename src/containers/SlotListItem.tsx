import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BaseSlotWithIdentifier, NOT_PLANTED } from '../interface';
import { getSlotTitle } from '../utility/slot.util';
import { useContainer } from './hooks/useContainers';
import StatusChip from './StatusChip';
import './SlotListItem.css';

interface SlotListItemProps {
  slot: BaseSlotWithIdentifier;
  style?: React.CSSProperties;
}

const SlotListItem = ({ slot, style }: SlotListItemProps) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const navigate = useNavigate();

  const onClickHandler = useCallback(() => {
    navigate(`/container/${slot.containerId}/slot/${slot.slotId}${slot.subSlot ? '/sub-slot' : ''}`);
  }, [navigate, slot]);

  const container = useContainer(slot.containerId);
  const title = useMemo(() => {
    return `${getSlotTitle(slot.slotId, container?.rows)}${slot.subSlot ? ' - Sub-Slot' : ''}`;
  }, [container?.rows, slot]);

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
        <StatusChip status={slot.status ?? NOT_PLANTED} />
      </ListItemButton>
    </ListItem>
  );
};

export default SlotListItem;
