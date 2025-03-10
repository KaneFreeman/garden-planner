import { blue } from '@mui/material/colors';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import yellow from '@mui/material/colors/yellow';
import { useMemo } from 'react';
import { DisplayStatusChipProps } from '../../containers/DisplayStatusChip';
import { ContainerSlotIdentifier, Plant, PlantInstance, TRANSPLANTED } from '../../interface';
import { areContainerSlotLocationsEqual } from '../../utility/containerSlotLocation.util';
import { findHistoryFrom, getPlantedEvent } from '../../utility/history.util';

export function getPlantInstanceStatus(instance: PlantInstance): DisplayStatusChipProps['status'] {
  if (instance.closed) {
    return 'Closed';
  }

  if (getPlantedEvent(instance)) {
    return 'Planted';
  }

  return 'Not Planted';
}

export function getPlantInstanceStatusForSlot(
  instance: PlantInstance | undefined,
  slotLocation: ContainerSlotIdentifier | null | undefined,
  plantLocation: ContainerSlotIdentifier | null | undefined
): DisplayStatusChipProps['status'] {
  if (!instance) {
    return 'Planning';
  }

  if (instance.closed) {
    return 'Closed';
  }

  if (getPlantedEvent(instance)) {
    if (
      !areContainerSlotLocationsEqual(slotLocation, plantLocation) &&
      findHistoryFrom(instance, slotLocation, TRANSPLANTED)
    ) {
      return 'Transplanted';
    }

    return 'Planted';
  }

  return 'Not Planted';
}

export function usePlantInstanceStatus(
  instance: PlantInstance | undefined,
  slotLocation: ContainerSlotIdentifier | null | undefined,
  plantLocation: ContainerSlotIdentifier | null | undefined
): DisplayStatusChipProps['status'] {
  return useMemo(
    () => getPlantInstanceStatusForSlot(instance, slotLocation, plantLocation),
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

    switch (status) {
      case 'Planning':
        return blue[400];
      case 'Planted':
        return green[300];
      case 'Transplanted':
        return red[300];
      case 'Closed':
        return yellow[900];
      default:
        return defaultColor;
    }
  }, [defaultColor, emptyColor, plant, status]);
}
