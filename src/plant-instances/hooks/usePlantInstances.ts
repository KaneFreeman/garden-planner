import { useCallback, useMemo } from 'react';
import Api from '../../api/api';
import { ExtraFetchOptions, fetchEndpoint } from '../../api/useFetch';
import {
  Container,
  ContainerSlotIdentifier,
  PlantInstance,
  STARTED_FROM_TYPE_SEED,
  Slot,
  TaskType,
  fromPlantInstanceDTO,
  toPlantInstanceDTO
} from '../../interface';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSelectedGarden } from '../../store/slices/gardens';
import {
  selectPlantInstanceById,
  selectPlantInstances,
  selectPlantInstancesByIds,
  updatePlantInstances
} from '../../store/slices/plant-instances';
import { isNotNullish, isNullish } from '../../utility/null.util';
import { mapRecord } from '../../utility/record.util';
import computeSeason from '../../utility/season.util';

export const useGetPlantInstances = (options?: ExtraFetchOptions) => {
  const dispatch = useAppDispatch();
  const garden = useAppSelector(selectSelectedGarden);

  const getPlantInstances = useCallback(async () => {
    if (!garden?._id) {
      return undefined;
    }

    const response = await fetchEndpoint(Api.plantInstance_Get, { params: { gardenId: garden._id } }, options);

    if (response && typeof response !== 'string') {
      dispatch(updatePlantInstances(response));
    }

    return response;
  }, [dispatch, garden?._id, options]);

  return getPlantInstances;
};

export const useAddPlantInstance = () => {
  const garden = useAppSelector(selectSelectedGarden);

  const addPlantInstance = useCallback(
    async (data: Omit<PlantInstance, '_id'>, copiedFromId?: string) => {
      const lastHistoryEvent =
        data.history && data.history.length > 0 ? data.history[data.history.length - 1] : undefined;
      const location = lastHistoryEvent?.to;

      let newData = data;
      if (location) {
        newData = {
          ...data,
          containerId: location?.containerId,
          slotId: location?.slotId
        };
      }

      const response = await fetchEndpoint(Api.plantInstance_Post, {
        params: { gardenId: garden?._id ?? '' },
        body: toPlantInstanceDTO(newData),
        query: {
          copiedFromId
        }
      });

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromPlantInstanceDTO(response);
    },
    [garden?._id]
  );

  return addPlantInstance;
};

export const useUpdatePlantInstance = (_options: { skipRefresh?: boolean } = {}) => {
  const garden = useAppSelector(selectSelectedGarden);

  const updatePlantInstance = useCallback(
    async (data: PlantInstance) => {
      const lastHistoryEvent =
        data.history && data.history.length > 0 ? data.history[data.history.length - 1] : undefined;
      const location = lastHistoryEvent?.to;

      let newData = data;
      if (location) {
        newData = {
          ...data,
          containerId: location?.containerId,
          slotId: location?.slotId
        };
      }

      const response = await fetchEndpoint(Api.plantInstance_IdPut, {
        params: { gardenId: garden?._id ?? '', plantInstanceId: newData._id },
        body: toPlantInstanceDTO(newData)
      });

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromPlantInstanceDTO(response);
    },
    [garden?._id]
  );

  return updatePlantInstance;
};

export const useRemovePlantInstance = (plantInstance: PlantInstance | undefined) => {
  const garden = useAppSelector(selectSelectedGarden);

  const removePlantInstance = useCallback(async () => {
    if (isNullish(plantInstance?._id)) {
      return;
    }

    const response = await fetchEndpoint(Api.plantInstance_IdDelete, {
      params: { gardenId: garden?._id ?? '', plantInstanceId: plantInstance._id }
    });

    if (!response || typeof response === 'string') {
      return undefined;
    }

    return fromPlantInstanceDTO(response);
  }, [garden?._id, plantInstance?._id]);

  return removePlantInstance;
};

export function usePlantInstance(plantInstanceId: string | undefined | null) {
  const selector = useMemo(() => selectPlantInstanceById(plantInstanceId), [plantInstanceId]);
  const plantInstancesDto = useAppSelector(selector);

  return useMemo(() => (plantInstancesDto ? fromPlantInstanceDTO(plantInstancesDto) : undefined), [plantInstancesDto]);
}

export function usePlantInstances() {
  const plantInstancesDtos = useAppSelector(selectPlantInstances);
  const plantInstances = useMemo(() => plantInstancesDtos.map(fromPlantInstanceDTO), [plantInstancesDtos]);

  return plantInstances;
}

