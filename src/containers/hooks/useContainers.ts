import { useCallback, useEffect, useMemo } from 'react';
import { fromContainerDTO, Container, toContainerDTO } from '../../interface';
import Api from '../../api/api';
import useFetch from '../../api/useFetch';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectContainer, selectContainers, updateContainers } from '../../store/slices/containers';
import { useGetTasks } from '../../tasks/hooks/useTasks';

const useGetContainers = () => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();

  const getContainers = useCallback(async () => {
    const response = await fetch(Api.container_Get, {});

    if (response) {
      dispatch(updateContainers(response));
    }
  }, [dispatch, fetch]);

  return getContainers;
};

const useContainerOperation = () => {
  const getContainers = useGetContainers();
  const getTasks = useGetTasks();

  const runOperation = useCallback(
    async <T>(operation: () => Promise<T | undefined>) => {
      const response = await operation();

      if (!response) {
        return undefined;
      }

      await getContainers();
      await getTasks();

      return response;
    },
    [getContainers, getTasks]
  );

  return runOperation;
};

export const useAddContainer = () => {
  const fetch = useFetch();
  const runOperation = useContainerOperation();

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
  const runOperation = useContainerOperation();

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
  const runOperation = useContainerOperation();

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
  const selector = useMemo(() => selectContainer(containerId), [containerId]);
  const containerDto = useAppSelector(selector);
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
