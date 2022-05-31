import { useMemo } from 'react';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import { DisplayStatusChipProps } from '../../containers/DisplayStatusChip';
import { ContainerSlotIdentifier, Plant, PlantInstance } from '../../interface';
import { areContainerSlotLocationsEqual } from '../../utility/containerSlotLocation.util';

export function getPlantInstanceStatus(
  instance: PlantInstance | undefined,
  slotLocation: ContainerSlotIdentifier | null | undefined,
  plantLocation: ContainerSlotIdentifier | null | undefined
): DisplayStatusChipProps['status'] {
  if (instance?.history?.[0]) {
    if (!areContainerSlotLocationsEqual(slotLocation, plantLocation)) {
      return 'Transplanted';
    }

    return 'Planted';
  }

  if (instance?.closed) {
    return 'Done';
  }

  return 'Not Planted';
}

export function usePlantInstanceStatus(
  instance: PlantInstance | undefined,
  slotLocation: ContainerSlotIdentifier | null | undefined,
  plantLocation: ContainerSlotIdentifier | null | undefined
): DisplayStatusChipProps['status'] {
  return useMemo(
    () => getPlantInstanceStatus(instance, slotLocation, plantLocation),
    [instance, plantLocation, slotLocation]
  );
}

export function usePlantInstanceStatusColor(
  instance: PlantInstance | undefined,
  slotLocation: ContainerSlotIdentifier | null | undefined,
  plantLocation: ContainerSlotIdentifier | null | undefined,
  plant: Plant | undefined,
  emptyColor = '#2c2c2c',
  defaultColor = emptyColor
) {
  const status = usePlantInstanceStatus(instance, slotLocation, plantLocation);

  return useMemo(() => {
    if (!plant) {
      return emptyColor;
    }

    if (status === 'Planted') {
      return green[300];
    }

    if (status === 'Transplanted') {
      return red[300];
    }

    return defaultColor;
  }, [defaultColor, emptyColor, plant, status]);
}
