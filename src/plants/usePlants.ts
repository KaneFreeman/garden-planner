import { useCallback, useMemo } from 'react';
import Api from '../api/api';
import { type ExtraFetchOptions, fetchEndpoint } from '../api/useFetch';
import { Container, Plant, fromPlantDTO, toPlantDTO } from '../interface';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPlantInstancesByContainers } from '../store/slices/plant-instances';
import { selectPlant, selectPlants, selectPlantsById, updatePlants } from '../store/slices/plants';
import { isNotNullish } from '../utility/null.util';
import { mapRecord } from '../utility/record.util';

export const useGetPlants = (options?: ExtraFetchOptions) => {
  const dispatch = useAppDispatch();

  const getPlants = useCallback(async () => {
    const response = await fetchEndpoint(Api.plant_Get, {}, options);

    if (response && typeof response !== 'string') {
      dispatch(updatePlants(response));
    }
  }, [dispatch, options]);

  return getPlants;
};

export const useAddPlant = () => {
  const addPlant = useCallback(async (data: Omit<Plant, '_id'>) => {
    const response = await fetchEndpoint(Api.plant_Post, {
      body: toPlantDTO(data)
    });

    if (!response || typeof response === 'string') {
      return undefined;
    }

    return fromPlantDTO(response);
  }, []);

  return addPlant;
};

export const useUpdatePlant = () => {
  const addPlant = useCallback(async (data: Plant) => {
    const response = await fetchEndpoint(Api.plant_IdPut, {
      params: {
        plantId: data._id
      },
      body: toPlantDTO(data)
    });

    if (!response || typeof response === 'string') {
      return undefined;
    }

    return fromPlantDTO(response);
  }, []);

  return addPlant;
};

export const useRemovePlant = () => {
  const removePlant = useCallback(async (plantId: string) => {
    const response = await fetchEndpoint(Api.plant_IdDelete, {
      params: {
        plantId
      }
    });

    if (!response || typeof response === 'string') {
      return undefined;
    }

    return fromPlantDTO(response);
  }, []);

  return removePlant;
};

export function usePlant(plantId: string | undefined | null) {
  const selector = useMemo(() => selectPlant(plantId ?? undefined), [plantId]);
  const plantDto = useAppSelector(selector);
  return useMemo(() => (plantDto ? fromPlantDTO(plantDto) : undefined), [plantDto]);
}

export function usePlants(containersToFilter?: Container[]) {
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

  return plants;
}

export function usePlantsById() {
  const plantsById = useAppSelector(selectPlantsById);

  return useMemo(() => mapRecord(plantsById, fromPlantDTO), [plantsById]);
}
