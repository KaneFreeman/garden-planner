import { useCallback } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { PLANTED, PlantInstance } from '../interface';
import useSmallScreen from '../utility/smallScreen.util';
import { usePlantInstanceStatus } from '../plant-instances/hooks/usePlantInstanceStatus';
import StatusChip from './DisplayStatusChip';
import './SlotListItem.css';

interface SlotListItemProps {
  instance: PlantInstance;
  primary: string;
  secondary?: string;
  style?: React.CSSProperties;
  showStatus?: boolean;
  onClick?: (instance: PlantInstance) => void;
}

const SlotListItem = ({ instance, primary, secondary, style, showStatus = true, onClick }: SlotListItemProps) => {
  const isSmallScreen = useSmallScreen();

  const status = usePlantInstanceStatus(instance, null, null);

  const onClickHandler = useCallback(() => {
    if (onClick) {
      onClick(instance);
    }
  }, [onClick, instance]);

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
          primary={primary}
          secondary={secondary}
          classes={{
            root: 'textRoot',
            primary: 'textPrimary',
            secondary: 'textSecondary'
          }}
        />
        {showStatus ? <StatusChip status={status ?? PLANTED} /> : null}
      </ListItemButton>
    </ListItem>
  );
};

export default SlotListItem;
