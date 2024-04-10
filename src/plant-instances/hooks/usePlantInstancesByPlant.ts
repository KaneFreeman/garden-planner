import { useEffect, useMemo } from 'react';
import { fromPlantInstanceDTO, PlantInstance } from '../../interface';
import { useAppSelector } from '../../store/hooks';
import { selectPlantInstancesByPlant } from '../../store/slices/plant-instances';
import { useGetPlantInstances } from './usePlantInstances';

export default function usePlantInstancesByPlant(plantId: string | undefined): PlantInstance[] {
  const getPlantInstances = useGetPlantInstances();

  const selector = useMemo(() => selectPlantInstancesByPlant(plantId), [plantId]);
  const plantInstanceDTOs = useAppSelector(selector);

  useEffect(() => {
    getPlantInstances();
  }, [getPlantInstances]);

  return useMemo(() => (plantInstanceDTOs ?? []).map(fromPlantInstanceDTO), [plantInstanceDTOs]);
}
