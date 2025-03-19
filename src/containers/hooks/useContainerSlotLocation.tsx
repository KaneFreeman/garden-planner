import { useMemo } from 'react';
import { ContainerSlotIdentifier } from '../../interface';

export function getContainerSlotLocation(
  containerId: string | undefined,
  slotId: number | undefined
): ContainerSlotIdentifier | null {
  if (!containerId || slotId === undefined) {
    return null;
  }

  return {
    containerId,
    slotId
  };
}

export function useContainerSlotLocation(
  containerId: string | undefined,
  slotId: number | undefined
): ContainerSlotIdentifier | null {
  return useMemo(() => getContainerSlotLocation(containerId, slotId), [containerId, slotId]);
}
