import { useCallback, useState } from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PlantInstance, Slot } from '../../interface';
import useSmallScreen from '../../utility/smallScreen.util';
import { usePlantInstancesFromSlot } from '../../plant-instances/hooks/usePlantInstances';
import SlotListItem from '../SlotListItem';
import { usePlantsById } from '../../plants/usePlants';
import PlantInstanceDialog from '../../plant-instances/PlantInstanceDialog';

interface PastSlotPlantsProps {
  slot: Slot;
}

const PastSlotPlants = ({ slot }: PastSlotPlantsProps) => {
  const isSmallScreen = useSmallScreen();

  const [plantInstanceToView, setPlantInstanceToView] = useState<PlantInstance | null>(null);

  const plantInstances = usePlantInstancesFromSlot(slot);
  const plantsById = usePlantsById();

  const plantInstanceClick = useCallback((instance: PlantInstance) => {
    setPlantInstanceToView(instance);
  }, []);

  const plantInstanceViewClose = useCallback(() => setPlantInstanceToView(null), []);

  const renderPlantSlot = useCallback(
    (key: string, instance: PlantInstance, index: number) => {
      if (!instance.plant) {
        return null;
      }

      const plant = plantsById[instance.plant];
      if (!plant) {
        return null;
      }

      return (
        <SlotListItem
          key={`${key}-${index}`}
          instance={instance}
          onClick={plantInstanceClick}
          primary={plant.name}
          showStatus={false}
          showAvatar
        />
      );
    },
    [plantInstanceClick, plantsById]
  );

  return (
    <>
      {' '}
      {plantInstances.length > 0 ? (
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
            Past Plants
          </Typography>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <List>
                {plantInstances.map((plantInstance, index) =>
                  renderPlantSlot('active-instances', plantInstance, index)
                )}
              </List>
            </Box>
          </Box>
        </Box>
      ) : null}
      <PlantInstanceDialog
        open={Boolean(plantInstanceToView)}
        plantInstance={plantInstanceToView}
        onClose={plantInstanceViewClose}
      />
    </>
  );
};

export default PastSlotPlants;
