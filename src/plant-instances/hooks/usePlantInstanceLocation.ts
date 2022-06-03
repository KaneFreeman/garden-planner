import { useMemo } from 'react';
import { ContainerSlotIdentifier, PlantInstance } from '../../interface';

export function getPlantInstanceLocation(instance: PlantInstance | undefined): ContainerSlotIdentifier | null {
  if (!instance || !instance.history || !instance.history.length) {
    return null;
  }

  return instance.history[instance.history.length - 1].to ?? null;
}

export function usePlantInstanceLocation(instance: PlantInstance | undefined): ContainerSlotIdentifier | null {
  return useMemo(() => getPlantInstanceLocation(instance), [instance]);
}
