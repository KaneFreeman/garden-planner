import { useCallback, useEffect, useMemo } from 'react';
import { Container, fromPlantDTO, Plant, toPlantDTO } from '../interface';
import Api from '../api/api';
import useFetch, { ExtraFetchOptions } from '../api/useFetch';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPlant, selectPlants, updatePlants } from '../store/slices/plants';
import { useGetTasks } from '../tasks/hooks/useTasks';

export const useGetPlants = (options?: ExtraFetchOptions) => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();

  const getPlants = useCallback(async () => {
    const response = await fetch(Api.plant_Get, {}, options);

    if (response) {
      dispatch(updatePlants(response));
    }
  }, [dispatch, fetch, options]);

  return getPlants;
};

const usePlantOperation = (options?: ExtraFetchOptions) => {
  const getPlants = useGetPlants(options);
  const getTasks = useGetTasks();

  const runOperation = useCallback(
    async <T>(operation: () => Promise<T | undefined>) => {
      const response = await operation();

      if (!response) {
        return undefined;
      }

      await getPlants();
      await getTasks();

      return response;
    },
    [getPlants, getTasks]
  );

  return runOperation;
};

export const useAddPlant = () => {
  const fetch = useFetch();
  const runOperation = usePlantOperation({ force: true });

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
  const runOperation = usePlantOperation({ force: true });

  const addPlant = useCallback(
    async (data: Plant) => {
      const response = await runOperation(() =>
        fetch(Api.plant_IdPut, {
          params: {
            plantId: data._id
          },
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

export const useRemovePlant = () => {
  const fetch = useFetch();
  const runOperation = usePlantOperation({ force: true });

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

export function usePlant(plantId: string | undefined | null) {
  const getPlants = useGetPlants();
  const selector = useMemo(() => selectPlant(plantId ?? undefined), [plantId]);
  const plantDto = useAppSelector(selector);
  const plant = useMemo(() => (plantDto ? fromPlantDTO(plantDto) : undefined), [plantDto]);

  useEffect(() => {
    if (plantDto === undefined) {
      getPlants();
    }
  }, [getPlants, plantDto]);

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
      const uniquePlantsInContainers = containersToFilter
        .flatMap((container) => {
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
        })
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        });

      data = data.filter((plant) => uniquePlantsInContainers.includes(plant._id));
    }

    return data;
  }, [plantDtos, containersToFilter]);

  useEffect(() => {
    getPlants();
  }, [dispatch, getPlants]);

  return plants;
}
