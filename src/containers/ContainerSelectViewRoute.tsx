import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { BaseSlot, Slot, TRANSPLANTED } from '../interface';
import Loading from '../components/Loading';
import { useContainer, useUpdateContainer } from './hooks/useContainers';
import ContainerView from './ContainerView';

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
      if (container?._id && otherIndex) {
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
        navigate(`/container/${id}/slot/${index}`);
      });
    },
    [container, id, index, indexNumber, navigate, slot, updateContainer]
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

      console.log(extra);

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

  if (!container || !otherContainer || container._id !== id) {
    return <Loading key="container-view-loading" />;
  }

  return (
    <>
      <ContainerView key="container-view" container={otherContainer} onSlotClick={onSlotClick} />
      {otherSlotIndex !== null ? (
        <Dialog open onClose={onSlotSelectClose} maxWidth="xs" fullWidth>
          <DialogTitle>Transplant To</DialogTitle>
          <DialogContent>
            <List>
              <ListItemButton onClick={onSlotSelectConfirm(false)}>Slot</ListItemButton>
              <ListItemButton onClick={onSlotSelectConfirm(true)}>Sub Slot</ListItemButton>
            </List>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default ContainerSelectViewRoute;
