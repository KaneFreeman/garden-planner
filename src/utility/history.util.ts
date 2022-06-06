import {
  ContainerSlotIdentifier,
  PlantInstance,
  HistoryStatus,
  TRANSPLANTED,
  PlantInstanceHistory
} from '../interface';

export function findHistoryFromIndex(
  plantInstance: PlantInstance | undefined | null,
  from: ContainerSlotIdentifier | undefined | null,
  status?: HistoryStatus
): number | undefined {
  if (!plantInstance || !from) {
    return undefined;
  }

  return plantInstance.history?.findIndex((entry) => {
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

export function findHistoryFrom(
  plantInstance: PlantInstance | undefined | null,
  from: ContainerSlotIdentifier | undefined | null,
  status?: HistoryStatus
): PlantInstanceHistory | undefined {
  const index = findHistoryFromIndex(plantInstance, from, status);
  return index !== undefined ? plantInstance?.history?.[index] : undefined;
}

export function findHistoryToIndex(
  plantInstance: PlantInstance | undefined | null,
  to: ContainerSlotIdentifier | undefined | null,
  status?: HistoryStatus
): number | undefined {
  if (!plantInstance || !to) {
    return undefined;
  }

  return plantInstance.history?.findIndex((entry) => {
    const fromMatch =
      entry.from?.containerId === to.containerId &&
      entry.from?.slotId === to.slotId &&
      entry.from?.subSlot === to.subSlot;

    if (status) {
      return fromMatch && entry.status === status;
    }

    return fromMatch;
  });
}

export function findHistoryTo(
  plantInstance: PlantInstance | undefined | null,
  to: ContainerSlotIdentifier | undefined | null,
  status?: HistoryStatus
): PlantInstanceHistory | undefined {
  const index = findHistoryToIndex(plantInstance, to, status);
  return index !== undefined ? plantInstance?.history?.[index] : undefined;
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
