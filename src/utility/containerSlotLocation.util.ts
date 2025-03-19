import { useMemo } from 'react';
import { Container, ContainerSlotIdentifier } from '../interface';
import { getSlotTitle } from './slot.util';

export function compareContainerSlotLocations(
  a: ContainerSlotIdentifier | undefined | null,
  b: ContainerSlotIdentifier | undefined | null
): -1 | 0 | 1 {
  if (a === b) {
    return 0;
  }

  if (!a) {
    return -1;
  }

  if (!b) {
    return 1;
  }

  if (a.containerId < b.containerId) {
    return -1;
  }

  if (a.containerId > b.containerId) {
    return 1;
  }

  if (a.slotId < b.slotId) {
    return -1;
  }

  if (a.slotId > b.slotId) {
    return 1;
  }

  return 0;
}

export function areContainerSlotLocationsEqual(
  a: ContainerSlotIdentifier | undefined | null,
  b: ContainerSlotIdentifier | undefined | null
): boolean {
  return compareContainerSlotLocations(a, b) === 0;
}

export function getLocationTitle(
  value: ContainerSlotIdentifier | undefined | null,
  container: Container | undefined | null
): string {
  if (!value || !container) {
    return 'None';
  }

  return `${container.name}${
    Object.keys(container?.slots ?? {}).length > 1 ? ` - ${getSlotTitle(value.slotId, container.rows)}` : ''
  }`;
}

export function useLocationTitle(
  value: ContainerSlotIdentifier | undefined | null,
  container: Container | undefined | null
): string {
  return useMemo(() => getLocationTitle(value, container), [value, container]);
}
