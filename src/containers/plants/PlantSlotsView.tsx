import { useCallback } from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BaseSlotWithIdentifier } from '../../interface';
import { useGetPlantSlots } from '../../plants/usePlants';
import SlotListItem from '../SlotListItem';

interface PlantSlotsViewProps {
  plantId: string | undefined;
}

const PlantSlotsView = ({ plantId }: PlantSlotsViewProps) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const plantSlots = useGetPlantSlots(plantId);

  const renderTask = useCallback((key: string, slot: BaseSlotWithIdentifier, index: number) => {
    return <SlotListItem key={`${key}-${index}`} slot={slot} />;
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
        {plantSlots.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>
            No active slots at this time!
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <List>{plantSlots.map((slot, index) => renderTask('active-slots', slot, index))}</List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PlantSlotsView;
