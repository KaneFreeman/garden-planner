import { useCallback, useEffect, useMemo } from 'react';
import Api from '../../api/api';
import { ExtraFetchOptions, fetchEndpoint } from '../../api/useFetch';
import { Container, fromContainerDTO, fromPlantInstanceDTO, toContainerDTO } from '../../interface';
import { useGetPlantInstances } from '../../plant-instances/hooks/usePlantInstances';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectContainer,
  selectContainers,
  selectContainersById,
  updateContainers
} from '../../store/slices/containers';
import { selectSelectedGarden } from '../../store/slices/gardens';
import { useGetTasks } from '../../tasks/hooks/useTasks';
import { mapRecord } from '../../utility/record.util';

export const useGetContainers = (options?: ExtraFetchOptions) => {
  const dispatch = useAppDispatch();
  const garden = useAppSelector(selectSelectedGarden);

  const getContainers = useCallback(async () => {
    const response = await fetchEndpoint(Api.container_Get, { params: { gardenId: garden?._id ?? '' } }, options);

    if (response && typeof response !== 'string') {
      dispatch(updateContainers(response));
    }
  }, [dispatch, garden?._id, options]);

  return getContainers;
};

const useContainerOperation = (options?: ExtraFetchOptions) => {
  const getContainers = useGetContainers(options);
  const getTasks = useGetTasks(options);

  const runOperation = useCallback(
    async <T>(operation: () => Promise<T | undefined>) => {
      const response = await operation();

      await getContainers();
      await getTasks();

      if (!response) {
        return undefined;
      }

      return response;
    },
    [getContainers, getTasks]
  );

  return runOperation;
};

export const useAddContainer = () => {
  const runOperation = useContainerOperation({ force: true });
  const garden = useAppSelector(selectSelectedGarden);

  const addContainer = useCallback(
    async (data: Omit<Container, '_id'>) => {
      const response = await runOperation(() =>
        fetchEndpoint(Api.container_Post, {
          params: { gardenId: garden?._id ?? '' },
          body: toContainerDTO(data)
        })
      );

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromContainerDTO(response);
    },
    [garden?._id, runOperation]
  );

  return addContainer;
};

export const useUpdateContainer = () => {
  const runOperation = useContainerOperation({ force: true });
  const garden = useAppSelector(selectSelectedGarden);

  const updateContainer = useCallback(
    async (data: Container) => {
      const response = await runOperation(() =>
        fetchEndpoint(Api.container_IdPut, {
          params: { gardenId: garden?._id ?? '', containerId: data._id },
          body: toContainerDTO(data)
        })
      );

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromContainerDTO(response);
    },
    [garden?._id, runOperation]
  );

  return updateContainer;
};

export const useRemoveContainer = () => {
  const runOperation = useContainerOperation({ force: true });
  const garden = useAppSelector(selectSelectedGarden);

  const removeContainer = useCallback(
    async (containerId: string) => {
      const response = await runOperation(() =>
        fetchEndpoint(Api.container_IdDelete, {
          params: { gardenId: garden?._id ?? '', containerId }
        })
      );

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromContainerDTO(response);
    },
    [garden?._id, runOperation]
  );

  return removeContainer;
};

export function useContainer(containerId: string | undefined) {
  const getContainers = useGetContainers();
  const selector = useMemo(() => selectContainer(containerId), [containerId]);
  const containerDto = useAppSelector(selector);

  useEffect(() => {
    if (containerDto === undefined) {
      getContainers();
    }
  }, [containerDto, getContainers]);

  return useMemo(() => (containerDto ? fromContainerDTO(containerDto) : undefined), [containerDto]);
}

export function useContainers() {
  const getContainers = useGetContainers();
  const containerDtos = useAppSelector(selectContainers);
  const containers = useMemo(() => {
    const data = containerDtos.map(fromContainerDTO);
    data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }, [containerDtos]);

  useEffect(() => {
    getContainers();
  }, [getContainers]);

  return containers;
}

export function useContainersById() {
  const getContainers = useGetContainers();
  const containerDtos = useAppSelector(selectContainersById);
  const containersById = useMemo(() => mapRecord(containerDtos, fromContainerDTO), [containerDtos]);

  useEffect(() => {
    getContainers();
  }, [getContainers]);

  return containersById;
}

export const useFinishPlanningContainer = (containerId: string | undefined) => {
  const garden = useAppSelector(selectSelectedGarden);
  const getPlantInstances = useGetPlantInstances({ force: true });
  const getContainers = useGetContainers({ force: true });
  const getTasks = useGetTasks({ force: true });

  const finishPlanningContainer = useCallback(async () => {
    const response = await fetchEndpoint(Api.container_FinishPlanningPost, {
      params: { containerId: containerId ?? '', gardenId: garden?._id ?? '' }
    });

    await getPlantInstances();
    await getTasks();
    await getContainers();

    if (response === undefined || typeof response === 'string') {
      return 0;
    }

    return response;
  }, [containerId, garden?._id, getContainers, getPlantInstances, getTasks]);

  return finishPlanningContainer;
};

export const usePlanContainerSlot = (containerId: string | undefined) => {
  const garden = useAppSelector(selectSelectedGarden);
  const getPlantInstances = useGetPlantInstances({ force: true });
  const getContainers = useGetContainers({ force: true });
  const getTasks = useGetTasks({ force: true });

  const planContainerSlot = useCallback(
    async (slotId: number, plantId: string) => {
      const response = await fetchEndpoint(Api.container_PlanSlotPost, {
        params: { containerId: containerId ?? '', gardenId: garden?._id ?? '' },
        body: { slotId, plantId }
      });

      await getPlantInstances();
      await getTasks();
      await getContainers();

      if (response === undefined || typeof response === 'string') {
        return undefined;
      }

      return fromPlantInstanceDTO(response);
    },
    [containerId, garden?._id, getContainers, getPlantInstances, getTasks]
  );

  return planContainerSlot;
};
