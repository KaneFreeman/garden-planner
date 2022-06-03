import { useMemo } from 'react';
import { fromPlantInstanceDTO, PlantInstance } from '../../interface';
import { useAppSelector } from '../../store/hooks';
import { selectPlantInstancesByPlant } from '../../store/slices/plant-instances';

export default function usePlantInstancesByPlant(plantId: string | undefined): PlantInstance[] {
  const selector = useMemo(() => selectPlantInstancesByPlant(plantId), [plantId]);
  const plantInstanceDTOs = useAppSelector(selector);
  return useMemo(() => plantInstanceDTOs.map(fromPlantInstanceDTO), [plantInstanceDTOs]);
}
