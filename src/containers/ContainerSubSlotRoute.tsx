import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { BaseSlot } from '../interface';
import { usePlantInstance } from '../plant-instances/hooks/usePlantInstances';
import ContainerSlotView from './ContainerSlotView';
import { useContainer, useUpdateContainer } from './hooks/useContainers';

const ContainerSubSlotRoute = () => {
  const { id, index } = useParams();
  const indexNumber = +(index ?? '0');

  const container = useContainer(id);
  const updateContainer = useUpdateContainer();

  const subSlot = useMemo(
    () => container?.slots?.[indexNumber]?.subSlot ?? {},
    [container?.slots, indexNumber]
  );

  const plantInstance = usePlantInstance(subSlot.plantInstanceId);

  const handleOnChange = useCallback(
    async (newSubSlot: BaseSlot) => {
      if (id && container) {
        const newSlots = { ...(container.slots ?? {}) };

        const newSlot = newSlots[indexNumber] !== undefined ? { ...newSlots[indexNumber] } : {};

        newSlot.subSlot = newSubSlot;

        newSlots[indexNumber] = newSlot;

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
      type="sub-slot"
      container={container}
      slot={subSlot}
      plantInstance={plantInstance}
      onSlotChange={handleOnChange}
    />
  );
};

export default ContainerSubSlotRoute;
