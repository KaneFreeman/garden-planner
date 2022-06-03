import { useCallback } from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { PlantInstance } from '../../interface';
import useSmallScreen from '../../utility/smallScreen.util';
import usePlantInstancesByPlant from '../../plant-instances/hooks/usePlantInstancesByPlant';
import SlotListItem from '../SlotListItem';

interface PlantSlotsViewProps {
  plantId: string | undefined;
}

const PlantSlotsView = ({ plantId }: PlantSlotsViewProps) => {
  const isSmallScreen = useSmallScreen();

  const plantInstances = usePlantInstancesByPlant(plantId);

  const renderPlantSlot = useCallback((key: string, instance: PlantInstance, index: number) => {
    return <SlotListItem key={`${key}-${index}`} instance={instance} />;
  }, []);

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
