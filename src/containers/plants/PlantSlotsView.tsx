import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { PlantInstance } from '../../interface';
import useSmallScreen from '../../utility/smallScreen.util';
import { getSlotTitle } from '../../utility/slot.util';
import usePlantInstancesByPlant from '../../plant-instances/hooks/usePlantInstancesByPlant';
import { useContainersById } from '../hooks/useContainers';
import SlotListItem from '../SlotListItem';

interface PlantSlotsViewProps {
  plantId: string | undefined;
}

const PlantSlotsView = ({ plantId }: PlantSlotsViewProps) => {
  const isSmallScreen = useSmallScreen();
  const navigate = useNavigate();

  const plantInstances = usePlantInstancesByPlant(plantId);
  const containersById = useContainersById();

  const onClickHandler = useCallback(
    (instance: PlantInstance) => {
      navigate(`/container/${instance.containerId}/slot/${instance.slotId}${instance.subSlot ? '/sub-slot' : ''}`);
    },
    [navigate]
  );

  const renderPlantSlot = useCallback(
    (key: string, instance: PlantInstance, index: number) => {
      const container = containersById[instance.containerId];

      const secondary = `${
        Object.keys(container?.slots ?? {}).length > 1 ? getSlotTitle(instance.slotId, container?.rows) : ''
      }${instance.subSlot ? ' - Sub-Slot' : ''}`;

      return (
        <SlotListItem
          key={`${key}-${index}`}
          instance={instance}
          onClick={onClickHandler}
          primary={container.name}
          secondary={secondary}
        />
      );
    },
    [containersById, onClickHandler]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{
          flexGrow: 1,
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          justifyContent: isSmallScreen ? 'space-between' : undefined
        }}
        color="GrayText"
      >
        Active Slots
      </Typography>
      <Box sx={{ width: '100%' }}>
        {plantInstances.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>
            No active slots at this time!
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <List>
              {plantInstances.map((plantInstance, index) => renderPlantSlot('active-instances', plantInstance, index))}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PlantSlotsView;
