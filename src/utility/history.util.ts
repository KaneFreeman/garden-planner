import { useCallback } from 'react';
import {
  ContainerSlotIdentifier,
  PlantInstance,
  HistoryStatus,
  TRANSPLANTED,
  PlantInstanceHistory,
  PLANTED
} from '../interface';

export function matchLocations(
  a: ContainerSlotIdentifier | undefined | null,
  b: ContainerSlotIdentifier | undefined | null
): boolean {
  return a?.containerId === b?.containerId && a?.slotId === b?.slotId && a?.subSlot === b?.subSlot;
}

export function findHistoryFromIndex(
  plantInstance: PlantInstance | undefined | null,
  from: ContainerSlotIdentifier | undefined | null,
  status?: HistoryStatus
): number | undefined {
  if (!plantInstance || !from) {
    return undefined;
  }

  return plantInstance.history?.findIndex((entry) => {
    const fromMatch = matchLocations(entry.from, from);

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
    const toMatch = matchLocations(entry.to, to);

    if (status) {
      return toMatch && entry.status === status;
    }

    return toMatch;
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
  return plantInstance?.history?.find((entry) => entry.status === PLANTED);
}

export function getPlantedDate(plantInstance: PlantInstance | undefined | null) {
  return getPlantedEvent(plantInstance)?.date ?? null;
}

export function getTransplantedDate(plantInstance: PlantInstance | undefined | null, from: ContainerSlotIdentifier) {
  return findHistoryTo(plantInstance, from, TRANSPLANTED)?.date ?? null;
}

export function getFirstEventAt(
  plantInstance: PlantInstance | undefined | null,
  location: ContainerSlotIdentifier | undefined | null
) {
  if (!plantInstance || !location) {
    return undefined;
  }

  return plantInstance.history?.find(
    (entry) => matchLocations(entry.from, location) || matchLocations(entry.to, location)
  );
}

type PlantInstanceCompare = (a: PlantInstance | undefined | null, b: PlantInstance | undefined | null) => number;

function compareFirstEvents(
  a: PlantInstance | undefined | null,
  aLocation: ContainerSlotIdentifier | undefined | null,
  b: PlantInstance | undefined | null,
  bLocation: ContainerSlotIdentifier | undefined | null,
  secondaryCompare?: PlantInstanceCompare
) {
  const aEvent = getFirstEventAt(a, aLocation);
  const bEvent = getFirstEventAt(b, bLocation);

  const aDate = aEvent?.date;
  const bDate = bEvent?.date;

  if (!aDate && !bDate) {
    if (secondaryCompare) {
      return secondaryCompare(a, b);
    }
    return 0;
  }

  if (!aDate) {
    return 1;
  }

  if (!bDate) {
    return -1;
  }

  const result = bDate.getTime() - aDate.getTime();
  if (result === 0 && secondaryCompare) {
    return secondaryCompare(a, b);
  }
  return result;
}

export const firstEventComparator = (a: PlantInstance | undefined | null, b: PlantInstance | undefined | null) => {
  return compareFirstEvents(a, a, b, b);
};

export const useFirstEventComparatorWithSecondary = (secondaryCompare: PlantInstanceCompare) =>
  useCallback(
    (a: PlantInstance | undefined | null, b: PlantInstance | undefined | null) => {
      return compareFirstEvents(a, a, b, b, secondaryCompare);
    },
    [secondaryCompare]
  );

export const useFirstEventStaticLocationComparator = (location: ContainerSlotIdentifier | undefined | null) =>
  useCallback(
    (a: PlantInstance | undefined | null, b: PlantInstance | undefined | null) => {
      return compareFirstEvents(a, location, b, location);
    },
    [location]
  );
