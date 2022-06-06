import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { PlantInstance, Slot, TRANSPLANTED } from '../interface';
import Loading from '../components/Loading';
import PlantAvatar from '../plants/PlantAvatar';
import { usePlant } from '../plants/usePlants';
import {
  useAddPlantInstance,
  usePlantInstance,
  useUpdatePlantInstance
} from '../plant-instances/hooks/usePlantInstances';
import { useContainer } from './hooks/useContainers';
import ContainerView from './ContainerView';
import { usePlantInstanceStatus } from '../plant-instances/hooks/usePlantInstanceStatus';
import { useContainerSlotLocation } from './hooks/useContainerSlotLocation';
import { usePlantInstanceLocation } from '../plant-instances/hooks/usePlantInstanceLocation';
import { findHistoryFromIndex } from '../utility/history.util';

const ContainerSelectViewRoute = () => {
  const { id: containerId, index, otherContainerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const sourceIsSubSlot = (searchParams.get('subSlot') ?? 'false') === 'true';

  const container = useContainer(containerId);
  const otherContainer = useContainer(otherContainerId);
  const addPlantInstance = useAddPlantInstance();
  const updatePlantInstance = useUpdatePlantInstance();

  const indexNumber = +(index ?? '-1');

  const [otherSlotIndex, setOtherSlotIndex] = useState<number | null>(null);

  const slot = useMemo(() => container?.slots?.[indexNumber] ?? {}, [container?.slots, indexNumber]);
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

  const slotLocation = useContainerSlotLocation(containerId, indexNumber, sourceIsSubSlot);
  const plantInstanceLocation = usePlantInstanceLocation(plantInstance);
  const displayStatus = usePlantInstanceStatus(plantInstance, slotLocation, plantInstanceLocation);

  const onSlotSelectConfirm = useCallback(
    (subSlot: boolean) => async () => {
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

      let promise: Promise<PlantInstance | undefined>;

      if (displayStatus === TRANSPLANTED) {
        const historyIndex = findHistoryFromIndex(
          plantInstance,
          {
            containerId,
            slotId: indexNumber,
            subSlot: sourceIsSubSlot
          },
          TRANSPLANTED
        );

        let history = [...(plantInstance.history ?? [])];
        if (historyIndex) {
          history = history.slice(0, historyIndex);
        }

        promise = addPlantInstance({
          ...plantInstance,
          history: [
            ...history,
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
      } else {
        promise = updatePlantInstance({
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
      }

      await promise.finally(() => {
        navigate(`/container/${otherContainerId}/slot/${otherSlotIndex}${subSlot ? `/sub-slot` : ''}`);
      });
    },
    [
      containerId,
      plantInstance,
      otherContainerId,
      otherSlotIndex,
      date,
      displayStatus,
      indexNumber,
      sourceIsSubSlot,
      addPlantInstance,
      updatePlantInstance,
      navigate
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
