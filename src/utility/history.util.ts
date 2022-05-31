import { ContainerSlotIdentifier, PlantInstance, HistoryStatus, TRANSPLANTED } from '../interface';

export function findHistoryFrom(
  plantInstance: PlantInstance | undefined | null,
  from: ContainerSlotIdentifier,
  status?: HistoryStatus
) {
  if (!plantInstance) {
    return undefined;
  }

  return plantInstance.history?.find((entry) => {
    const fromMatch =
      entry.from?.containerId === from.containerId &&
      entry.from?.slotId === from.slotId &&
      entry.from?.subSlot === from.subSlot;

    if (status) {
      return fromMatch && entry.status === status;
    }

    return fromMatch;
  });
}

export function findHistoryTo(
  plantInstance: PlantInstance | undefined | null,
  from: ContainerSlotIdentifier,
  status?: HistoryStatus
) {
  if (!plantInstance) {
    return undefined;
  }

  return plantInstance.history?.find((entry) => {
    const fromMatch =
      entry.from?.containerId === from.containerId &&
      entry.from?.slotId === from.slotId &&
      entry.from?.subSlot === from.subSlot;

    if (status) {
      return fromMatch && entry.status === status;
    }

    return fromMatch;
  });
}

export function getPlantedEvent(plantInstance: PlantInstance | undefined | null) {
  return plantInstance?.history?.[0];
}

export function getPlantedDate(plantInstance: PlantInstance | undefined | null) {
  return getPlantedEvent(plantInstance)?.date ?? null;
}

export function getTransplantedDate(plantInstance: PlantInstance | undefined | null, from: ContainerSlotIdentifier) {
  return findHistoryTo(plantInstance, from, TRANSPLANTED)?.date ?? null;
}
