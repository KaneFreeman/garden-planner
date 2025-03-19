import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { Slot } from '../interface';
import { usePlantInstance } from '../plant-instances/hooks/usePlantInstances';
import ContainerSlotView from './ContainerSlotView';
import { useContainer, useUpdateContainer } from './hooks/useContainers';

const ContainerSlotRoute = () => {
  const { id, index } = useParams();
  const indexNumber = +(index ?? '0');

  const container = useContainer(id);
  const updateContainer = useUpdateContainer();

  const slot = useMemo(() => container?.slots?.[indexNumber] ?? {}, [container?.slots, indexNumber]);

  const plantInstance = usePlantInstance(slot.plantInstanceId);

  const handleOnChange = useCallback(
    async (newSlot: Slot) => {
      if (id && container) {
        const newSlots = { ...(container.slots ?? {}) };
        newSlots[indexNumber] = {
          ...newSlot
        };

        return updateContainer({ ...container, slots: newSlots });
      }

      return undefined;
    },
    [container, id, indexNumber, updateContainer]
  );

  if (!id || !container) {
    return <Loading />;
  }

  return (
    <ContainerSlotView
      id={id}
      index={indexNumber}
      container={container}
      slot={slot}
      plantInstance={plantInstance}
      onSlotChange={handleOnChange}
    />
  );
};

export default ContainerSlotRoute;