export function usePlantInstancesById() {
  const plantInstancesById = useAppSelector(selectPlantInstancesByIds);

  return useMemo(() => mapRecord(plantInstancesById, fromPlantInstanceDTO), [plantInstancesById]);
}

export function usePlantInstancesFromSlot(slot: Slot | undefined | null) {
  const plantInstancesById = usePlantInstancesById();
  return useMemo(
    () =>
      slot?.plantInstanceHistory
        ?.map((id) => plantInstancesById[id])
        .filter((plantInstance) => isNotNullish(plantInstance)) ?? [],
    [plantInstancesById, slot?.plantInstanceHistory]
  );
}

export const useFertilizePlantInstance = (plantInstanceId: string | undefined | null) => {
  const garden = useAppSelector(selectSelectedGarden);

  const fertilizePlantInstance = useCallback(
    async (date: Date) => {
      if (isNullish(plantInstanceId)) {
        return;
      }

      await fetchEndpoint(Api.plantInstance_FertilizePost, {
        params: { gardenId: garden?._id ?? '', plantInstanceId },
        body: { date: date.toISOString() }
      });
    },
    [plantInstanceId, garden?._id]
  );

  return fertilizePlantInstance;
};

export const useHarvestPlantInstance = (plantInstanceId: string | undefined | null) => {
  const garden = useAppSelector(selectSelectedGarden);

  const harvestPlantInstance = useCallback(
    async (date: Date) => {
      if (isNullish(plantInstanceId)) {
        return;
      }

      await fetchEndpoint(Api.plantInstance_HarvestPost, {
        params: { gardenId: garden?._id ?? '', plantInstanceId },
        body: { date: date.toISOString() }
      });
    },
    [plantInstanceId, garden?._id]
  );

  return harvestPlantInstance;
};

function hasPlant(data: Partial<PlantInstance>): data is Partial<PlantInstance> & { plant: PlantInstance['plant'] } {
  return data.plant !== undefined;
}

export const useUpdateCreatePlantInstance = (
  plantInstance: PlantInstance | undefined,
  location?: ContainerSlotIdentifier | null,
  container?: Container
) => {
  const addPlantInstance = useAddPlantInstance();
  const updatePlantInstance = useUpdatePlantInstance();

  const updateCreatePlantInstance = useCallback(
    (data: Partial<PlantInstance>): Promise<PlantInstance | undefined> => {
      if (!plantInstance) {
        if (!hasPlant(data) || !location) {
          return Promise.resolve(undefined);
        }

        const newPlantInstance: Omit<PlantInstance, '_id'> = {
          ...data,
          ...location,
          created: new Date(),
          startedFrom: container?.startedFrom ?? STARTED_FROM_TYPE_SEED,
          season: computeSeason()
        };

        return addPlantInstance(newPlantInstance);
      }

      const newPlantInstance: PlantInstance = {
        ...plantInstance,
        ...data
      };

      return updatePlantInstance(newPlantInstance);
    },
    [addPlantInstance, container?.startedFrom, location, plantInstance, updatePlantInstance]
  );

  return updateCreatePlantInstance;
};

export const useBulkReopenClosePlantInstances = () => {
  const garden = useAppSelector(selectSelectedGarden);

  const bulkReopenClosePlantInstances = useCallback(
    async (action: 'reopen' | 'close', plantInstanceIds: string[]) => {
      await fetchEndpoint(Api.plantInstance_BulkReopenClose, {
        params: { gardenId: garden?._id ?? '' },
        body: {
          action,
          plantInstanceIds
        }
      });
    },
    [garden?._id]
  );

  return bulkReopenClosePlantInstances;
};

export const useUpdatePlantInstanceTasksInContainer = (containerId: string | undefined, taskType: TaskType) => {
  const garden = useAppSelector(selectSelectedGarden);

  const updatePlantInstanceTasksInContainer = useCallback(
    async (date: Date, plantInstanceIds?: string[]) => {
      if (containerId === undefined) {
        return;
      }

      await fetchEndpoint(Api.container_UpdateTasksPost, {
        params: { gardenId: garden?._id ?? '', containerId, taskType },
        body: { date: date.toISOString(), plantInstanceIds }
      });
    },
    [containerId, garden?._id, taskType]
  );

  return updatePlantInstanceTasksInContainer;
};
