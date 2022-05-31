import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { BaseSlot } from '../interface';
import { usePlantInstance } from '../plant-instances/hooks/usePlantInstances';
import ContainerSlotView from './ContainerSlotView';
import { useContainer, useUpdateContainer } from './hooks/useContainers';

const ContainerSlotRoute = () => {
  const { id, index } = useParams();
  const indexNumber = +(index ?? '0');

  const container = useContainer(id);
  const updateContainer = useUpdateContainer();

  const slot = useMemo(
    () => container?.slots?.[indexNumber] ?? {},
    [container?.slots, indexNumber]
  );

  const plantInstance = usePlantInstance(slot.plantInstanceId);
  const subPlantInstance = usePlantInstance(slot.subSlot?.plantInstanceId);

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

  if (!id || !container) {
    return <Loading />;
  }

  return (
    <ContainerSlotView
      id={id}
      index={indexNumber}
      type="slot"
      container={container}
      slot={slot}
      plantInstance={plantInstance}
      subSlot={slot.subSlot}
      subPlantInstance={subPlantInstance}
      onSlotChange={handleOnChange}
    />
  );
};

export default ContainerSlotRoute;
