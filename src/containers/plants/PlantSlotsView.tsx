import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import CollapsableSimpleInlineField from '../../components/inline-fields/CollapsableSimpleInlineField';
import { PlantInstance } from '../../interface';
import PlantInstanceDialog from '../../plant-instances/PlantInstanceDialog';
import { usePlantInstancesById } from '../../plant-instances/hooks/usePlantInstances';
import usePlantInstancesByPlant from '../../plant-instances/hooks/usePlantInstancesByPlant';
import { getFirstEventAt, useFirstEventComparatorWithSecondary } from '../../utility/history.util';
import { getSlotTitle } from '../../utility/slot.util';
import useSmallScreen from '../../utility/smallScreen.util';
import SlotListItem from '../SlotListItem';
import { useContainersById } from '../hooks/useContainers';

interface PlantSlotsViewProps {
  plantId: string | undefined;
}

interface RenderPlantSlotOptions {
  showStatus?: boolean;
  openDialog?: boolean;
}

const PlantSlotsView = ({ plantId }: PlantSlotsViewProps) => {
  const isSmallScreen = useSmallScreen();
  const navigate = useNavigate();

  const plantInstances = usePlantInstancesByPlant(plantId);
  const plantInstancesById = usePlantInstancesById();
  const containersById = useContainersById();

  const [plantInstanceToView, setPlantInstanceToView] = useState<PlantInstance | null>(null);

  const openPlantInstanceDialog = useCallback((instance: PlantInstance) => {
    setPlantInstanceToView(instance);
  }, []);

  useEffect(() => {
    if (plantInstanceToView) {
      setPlantInstanceToView(plantInstancesById[plantInstanceToView._id]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantInstancesById]);

  const plantInstanceViewClose = useCallback(() => setPlantInstanceToView(null), []);

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
      const slot = container?.slots?.[instance.slotId];

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
      const { showStatus = true, openDialog = false } = options || {};
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
          onClick={openDialog ? openPlantInstanceDialog : onClickHandler}
          primary={primary}
          secondary={secondary}
          showStatus={showStatus}
        />
      );
    },
    [containersById, onClickHandler, openPlantInstanceDialog]
  );

  return (
    <>
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
                      renderPlantSlot('inactive-instances', plantInstance, index, {
                        showStatus: false,
                        openDialog: true
                      })
                    )}
                  </List>
                </Box>
              </Box>
            }
            startCollapsed
          />
        ) : null}
      </Box>
      <PlantInstanceDialog
        open={Boolean(plantInstanceToView)}
        plantInstance={plantInstanceToView}
        onClose={plantInstanceViewClose}
      />
    </>
  );
};

export default PlantSlotsView;
