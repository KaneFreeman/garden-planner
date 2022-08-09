import { useCallback } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { PLANTED, PlantInstance } from '../interface';
import useSmallScreen from '../utility/smallScreen.util';
import { usePlantInstanceStatus } from '../plant-instances/hooks/usePlantInstanceStatus';
import PlantAvatar from '../plants/PlantAvatar';
import { usePlant } from '../plants/usePlants';
import StatusChip from './DisplayStatusChip';
import './SlotListItem.css';

interface SlotListItemProps {
  instance: PlantInstance;
  primary: string;
  secondary?: string;
  style?: React.CSSProperties;
  showAvatar?: boolean;
  showStatus?: boolean;
  onClick?: (instance: PlantInstance) => void;
}

const SlotListItem = ({
  instance,
  primary,
  secondary,
  style,
  showAvatar = false,
  showStatus = true,
  onClick
}: SlotListItemProps) => {
  const isSmallScreen = useSmallScreen();

  const status = usePlantInstanceStatus(instance, null, null);
  const plant = usePlant(instance?.plant);

  const onClickHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      if (onClick) {
        onClick(instance);
      }
    },
    [onClick, instance]
  );

  return (
    <ListItem style={style} className="slot" disablePadding>
      <ListItemButton
        onClick={onClickHandler}
        sx={{
          width: '100%',
          justifyContent: isSmallScreen ? 'space-between' : undefined
        }}
      >
        {showAvatar ? (
          <ListItemAvatar sx={{ display: 'flex' }}>
            <PlantAvatar plant={plant} />
          </ListItemAvatar>
        ) : null}
        <ListItemText
          primary={primary}
          secondary={secondary}
          classes={{
            root: 'textRoot',
            primary: 'textPrimary',
            secondary: 'textSecondary'
          }}
        />
        {showStatus ? <StatusChip sx={{ ml: 2 }} status={status ?? PLANTED} /> : null}
      </ListItemButton>
    </ListItem>
  );
};

export default SlotListItem;
