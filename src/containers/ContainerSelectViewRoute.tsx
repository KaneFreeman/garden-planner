import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Slot, TRANSPLANTED } from '../interface';
import Loading from '../components/Loading';
import PlantAvatar from '../plants/PlantAvatar';
import { usePlant } from '../plants/usePlants';
import { usePlantInstance, useUpdatePlantInstance } from '../plant-instances/hooks/usePlantInstances';
import { useContainer, useUpdateContainer } from './hooks/useContainers';
import ContainerView from './ContainerView';

const ContainerSelectViewRoute = () => {
  const { id: containerId, index, otherContainerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const sourceIsSubSlot = (searchParams.get('subSlot') ?? 'false') === 'true';

  const container = useContainer(containerId);
  const otherContainer = useContainer(otherContainerId);
  const updateContainer = useUpdateContainer();
  const updatePlantInstance = useUpdatePlantInstance();

  const indexNumber = +(index ?? '-1');

  const [otherSlotIndex, setOtherSlotIndex] = useState<number | null>(null);

  const slot = useMemo(
    () => container?.slots?.[indexNumber] ?? { plannedPlantId: null },
    [container?.slots, indexNumber]
  );
  const plantInstance = usePlantInstance(sourceIsSubSlot ? slot.subSlot?.plantInstanceId : slot?.plantInstanceId);

  const onSlotClick = useCallback(
    (_: Slot | undefined, otherIndex: number) => {
      if (container?._id && otherIndex >= 0) {
        setOtherSlotIndex(otherIndex);
      }
    },
    [container?._id]
  );

  const onSlotSelectClose = useCallback(() => {
    setOtherSlotIndex(null);
  }, []);

  const updateOtherSlot = useCallback(
    (data: Partial<Slot>) => {
      if (!otherContainer || !otherContainerId || !otherSlotIndex || otherSlotIndex < 0) {
        return;
      }

      const newSlot: Slot = {
        ...(otherContainer.slots?.[otherSlotIndex] ?? { plannedPlantId: null }),
        ...data
      };

      const newSlots = { ...(otherContainer.slots ?? {}) };
      newSlots[otherSlotIndex] = newSlot;

      // eslint-disable-next-line promise/catch-or-return
      updateContainer({
        ...otherContainer,
        slots: newSlots
      }).finally(() => {
        navigate(`/container/${containerId}/slot/${index}${sourceIsSubSlot ? `/sub-slot` : ''}`);
      });
    },
    [containerId, index, navigate, otherContainer, otherContainerId, otherSlotIndex, sourceIsSubSlot, updateContainer]
  );

  const onSlotSelectConfirm = useCallback(
    (subSlot: boolean) => () => {
      setOtherSlotIndex(null);

      if (!containerId || !plantInstance || !otherContainerId || otherSlotIndex == null) {
        return;
      }

      let transplantedDate: Date | undefined;
      if (date) {
        transplantedDate = new Date(+date);
      }

      if (!transplantedDate) {
        return;
      }

      updatePlantInstance({
        ...plantInstance,
        history: [
          ...(plantInstance.history ?? []),
          {
            from: {
              containerId,
              slotId: indexNumber,
              subSlot: sourceIsSubSlot
            },
            to: {
              containerId: otherContainerId,
              slotId: otherSlotIndex,
              subSlot
            },
            date: transplantedDate,
            status: TRANSPLANTED
          }
        ]
      });

      if (subSlot) {
        updateOtherSlot({
          subSlot: {
            ...(slot.subSlot ?? { plannedPlantId: null }),
            plantInstanceId: plantInstance._id
          }
        });
      } else {
        updateOtherSlot({
          plantInstanceId: plantInstance._id
        });
      }
    },
    [
      containerId,
      plantInstance,
      otherContainerId,
      otherSlotIndex,
      date,
      updatePlantInstance,
      indexNumber,
      sourceIsSubSlot,
      updateOtherSlot,
      slot.subSlot
    ]
  );

  const otherSlot = useMemo(
    () => (otherSlotIndex != null ? otherContainer?.slots?.[otherSlotIndex] : undefined),
    [otherContainer?.slots, otherSlotIndex]
  );
  const otherPlantInstance = usePlantInstance(otherSlot?.plantInstanceId);
  const otherSubPlantInstance = usePlantInstance(otherSlot?.subSlot?.plantInstanceId);

  const plant = usePlant(otherPlantInstance?.plant);
  const subPlant = usePlant(otherSubPlantInstance?.plant);

  if (!container || !otherContainer || container._id !== containerId) {
    return <Loading key="container-view-loading" />;
  }

  return (
    <>
      <ContainerView
        key="container-view"
        container={otherContainer}
        readonly
        titleRenderer={(title) => `Transplant to ${title}`}
        onSlotClick={onSlotClick}
      />
      {otherSlotIndex !== null ? (
        <Dialog open onClose={onSlotSelectClose} maxWidth="xs" fullWidth>
          <DialogTitle>Transplant To</DialogTitle>
          <DialogContent>
            <List>
              <ListItemButton onClick={onSlotSelectConfirm(false)}>
                <PlantAvatar
                  plant={plant}
                  plantInstance={otherPlantInstance}
                  variant="circular"
                  size={28}
                  sx={{ mr: 1.5 }}
                />
                <ListItemText secondary="Slot" primary={plant?.name ?? 'Empty'} />
              </ListItemButton>
              <ListItemButton onClick={onSlotSelectConfirm(true)}>
                <PlantAvatar
                  plant={subPlant}
                  plantInstance={otherSubPlantInstance}
                  variant="circular"
                  size={28}
                  sx={{ mr: 1.5 }}
                />
                <ListItemText secondary="Sub Slot" primary={subPlant?.name ?? 'Empty'} />
              </ListItemButton>
            </List>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default ContainerSelectViewRoute;
