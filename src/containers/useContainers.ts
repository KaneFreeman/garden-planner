import { useCallback, useEffect, useMemo } from 'react';
import { fromContainerDTO, Container, toContainerDTO } from '../interface';
import Api from '../api/api';
import useFetch from '../api/useFetch';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectContainer, selectContainers, updateContainer, updateContainers } from '../store/slices/containers';

export const useGetContainers = () => {
  const fetch = useFetch();

  const getContainers = useCallback(async () => {
    const response = await fetch(Api.container_Get, {});
    return response;
  }, [fetch]);

  return getContainers;
};

const useContainerOperation = () => {
  const getContainers = useGetContainers();
  const dispatch = useAppDispatch();

  const runOperation = useCallback(
    async <T>(operation: () => Promise<T | undefined>) => {
      const response = await operation();

      if (!response) {
        return undefined;
      }

      const containers = await getContainers();
      if (containers) {
        dispatch(updateContainers(containers));
      }

      return response;
    },
    [dispatch, getContainers]
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
  const dispatch = useAppDispatch();

  const addContainer = useCallback(
    async (data: Container) => {
      const response = await fetch(Api.container_IdPut, {
        params: {
          containerId: data._id
        },
        body: toContainerDTO(data)
      });

      if (!response) {
        return undefined;
      }

      dispatch(updateContainer(response));

      return fromContainerDTO(response);
    },
    [dispatch, fetch]
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
  const fetch = useFetch();
  const dispatch = useAppDispatch();
  const containerDto = useAppSelector(selectContainer);
  const container = useMemo(() => (containerDto ? fromContainerDTO(containerDto) : undefined), [containerDto]);

  useEffect(() => {
    if (containerId === undefined) {
      return () => {};
    }

    let alive = true;

    const getContainersCall = async () => {
      const data = await fetch(Api.container_IdGet, {
        params: {
          containerId
        }
      });

      if (data && alive) {
        dispatch(updateContainer(data));
      }
    };

    getContainersCall();

    return () => {
      alive = false;
    };
  }, [dispatch, fetch, containerId]);

  return container;
}

export function useContainers() {
  const getContainers = useGetContainers();
  const dispatch = useAppDispatch();
  const containerDtos = useAppSelector(selectContainers);
  const containers = useMemo(() => {
    const data = containerDtos.map(fromContainerDTO);
    data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }, [containerDtos]);

  useEffect(() => {
    let alive = true;

    const getContainersCall = async () => {
      const data = await getContainers();

      if (data && alive) {
        dispatch(updateContainers(data));
      }
    };

    getContainersCall();

    return () => {
      alive = false;
    };
  }, [dispatch, getContainers]);

  return containers;
}
