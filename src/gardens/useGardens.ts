import { useCallback, useEffect, useMemo } from 'react';
import Api from '../api/api';
import { ExtraFetchOptions, fetchEndpoint } from '../api/useFetch';
import { Garden, fromGardenDTO, toGardenDTO } from '../interface';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectGarden, selectGardens, selectGardensById, updateGardens } from '../store/slices/gardens';
import { useGetTasks } from '../tasks/hooks/useTasks';
import { mapRecord } from '../utility/record.util';

export const useGetGardens = (options?: ExtraFetchOptions) => {
  const dispatch = useAppDispatch();

  const getGardens = useCallback(async () => {
    const response = await fetchEndpoint(Api.garden_Get, {}, options);

    if (response && typeof response !== 'string') {
      dispatch(updateGardens(response));
    }
  }, [dispatch, options]);

  return getGardens;
};

const useGardenOperation = (options?: ExtraFetchOptions) => {
  const getGardens = useGetGardens(options);
  const getTasks = useGetTasks(options);

  const runOperation = useCallback(
    async <T>(operation: () => Promise<T | undefined>) => {
      const response = await operation();

      if (!response) {
        return undefined;
      }

      await getGardens();
      await getTasks();

      return response;
    },
    [getGardens, getTasks]
  );

  return runOperation;
};

export const useAddGarden = () => {
  const runOperation = useGardenOperation({ force: true });

  const addGarden = useCallback(
    async (data: Omit<Garden, '_id'>) => {
      const response = await runOperation(() =>
        fetchEndpoint(Api.garden_Post, {
          body: toGardenDTO(data)
        })
      );

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromGardenDTO(response);
    },
    [runOperation]
  );

  return addGarden;
};

export const useUpdateGarden = () => {
  const runOperation = useGardenOperation({ force: true });

  const addGarden = useCallback(
    async (data: Garden) => {
      const response = await runOperation(() =>
        fetchEndpoint(Api.garden_IdPut, {
          params: {
            gardenId: data._id
          },
          body: toGardenDTO(data)
        })
      );

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromGardenDTO(response);
    },
    [runOperation]
  );

  return addGarden;
};

export const useRemoveGarden = () => {
  const runOperation = useGardenOperation({ force: true });

  const removeGarden = useCallback(
    async (gardenId: string) => {
      const response = await runOperation(() =>
        fetchEndpoint(Api.garden_IdDelete, {
          params: {
            gardenId
          }
        })
      );

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromGardenDTO(response);
    },
    [runOperation]
  );

  return removeGarden;
};

export function useGarden(gardenId: string | undefined | null) {
  const getGardens = useGetGardens();
  const selector = useMemo(() => selectGarden(gardenId ?? undefined), [gardenId]);
  const gardenDto = useAppSelector(selector);
  const garden = useMemo(() => (gardenDto ? fromGardenDTO(gardenDto) : undefined), [gardenDto]);

  useEffect(() => {
    if (gardenDto === undefined) {
      getGardens();
    }
  }, [getGardens, gardenDto]);

  return garden;
}

export function useGardens() {
  const getGardens = useGetGardens();
  const gardenDtos = useAppSelector(selectGardens);
  const gardens = useMemo(() => {
    const data = gardenDtos?.map(fromGardenDTO);
    data?.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }, [gardenDtos]);

  useEffect(() => {
    getGardens();
  }, [getGardens]);

  return gardens;
}

export function useGardensById() {
  const getGardens = useGetGardens();
  const gardensById = useAppSelector(selectGardensById);

  useEffect(() => {
    getGardens();
  }, [getGardens]);

  return useMemo(() => mapRecord(gardensById, fromGardenDTO), [gardensById]);
}
