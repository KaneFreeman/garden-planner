/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import { Plant, Slot } from '../interface';

export function getRowColumn(index: number, rows?: number) {
  const column = Math.floor(index / (rows ?? 1));

  let row: number;
  const rowDivisor = (rows ?? 1) * column;
  if (rowDivisor === 0) {
    row = index;
  } else {
    row = index % rowDivisor;
  }

  return { row: row + 1, column: column + 1 };
}

export function formatSlotTitle(row: number, column: number) {
  return `Row ${row}, Column ${column}`;
}

export function getSlotTitle(index: number, rows?: number) {
  const { row, column } = getRowColumn(index, rows);

  return formatSlotTitle(row, column);
}

export function useStatusColor(slot: Slot | undefined, plant: Plant | undefined, emptyColor = '#2c2c2c') {
  return useMemo(() => {
    if (!plant) {
      return emptyColor;
    }

    if (slot?.status === 'Planted') {
      return green[300];
    }

    if (slot?.status === 'Transplanted') {
      return red[300];
    }

    return emptyColor;
  }, [emptyColor, plant, slot?.status]);
}
