import { useCallback, useEffect } from 'react';
import Api from '../api/api';
import useFetch from '../api/useFetch';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPlantData, updatePlantData } from '../store/slices/static';

const useGetPlantData = () => {
  const fetch = useFetch();

  const getContainers = useCallback(async () => {
    const response = await fetch(Api.static_plantData_Get, {});
    return response;
  }, [fetch]);

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

      if (data && alive) {
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
