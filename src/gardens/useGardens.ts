import { useCallback, useMemo } from 'react';
import Api from '../api/api';
import { ExtraFetchOptions, fetchEndpoint } from '../api/useFetch';
import { Garden, fromGardenDTO, toGardenDTO } from '../interface';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectGarden, selectGardens, selectGardensById, updateGardens } from '../store/slices/gardens';
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

export const useAddGarden = () => {
  const addGarden = useCallback(async (data: Omit<Garden, '_id'>) => {
    const response = await fetchEndpoint(Api.garden_Post, {
      body: toGardenDTO(data)
    });

    if (!response || typeof response === 'string') {
      return undefined;
    }

    return fromGardenDTO(response);
  }, []);

  return addGarden;
};

export const useUpdateGarden = () => {
  const addGarden = useCallback(async (data: Garden) => {
    const response = await fetchEndpoint(Api.garden_IdPut, {
      params: {
        gardenId: data._id
      },
      body: toGardenDTO(data)
    });

    if (!response || typeof response === 'string') {
      return undefined;
    }

    return fromGardenDTO(response);
  }, []);

  return addGarden;
};

export const useRemoveGarden = () => {
  const removeGarden = useCallback(async (gardenId: string) => {
    const response = await fetchEndpoint(Api.garden_IdDelete, {
      params: {
        gardenId
      }
    });

    if (!response || typeof response === 'string') {
      return undefined;
    }

    return fromGardenDTO(response);
  }, []);

  return removeGarden;
};

export function useGarden(gardenId: string | undefined | null) {
  const selector = useMemo(() => selectGarden(gardenId ?? undefined), [gardenId]);
  const gardenDto = useAppSelector(selector);
  return useMemo(() => (gardenDto ? fromGardenDTO(gardenDto) : undefined), [gardenDto]);
}

export function useGardens() {
  const gardenDtos = useAppSelector(selectGardens);
  const gardens = useMemo(() => {
    const data = gardenDtos?.map(fromGardenDTO);
    data?.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }, [gardenDtos]);

  return gardens;
}

export function useGardensById() {
  const gardensById = useAppSelector(selectGardensById);

  return useMemo(() => mapRecord(gardensById, fromGardenDTO), [gardensById]);
}
