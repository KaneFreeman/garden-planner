import type { Plant } from '../interface';

export function getPlantTitle(plant: Plant, name?: string) {
  const plantName = name ?? plant.name;

  return `${plant.type && plant.type !== plantName ? `${plant.type} - ` : ''}${plantName}`;
}
