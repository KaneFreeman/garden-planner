import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { BaseSlot, Slot, TRANSPLANTED } from '../interface';
import Loading from '../components/Loading';
import { useContainer, useUpdateContainer } from './hooks/useContainers';
import ContainerView from './ContainerView';
import PlantAvatar from '../plants/PlantAvatar';
import { usePlant } from '../plants/usePlants';

const ContainerSelectViewRoute = () => {
  const { id, index, otherContainerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const sourceIsSubSlot = (searchParams.get('subSlot') ?? 'false') === 'true';
  const updateStatus = (searchParams.get('updateStatus') ?? 'false') === 'true';

  const container = useContainer(id);
  const otherContainer = useContainer(otherContainerId);
  const updateContainer = useUpdateContainer();

  const indexNumber = +(index ?? '-1');

  const [otherSlotIndex, setOtherSlotIndex] = useState<number | null>(null);

  const slot = useMemo(
    () =>
      container?.slots?.[indexNumber] ??
      ({
        transplantedFrom: null,
        transplantedTo: null,
        startedFrom: container?.startedFrom
      } as Slot),
    [container?.slots, container?.startedFrom, indexNumber]
  );

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

  const updateSlot = useCallback(
    (data: Partial<Slot>) => {
      console.log(id, index, indexNumber);
      if (!container || !id || !index || indexNumber < 0) {
        return;
      }

      const newSlot: Slot = {
        ...slot,
        ...data
      };

      const newSlots = { ...(container.slots ?? {}) };
      newSlots[indexNumber] = newSlot;

      // eslint-disable-next-line promise/catch-or-return
      updateContainer({
        ...container,
        slots: newSlots
      }).finally(() => {
        navigate(`/container/${id}/slot/${index}${sourceIsSubSlot ? `/sub-slot` : ''}`);
      });
    },
    [container, id, index, indexNumber, navigate, slot, sourceIsSubSlot, updateContainer]
  );

  const onSlotSelectConfirm = useCallback(
    (subSlot: boolean) => () => {
      setOtherSlotIndex(null);

      if (!otherContainerId || otherSlotIndex == null) {
        return;
      }

      const extra: Partial<BaseSlot> = {};
      if (date) {
        extra.transplantedDate = new Date(+date);
      }

      if (updateStatus) {
        extra.status = TRANSPLANTED;
      }

      if (sourceIsSubSlot) {
        updateSlot({
          subSlot: {
            ...(slot.subSlot ??
              ({
                transplantedFrom: null,
                transplantedTo: null,
                startedFrom: container?.startedFrom
              } as BaseSlot)),
            ...extra,
            transplantedTo: {
              containerId: otherContainerId,
              slotId: otherSlotIndex,
              subSlot
            }
          }
        });
      } else {
        updateSlot({
          ...extra,
          transplantedTo: {
            containerId: otherContainerId,
            slotId: otherSlotIndex,
            subSlot
          }
        });
      }
    },
    [
      otherContainerId,
      otherSlotIndex,
      date,
      updateStatus,
      sourceIsSubSlot,
      updateSlot,
      slot.subSlot,
      container?.startedFrom
    ]
  );

  const otherSlot = useMemo(
    () => (otherSlotIndex != null ? otherContainer?.slots?.[otherSlotIndex] : undefined),
    [otherContainer?.slots, otherSlotIndex]
  );
  const plant = usePlant(otherSlot?.plant);
  const subPlant = usePlant(otherSlot?.subSlot?.plant);

  if (!container || !otherContainer || container._id !== id) {
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
                <PlantAvatar plant={plant} slot={slot} variant="circular" size={28} sx={{ mr: 1.5 }} />
                <ListItemText secondary="Slot" primary={plant?.name ?? 'Empty'} />
              </ListItemButton>
              <ListItemButton onClick={onSlotSelectConfirm(true)}>
                <PlantAvatar plant={subPlant} slot={slot} variant="circular" size={28} sx={{ mr: 1.5 }} />
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
