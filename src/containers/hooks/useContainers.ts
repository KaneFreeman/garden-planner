import { useCallback, useEffect, useMemo } from 'react';
import { fromContainerDTO, Container, toContainerDTO, TaskType } from '../../interface';
import Api from '../../api/api';
import useFetch, { ExtraFetchOptions } from '../../api/useFetch';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectContainer,
  selectContainers,
  selectContainersById,
  updateContainers
} from '../../store/slices/containers';
import { useGetTasks } from '../../tasks/hooks/useTasks';
import { mapRecord } from '../../utility/record.util';

export const useGetContainers = (options?: ExtraFetchOptions) => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();

  const getContainers = useCallback(async () => {
    const response = await fetch(Api.container_Get, {}, options);

    if (response) {
      dispatch(updateContainers(response));
    }
  }, [dispatch, fetch, options]);

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
  const fetch = useFetch();
  const runOperation = useContainerOperation({ force: true });

  const addContainer = useCallback(
    async (data: Omit<Container, '_id'>) => {
      const response = await runOperation(() =>
        fetch(Api.container_Post, {
          body: toContainerDTO(data)
        })
      );

      if (!response) {
        return undefined;
      }

      return fromContainerDTO(response);
    },
    [fetch, runOperation]
  );

  return addContainer;
};

export const useUpdateContainer = () => {
  const fetch = useFetch();
  const runOperation = useContainerOperation({ force: true });

  const addContainer = useCallback(
    async (data: Container) => {
      const response = await runOperation(() =>
        fetch(Api.container_IdPut, {
          params: {
            containerId: data._id
          },
          body: toContainerDTO(data)
        })
      );

      if (!response) {
        return undefined;
      }

      return fromContainerDTO(response);
    },
    [fetch, runOperation]
  );

  return addContainer;
};

export const useRemoveContainer = () => {
  const fetch = useFetch();
  const runOperation = useContainerOperation({ force: true });

  const removeContainer = useCallback(
    async (containerId: string) => {
      const response = await runOperation(() =>
        fetch(Api.container_IdDelete, {
          params: {
            containerId
          }
        })
      );

      if (!response) {
        return undefined;
      }

      return fromContainerDTO(response);
    },
    [fetch, runOperation]
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

export const useUpdateContainerTasks = (containerId: string | undefined, taskType: TaskType) => {
  const fetch = useFetch();
  const runOperation = useContainerOperation({ force: true });

  const updateContainerTasks = useCallback(
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

  return updateContainerTasks;
};
