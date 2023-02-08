import { useMemo } from 'react';
import { ContainerSlotIdentifier } from '../../interface';

export function getContainerSlotLocation(
  containerId: string | undefined,
  slotId: number | undefined,
  subSlot?: boolean
): ContainerSlotIdentifier | null {
  if (!containerId || slotId === undefined) {
    return null;
  }

  return {
    containerId,
    slotId,
    subSlot
  };
}

export function useContainerSlotLocation(
  containerId: string | undefined,
  slotId: number | undefined,
  subSlot?: boolean
): ContainerSlotIdentifier | null {
  return useMemo(() => getContainerSlotLocation(containerId, slotId, subSlot), [containerId, slotId, subSlot]);
}
