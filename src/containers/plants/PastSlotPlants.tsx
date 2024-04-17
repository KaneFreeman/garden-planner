import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContainerSlotIdentifier, PlantInstance, Slot } from '../../interface';
import PlantInstanceDialog from '../../plant-instances/PlantInstanceDialog';
import { usePlantInstancesFromSlot } from '../../plant-instances/hooks/usePlantInstances';
import { usePlantsById } from '../../plants/usePlants';
import { getFirstEventAt, useFirstEventStaticLocationComparator } from '../../utility/history.util';
import useSmallScreen from '../../utility/smallScreen.util';
import SlotListItem from '../SlotListItem';

interface PastSlotPlantsProps {
  location: ContainerSlotIdentifier | null;
  slot: Slot;
}

const PastSlotPlants = ({ location, slot }: PastSlotPlantsProps) => {
  const isSmallScreen = useSmallScreen();

  const [plantInstanceToView, setPlantInstanceToView] = useState<PlantInstance | null>(null);

  const firstEventStaticLocationComparator = useFirstEventStaticLocationComparator(location);

  const plantInstances = usePlantInstancesFromSlot(slot);
  const sortedPlantInstances = useMemo(() => {
    const newPlantInstances = [...plantInstances];
    newPlantInstances.sort(firstEventStaticLocationComparator);
    return newPlantInstances;
  }, [firstEventStaticLocationComparator, plantInstances]);

  const plantInstancesById = useMemo(
    () =>
      plantInstances.reduce((acc, plantInstance) => {
        acc[plantInstance._id] = plantInstance;
        return acc;
      }, {} as Record<string, PlantInstance>),
    [plantInstances]
  );
  const plantsById = usePlantsById();

  const plantInstanceClick = useCallback((instance: PlantInstance) => {
    setPlantInstanceToView(instance);
  }, []);

  useEffect(() => {
    if (plantInstanceToView) {
      setPlantInstanceToView(plantInstancesById[plantInstanceToView._id]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantInstancesById]);

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

      let secondary: string | undefined;
      const firstEvent = getFirstEventAt(instance, location);
      if (firstEvent) {
        secondary = `${firstEvent.status} on ${format(firstEvent.date, 'MMM d, yyyy')}`;
      }

      return (
        <SlotListItem
          key={`${key}-${index}`}
          instance={instance}
          onClick={plantInstanceClick}
          primary={plant.name}
          secondary={secondary}
          showStatus={false}
          showAvatar
        />
      );
    },
    [location, plantInstanceClick, plantsById]
  );

  return (
    <>
      {' '}
      {sortedPlantInstances.length > 0 ? (
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
                {sortedPlantInstances.map((plantInstance, index) =>
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
