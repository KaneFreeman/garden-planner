import { useCallback, useEffect } from 'react';
import Api from '../api/api';
import { fetchEndpoint } from '../api/useFetch';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPlantData, updatePlantData } from '../store/slices/static';

const useGetPlantData = () => {
  const getContainers = useCallback(async () => {
    const response = await fetchEndpoint(Api.static_plantData_Get, {});
    return response;
  }, []);

  return getContainers;
};

export function usePlantData() {
  const getPlantData = useGetPlantData();
  const dispatch = useAppDispatch();
  const plantData = useAppSelector(selectPlantData);

  useEffect(() => {
    if (plantData) {
      return () => {};
    }

    let alive = true;

    const getContainersCall = async () => {
      const data = await getPlantData();

      if (alive && data && typeof data !== 'string') {
        dispatch(updatePlantData(data));
      }
    };

    getContainersCall();

    return () => {
      alive = false;
    };
  }, [dispatch, getPlantData, plantData]);

  return plantData;
}
