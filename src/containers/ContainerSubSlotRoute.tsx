import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { BaseSlot, Slot } from '../interface';
import ContainerSlotView from './ContainerSlotView';
import { useContainer, useUpdateContainer } from './hooks/useContainers';

const ContainerSubSlotRoute = () => {
  const { id, index } = useParams();
  const indexNumber = +(index ?? '0');

  const container = useContainer(id);
  const updateContainer = useUpdateContainer();

  const subSlot = useMemo(
    () =>
      container?.slots?.[indexNumber]?.subSlot ??
      ({
        transplantedFrom: null,
        transplantedTo: null,
        startedFrom: container?.startedFrom
      } as Slot),
    [container?.slots, container?.startedFrom, indexNumber]
  );

  const handleOnChange = useCallback(
    async (newSubSlot: BaseSlot) => {
      if (id && container) {
        const newSlots = { ...(container.slots ?? {}) };

        const newSlot =
          newSlots[indexNumber] !== undefined
            ? { ...newSlots[indexNumber] }
            : ({
                transplantedFrom: null,
                transplantedTo: null
              } as Slot);

        newSlot.subSlot = newSubSlot;

        newSlots[indexNumber] = newSlot;

        return updateContainer({ ...container, slots: newSlots });
      }

      return undefined;
    },
    [container, id, indexNumber, updateContainer]
  );

  return (
    <ContainerSlotView
      id={id}
      index={indexNumber}
      type="sub-slot"
      container={container}
      slot={subSlot}
      onChange={handleOnChange}
    />
  );
};

export default ContainerSubSlotRoute;
