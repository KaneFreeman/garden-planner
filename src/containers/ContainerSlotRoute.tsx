import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { BaseSlot, Slot } from '../interface';
import ContainerSlotView from './ContainerSlotView';
import { useContainer, useUpdateContainer } from './useContainers';

const ContainerSlotRoute = () => {
  const { id, index } = useParams();
  const indexNumber = +(index ?? '0');

  const container = useContainer(id);
  const updateContainer = useUpdateContainer();

  const slot = useMemo(
    () =>
      container?.slots?.[indexNumber] ??
      ({
        transplantedFrom: null,
        transplantedTo: null
      } as Slot),
    [container?.slots, indexNumber]
  );

  const handleOnChange = useCallback(
    async (newSlot: BaseSlot) => {
      if (id && container) {
        const newSlots = { ...(container.slots ?? {}) };
        newSlots[indexNumber] = {
          ...newSlot,
          subSlot: slot.subSlot
        };

        return updateContainer({ ...container, slots: newSlots });
      }

      return undefined;
    },
    [container, id, indexNumber, slot.subSlot, updateContainer]
  );

  return (
    <ContainerSlotView
      id={id}
      index={indexNumber}
      type="slot"
      container={container}
      slot={slot}
      subSlot={slot.subSlot}
      onChange={handleOnChange}
    />
  );
};

export default ContainerSlotRoute;