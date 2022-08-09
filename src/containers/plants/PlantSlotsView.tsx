import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import format from 'date-fns/format';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import { PlantInstance } from '../../interface';
import useSmallScreen from '../../utility/smallScreen.util';
import { getSlotTitle } from '../../utility/slot.util';
import usePlantInstancesByPlant from '../../plant-instances/hooks/usePlantInstancesByPlant';
import CollapsableSimpleInlineField from '../../components/inline-fields/CollapsableSimpleInlineField';
import { getFirstEventAt, useFirstEventComparatorWithSecondary } from '../../utility/history.util';
import { useContainersById } from '../hooks/useContainers';
import SlotListItem from '../SlotListItem';

interface PlantSlotsViewProps {
  plantId: string | undefined;
}

interface RenderPlantSlotOptions {
  showStatus?: boolean;
}

const PlantSlotsView = ({ plantId }: PlantSlotsViewProps) => {
  const isSmallScreen = useSmallScreen();
  const navigate = useNavigate();

  const plantInstances = usePlantInstancesByPlant(plantId);
  const containersById = useContainersById();

  const secondaryCompare = useCallback(
    (a: PlantInstance | undefined | null, b: PlantInstance | undefined | null) => {
      if (!a && !b) {
        return 0;
      }

      if (!a) {
        return -1;
      }

      if (!b) {
        return 1;
      }

      const containerA = containersById[a.containerId];
      const containerB = containersById[b.containerId];
      if (!containerA && !containerB) {
        return 0;
      }

      if (!containerA) {
        return -1;
      }

      if (!containerB) {
        return 1;
      }

      if (a.containerId !== b.containerId) {
        return containerA.name.localeCompare(containerB.name);
      }

      const aTitle = getSlotTitle(a.slotId, containerA?.rows);
      const bTitle = getSlotTitle(b.slotId, containerB?.rows);

      return aTitle.localeCompare(bTitle);
    },
    [containersById]
  );

  const firstEventComparatorWithSecondary = useFirstEventComparatorWithSecondary(secondaryCompare);

  const [activePlantInstances, inactivePlantInstances] = useMemo(() => {
    const active: PlantInstance[] = [];
    const inactive: PlantInstance[] = [];

    plantInstances.forEach((instance) => {
      const container = containersById[instance.containerId];
      const slot = container.slots?.[instance.slotId];

      if (instance.closed !== true && slot && slot.plantInstanceId === instance._id) {
        active.push(instance);
      } else {
        inactive.push(instance);
      }
    });

    active.sort(firstEventComparatorWithSecondary);
    inactive.sort(firstEventComparatorWithSecondary);

    return [active, inactive];
  }, [containersById, firstEventComparatorWithSecondary, plantInstances]);

  const onClickHandler = useCallback(
    (instance: PlantInstance) => {
      navigate(`/container/${instance.containerId}/slot/${instance.slotId}${instance.subSlot ? '/sub-slot' : ''}`);
    },
    [navigate]
  );

  const renderPlantSlot = useCallback(
    (key: string, instance: PlantInstance, index: number, options?: RenderPlantSlotOptions) => {
      const { showStatus = true } = options || {};
      const container = containersById[instance.containerId];

      const primary = `${container?.name} - ${
        Object.keys(container?.slots ?? {}).length > 1 ? getSlotTitle(instance.slotId, container?.rows) : ''
      }${instance.subSlot ? ' - Sub-Slot' : ''}`;

      const firstEvent = getFirstEventAt(instance, instance);
      let secondary: string | undefined;
      if (firstEvent) {
        secondary = `${firstEvent.status} on ${format(firstEvent.date, 'MMM d, yyyy')}`;
      }

      return (
        <SlotListItem
          key={`${key}-${index}`}
          instance={instance}
          onClick={onClickHandler}
          primary={primary}
          secondary={secondary}
          showStatus={showStatus}
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
        {activePlantInstances.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>
            No active slots at this time!
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <List>
              {activePlantInstances.map((plantInstance, index) =>
                renderPlantSlot('active-instances', plantInstance, index)
              )}
            </List>
          </Box>
        )}
      </Box>
      {inactivePlantInstances.length > 0 ? (
        <CollapsableSimpleInlineField
          key="inactive-slots"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box>Inactive Slots</Box>
              <Chip label={inactivePlantInstances.length} color="secondary" variant="outlined" />
            </Box>
          }
          value={
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <List>
                  {inactivePlantInstances.map((plantInstance, index) =>
                    renderPlantSlot('inactive-instances', plantInstance, index, { showStatus: false })
                  )}
                </List>
              </Box>
            </Box>
          }
          startCollapsed
        />
      ) : null}
    </Box>
  );
};

export default PlantSlotsView;
