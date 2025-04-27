import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { PlantInstance, Slot, TRANSPLANTED } from '../interface';
import { usePlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import {
  useAddPlantInstance,
  usePlantInstance,
  useUpdatePlantInstance
} from '../plant-instances/hooks/usePlantInstances';
import { usePlantInstanceStatus } from '../plant-instances/hooks/usePlantInstanceStatus';
import { findHistoryFromIndex } from '../utility/history.util';
import ContainerView from './ContainerView';
import { useContainer } from './hooks/useContainers';
import { useContainerSlotLocation } from './hooks/useContainerSlotLocation';

const ContainerSelectViewRoute = () => {
  const { id: containerId, index, otherContainerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  const container = useContainer(containerId);
  const otherContainer = useContainer(otherContainerId);
  const addPlantInstance = useAddPlantInstance();
  const updatePlantInstance = useUpdatePlantInstance();

  const indexNumber = +(index ?? '-1');

  const slot = useMemo(() => container?.slots?.[indexNumber] ?? {}, [container?.slots, indexNumber]);
  const plantInstance = usePlantInstance(slot?.plantInstanceId);

  const slotLocation = useContainerSlotLocation(containerId, indexNumber);
  const plantInstanceLocation = usePlantInstanceLocation(plantInstance);
  const displayStatus = usePlantInstanceStatus(plantInstance, slotLocation, plantInstanceLocation);

  const onSlotClick = useCallback(
    async (_: Slot | undefined, otherSlotIndex: number) => {
      if (!containerId || !plantInstance || !otherContainerId || otherSlotIndex < 0) {
        return;
      }

      let transplantedDate: Date | undefined;
      if (date) {
        transplantedDate = new Date(+date);
      }

      if (!transplantedDate) {
        return;
      }

      let promise: Promise<PlantInstance | undefined>;

      if (displayStatus === TRANSPLANTED) {
        const historyIndex = findHistoryFromIndex(
          plantInstance,
          {
            containerId,
            slotId: indexNumber
          },
          TRANSPLANTED
        );

        let history = [...(plantInstance.history ?? [])];
        if (historyIndex) {
          history = history.slice(0, historyIndex);
        }

        promise = addPlantInstance(
          {
            ...plantInstance,
            history: [
              ...history,
              {
                from: {
                  containerId,
                  slotId: indexNumber
                },
                to: {
                  containerId: otherContainerId,
                  slotId: otherSlotIndex
                },
                date: transplantedDate,
                status: TRANSPLANTED
              }
            ]
          },
          plantInstance._id
        );
      } else {
        promise = updatePlantInstance({
          ...plantInstance,
          history: [
            ...(plantInstance.history ?? []),
            {
              from: {
                containerId,
                slotId: indexNumber
              },
              to: {
                containerId: otherContainerId,
                slotId: otherSlotIndex
              },
              date: transplantedDate,
              status: TRANSPLANTED
            }
          ]
        });
      }

      await promise.finally(() => {
        navigate(`/container/${otherContainerId}/slot/${otherSlotIndex}`);
      });
    },
    [
      containerId,
      plantInstance,
      otherContainerId,
      date,
      displayStatus,
      indexNumber,
      addPlantInstance,
      updatePlantInstance,
      navigate
    ]
  );

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
    </>
  );
};

export default ContainerSelectViewRoute;
