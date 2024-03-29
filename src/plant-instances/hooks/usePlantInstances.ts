/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { useCallback, useEffect, useMemo } from 'react';
import Api from '../../api/api';
import useFetch, { ExtraFetchOptions } from '../../api/useFetch';
import { useGetContainers } from '../../containers/hooks/useContainers';
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
import {
  selectPlantInstanceById,
  selectPlantInstances,
  selectPlantInstancesByIds,
  updatePlantInstances
} from '../../store/slices/plant-instances';
import { useGetTasks } from '../../tasks/hooks/useTasks';
import { isNotNullish, isNullish } from '../../utility/null.util';
import { mapRecord } from '../../utility/record.util';
import computeSeason from '../../utility/season.util';

export const useGetPlantInstances = (options?: ExtraFetchOptions) => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();

  const getPlantInstances = useCallback(async () => {
    const response = await fetch(Api.plantInstance_Get, {}, options);

    if (response) {
      dispatch(updatePlantInstances(response));
    }
  }, [dispatch, fetch, options]);

  return getPlantInstances;
};

const usePlantInstanceOperation = (options?: ExtraFetchOptions) => {
  const getPlantInstances = useGetPlantInstances(options);
  const getTasks = useGetTasks(options);
  const getContainers = useGetContainers(options);

  const runOperation = useCallback(
    async <T>(operation: () => Promise<T | undefined>) => {
      const response = await operation();

      if (!response) {
        return undefined;
      }

      await getPlantInstances();
      await getContainers();
      await getTasks();

      return response;
    },
    [getContainers, getPlantInstances, getTasks]
  );

  return runOperation;
};

export const useAddPlantInstance = () => {
  const fetch = useFetch();
  const runOperation = usePlantInstanceOperation({ force: true });

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
          slotId: location?.slotId,
          subSlot: location?.subSlot
        };
      }

      const response = await runOperation(() =>
        fetch(Api.plantInstance_Post, {
          body: toPlantInstanceDTO(newData),
          query: {
            copiedFromId
          }
        })
      );

      if (!response) {
        return undefined;
      }

      return fromPlantInstanceDTO(response);
    },
    [fetch, runOperation]
  );

  return addPlantInstance;
};

export const useUpdatePlantInstance = () => {
  const fetch = useFetch();
  const runOperation = usePlantInstanceOperation({ force: true });

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
          slotId: location?.slotId,
          subSlot: location?.subSlot
        };
      }

      const response = await runOperation(() =>
        fetch(Api.plantInstance_IdPut, {
          params: {
            plantInstanceId: newData._id
          },
          body: toPlantInstanceDTO(newData)
        })
      );

      if (!response) {
        return undefined;
      }

      return fromPlantInstanceDTO(response);
    },
    [fetch, runOperation]
  );

  return updatePlantInstance;
};

export const useRemovePlantInstance = () => {
  const fetch = useFetch();
  const runOperation = usePlantInstanceOperation({ force: true });

  const removePlantInstance = useCallback(
    async (plantInstanceId: string) => {
      const response = await runOperation(() =>
        fetch(Api.plantInstance_IdDelete, {
          params: {
            plantInstanceId
          }
        })
      );

      if (!response) {
        return undefined;
      }

      return fromPlantInstanceDTO(response);
    },
    [fetch, runOperation]
  );

  return removePlantInstance;
};

export function usePlantInstance(plantInstanceId: string | undefined | null) {
  const getPlantInstances = useGetPlantInstances();
  const selector = useMemo(() => selectPlantInstanceById(plantInstanceId), [plantInstanceId]);
  const plantInstancesDto = useAppSelector(selector);

  useEffect(() => {
    if (plantInstancesDto === undefined) {
      getPlantInstances();
    }
  }, [plantInstancesDto, getPlantInstances]);

  return useMemo(() => (plantInstancesDto ? fromPlantInstanceDTO(plantInstancesDto) : undefined), [plantInstancesDto]);
}

export function usePlantInstances() {
  const getPlantInstances = useGetPlantInstances();
  const plantInstancesDtos = useAppSelector(selectPlantInstances);
  const plantInstances = useMemo(() => plantInstancesDtos.map(fromPlantInstanceDTO), [plantInstancesDtos]);

  useEffect(() => {
    getPlantInstances();
  }, [getPlantInstances]);

  return plantInstances;
}

export function usePlantInstancesById() {
  const getPlantInstances = useGetPlantInstances();
  const plantInstancesById = useAppSelector(selectPlantInstancesByIds);

  useEffect(() => {
    getPlantInstances();
  }, [getPlantInstances]);

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
  const fetch = useFetch();
  const runOperation = usePlantInstanceOperation();

  const fertilizePlantInstance = useCallback(
    async (date: Date) => {
      if (isNullish(plantInstanceId)) {
        return;
      }

      await runOperation(() =>
        fetch(Api.plantInstance_FertilizePost, {
          params: { plantInstanceId },
          body: { date: date.toISOString() }
        })
      );
    },
    [plantInstanceId, fetch, runOperation]
  );

  return fertilizePlantInstance;
};

export const useHarvestPlantInstance = (plantInstanceId: string | undefined | null) => {
  const fetch = useFetch();
  const runOperation = usePlantInstanceOperation();

  const harvestPlantInstance = useCallback(
    async (date: Date) => {
      if (isNullish(plantInstanceId)) {
        return;
      }

      await runOperation(() =>
        fetch(Api.plantInstance_HarvestPost, {
          params: { plantInstanceId },
          body: { date: date.toISOString() }
        })
      );
    },
    [plantInstanceId, fetch, runOperation]
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
          plantedCount: 1,
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
  const fetch = useFetch();
  const runOperation = usePlantInstanceOperation({ force: true });

  const bulkReopenClosePlantInstances = useCallback(
    async (action: 'reopen' | 'close', plantInstanceIds: string[]) => {
      await runOperation(() =>
        fetch(Api.plantInstance_BulkReopenClose, {
          body: {
            action,
            plantInstanceIds
          }
        })
      );
    },
    [fetch, runOperation]
  );

  return bulkReopenClosePlantInstances;
};

export const useUpdatePlantInstanceTasksInContainer = (containerId: string | undefined, taskType: TaskType) => {
  const fetch = useFetch();
  const runOperation = usePlantInstanceOperation({ force: true });

  const updatePlantInstanceTasksInContainer = useCallback(
    async (date: Date, plantInstanceIds?: string[]) => {
      if (containerId === undefined) {
        return;
      }

      await runOperation(() =>
        fetch(Api.container_UpdateTasksPost, {
          params: { containerId, taskType },
          body: { date: date.toISOString(), plantInstanceIds }
        })
      );
    },
    [containerId, fetch, runOperation, taskType]
  );

  return updatePlantInstanceTasksInContainer;
};
