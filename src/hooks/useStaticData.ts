import { useCallback } from 'react';
import Api from '../api/api';
import { ExtraFetchOptions, fetchEndpoint } from '../api/useFetch';
import { useAppSelector } from '../store/hooks';
import { selectPlantData } from '../store/slices/static';

export const useGetPlantData = (options?: ExtraFetchOptions) => {
  const getContainers = useCallback(async () => {
    const response = await fetchEndpoint(Api.static_plantData_Get, {}, options);
    return response;
  }, [options]);

  return getContainers;
};

export function usePlantData() {
  return useAppSelector(selectPlantData);
}
