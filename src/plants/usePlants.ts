import { useCallback, useEffect, useMemo } from 'react';
import { Container, fromPlantDTO, Plant, toPlantDTO } from '../interface';
import Api from '../api/api';
import useFetch from '../api/useFetch';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPlant, selectPlants, updatePlant, updatePlants } from '../store/slices/plants';

export const useGetPlants = () => {
  const fetch = useFetch();

  const getPlants = useCallback(async () => {
    const response = await fetch(Api.plant_Get, {});
    return response;
  }, [fetch]);

  return getPlants;
};

const usePlantOperation = () => {
  const getPlants = useGetPlants();
  const dispatch = useAppDispatch();

  const runOperation = useCallback(
    async <T>(operation: () => Promise<T | undefined>) => {
      const response = await operation();

      if (!response) {
        return undefined;
      }

      const plants = await getPlants();
      if (plants) {
        dispatch(updatePlants(plants));
      }

      return response;
    },
    [dispatch, getPlants]
  );

  return runOperation;
};

export const useAddPlant = () => {
  const fetch = useFetch();
  const runOperation = usePlantOperation();

  const addPlant = useCallback(
    async (data: Omit<Plant, '_id'>) => {
      const response = await runOperation(() =>
        fetch(Api.plant_Post, {
          body: toPlantDTO(data)
        })
      );

      if (!response) {
        return undefined;
      }

      return fromPlantDTO(response);
    },
    [fetch, runOperation]
  );

  return addPlant;
};

export const useUpdatePlant = () => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();

  const addPlant = useCallback(
    async (data: Plant) => {
      const response = await fetch(Api.plant_IdPut, {
        params: {
          plantId: data._id
        },
        body: toPlantDTO(data)
      });

      if (!response) {
        return undefined;
      }

      dispatch(updatePlant(response));

      return fromPlantDTO(response);
    },
    [dispatch, fetch]
  );

  return addPlant;
};

export const useRemovePlant = () => {
  const fetch = useFetch();
  const runOperation = usePlantOperation();

  const removePlant = useCallback(
    async (plantId: string) => {
      const response = await runOperation(() =>
        fetch(Api.plant_IdDelete, {
          params: {
            plantId
          }
        })
      );

      if (!response) {
        return undefined;
      }

      return fromPlantDTO(response);
    },
    [fetch, runOperation]
  );

  return removePlant;
};

export function usePlant(plantId: string | undefined) {
  const fetch = useFetch();
  const dispatch = useAppDispatch();
  const plantDto = useAppSelector(selectPlant);
  const plant = useMemo(() => (plantDto ? fromPlantDTO(plantDto) : undefined), [plantDto]);

  useEffect(() => {
    if (plantId === undefined) {
      return () => {};
    }

    let alive = true;

    const getPlantsCall = async () => {
      const data = await fetch(Api.plant_IdGet, {
        params: {
          plantId
        }
      });

      if (data && alive) {
        dispatch(updatePlant(data));
      }
    };

    getPlantsCall();

    return () => {
      alive = false;
    };
  }, [dispatch, fetch, plantId]);

  return plant;
}

export function usePlants(containersToFilter?: Container[]) {
  const getPlants = useGetPlants();
  const dispatch = useAppDispatch();
  const plantDtos = useAppSelector(selectPlants);
  const plants = useMemo(() => {
    let data = plantDtos.map(fromPlantDTO);
    data.sort((a, b) => a.name.localeCompare(b.name));

    if (containersToFilter) {
      const uniquePlantsInContainers = containersToFilter.flatMap((container) => {
        const slots = container.slots ?? {};
        return Object.keys(slots).flatMap((slotId) => {
          const slot = slots[+slotId];
          const plantIds: string[] = [];
          if (slot.plant) {
            plantIds.push(slot.plant);
          }

          if (slot.subSlot?.plant) {
            plantIds.push(slot.subSlot.plant);
          }
          return plantIds;
        });
      }).filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      data = data.filter((plant) => uniquePlantsInContainers.includes(plant._id));
    }

    return data;
  }, [plantDtos, containersToFilter]);

  useEffect(() => {
    let alive = true;

    const getPlantsCall = async () => {
      const data = await getPlants();

      if (data && alive) {
        dispatch(updatePlants(data));
      }
    };

    getPlantsCall();

    return () => {
      alive = false;
    };
  }, [dispatch, getPlants]);

  return plants;
}
