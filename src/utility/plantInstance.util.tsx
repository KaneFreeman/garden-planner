/* eslint-disable import/prefer-default-export */
import { useMemo } from 'react';
import { NOT_PLANTED, PlantInstance, Status } from '../interface';

export function usePlantInstanceStatus(instance: PlantInstance | undefined): Status {
  return useMemo(() => {
    if (!instance || !instance.history || !instance.history.length) {
      return NOT_PLANTED;
    }

    return instance.history[instance.history.length - 1].status;
  }, [instance]);
}
