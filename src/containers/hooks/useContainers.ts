import { useCallback, useMemo } from 'react';
import Api from '../../api/api';
import { ExtraFetchOptions, fetchEndpoint } from '../../api/useFetch';
import { Container, fromContainerDTO, toContainerDTO } from '../../interface';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectContainer,
  selectContainers,
  selectContainersById,
  updateContainers
} from '../../store/slices/containers';
import { selectSelectedGarden } from '../../store/slices/gardens';
import { mapRecord } from '../../utility/record.util';

export const useGetContainers = (options?: ExtraFetchOptions) => {
  const dispatch = useAppDispatch();
  const garden = useAppSelector(selectSelectedGarden);

  const getContainers = useCallback(async () => {
    if (!garden?._id) {
      return undefined;
    }

    const response = await fetchEndpoint(Api.container_Get, { params: { gardenId: garden._id } }, options);

    if (response && typeof response !== 'string') {
      dispatch(updateContainers(response));
    }

    return response;
  }, [dispatch, garden?._id, options]);

  return getContainers;
};

export const useAddContainer = () => {
  const garden = useAppSelector(selectSelectedGarden);

  const addContainer = useCallback(
    async (data: Omit<Container, '_id'>) => {
      const response = await fetchEndpoint(Api.container_Post, {
        params: { gardenId: garden?._id ?? '' },
        body: toContainerDTO(data)
      });

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromContainerDTO(response);
    },
    [garden?._id]
  );

  return addContainer;
};

export const useUpdateContainer = () => {
  const garden = useAppSelector(selectSelectedGarden);

  const updateContainer = useCallback(
    async (data: Container) => {
      const response = await fetchEndpoint(Api.container_IdPut, {
        params: { gardenId: garden?._id ?? '', containerId: data._id },
        body: toContainerDTO(data)
      });

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromContainerDTO(response);
    },
    [garden?._id]
  );

  return updateContainer;
};

export const useRemoveContainer = () => {
  const garden = useAppSelector(selectSelectedGarden);

  const removeContainer = useCallback(
    async (containerId: string) => {
      const response = await fetchEndpoint(Api.container_IdDelete, {
        params: { gardenId: garden?._id ?? '', containerId }
      });

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromContainerDTO(response);
    },
    [garden?._id]
  );

  return removeContainer;
};

export function useContainer(containerId: string | undefined) {
  const selector = useMemo(() => selectContainer(containerId), [containerId]);
  const containerDto = useAppSelector(selector);

  return useMemo(() => (containerDto ? fromContainerDTO(containerDto) : undefined), [containerDto]);
}

export function useContainers() {
  const containerDtos = useAppSelector(selectContainers);
  const containers = useMemo(() => {
    const data = containerDtos.map(fromContainerDTO);
    data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }, [containerDtos]);

  return containers;
}

export function useContainersById() {
  const containerDtos = useAppSelector(selectContainersById);
  const containersById = useMemo(() => mapRecord(containerDtos, fromContainerDTO), [containerDtos]);

  return containersById;
}

export const useFinishPlanningContainer = (containerId: string | undefined) => {
  const garden = useAppSelector(selectSelectedGarden);

  const finishPlanningContainer = useCallback(async () => {
    const response = await fetchEndpoint(Api.container_FinishPlanningPost, {
      params: { containerId: containerId ?? '', gardenId: garden?._id ?? '' }
    });

    if (response === undefined || typeof response === 'string') {
      return 0;
    }

    return response;
  }, [containerId, garden?._id]);

  return finishPlanningContainer;
};
