import { useCallback, useEffect, useMemo } from 'react';
import Api from '../api/api';
import useFetch, { ExtraFetchOptions } from '../api/useFetch';
import { Container, Plant, fromPlantDTO, toPlantDTO } from '../interface';
import { useGetPlantInstances } from '../plant-instances/hooks/usePlantInstances';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPlantInstancesByContainers } from '../store/slices/plant-instances';
import { selectPlant, selectPlants, selectPlantsById, updatePlants } from '../store/slices/plants';
import { useGetTasks } from '../tasks/hooks/useTasks';
import { isNotNullish } from '../utility/null.util';
import { mapRecord } from '../utility/record.util';

export const useGetPlants = (options?: ExtraFetchOptions) => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();

  const getPlants = useCallback(async () => {
    const response = await fetch(Api.plant_Get, {}, options);

    if (response && typeof response !== 'string') {
      dispatch(updatePlants(response));
    }
  }, [dispatch, fetch, options]);

  return getPlants;
};

const usePlantOperation = (options?: ExtraFetchOptions) => {
  const getPlants = useGetPlants(options);
  const getTasks = useGetTasks(options);

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

      if (!response || typeof response === 'string') {
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

      if (!response || typeof response === 'string') {
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

      if (!response || typeof response === 'string') {
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
  const getPlantInstances = useGetPlantInstances();
  const plantDtos = useAppSelector(selectPlants);
  const plantInstancesByContainer = useAppSelector(selectPlantInstancesByContainers);
  const plants = useMemo(() => {
    let data = plantDtos.map(fromPlantDTO);
    data.sort((a, b) => {
      let result: number;
      if (a.type == null && b.type == null) {
        result = 0;
      } else if (a.type == null) {
        result = -1;
      } else if (b.type == null) {
        result = 1;
      } else {
        result = a.type.localeCompare(b.type);
      }

      if (result === 0) {
        return a.name.localeCompare(b.name);
      }

      return result;
    });

    if (containersToFilter) {
      const uniquePlantsInContainers = containersToFilter
        .flatMap((container) => {
          return [
            ...(plantInstancesByContainer[container._id]
              ?.filter((plantInstance) => plantInstance.closed !== true && isNotNullish(plantInstance.plant))
              .map((plantInstance) => plantInstance.plant) ?? []),
            ...Object.values(container.slots ?? {})
              .filter((s) => !s.plantInstanceId && s.plant)
              .map((s) => s.plant)
          ];
        })
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        });

      data = data.filter((plant) => uniquePlantsInContainers.includes(plant._id));
    }

    return data;
  }, [plantDtos, containersToFilter, plantInstancesByContainer]);

  useEffect(() => {
    getPlants();
    getPlantInstances();
  }, [getPlantInstances, getPlants]);

  return plants;
}

export function usePlantsById() {
  const getPlants = useGetPlants();
  const plantsById = useAppSelector(selectPlantsById);

  useEffect(() => {
    getPlants();
  }, [getPlants]);

  return useMemo(() => mapRecord(plantsById, fromPlantDTO), [plantsById]);
}
