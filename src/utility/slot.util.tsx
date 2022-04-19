/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import { Container, Plant } from '../interface';
import { usePlants } from '../plants/usePlants';
import PlantAvatar from '../plants/PlantAvatar';

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

export function useSlotOptions(container: Container | undefined) {
  const plants = usePlants();
  const plantsById = useMemo(
    () =>
      plants.reduce((byId, plant) => {
        byId[plant._id] = plant;
        return byId;
      }, {} as Record<string, Plant>),
    [plants]
  );

  return useMemo(() => {
    if (!container) {
      return [];
    }

    const options = [...Array(container.rows * container.columns)].map((_, entry) => ({
      ...getRowColumn(entry, container.rows),
      entry,
      value: entry
    }));

    options.sort((a, b) => {
      if (a.row === b.row) {
        return a.column - b.column;
      }

      return a.row - b.row;
    });

    return options.map(({ row, column, entry, ...rest }) => {
      const slot = container.slots?.[entry];

      const plant = slot?.plant ? plantsById[slot.plant] : undefined;

      return {
        label: {
          primary: formatSlotTitle(row, column),
          secondary: plant?.name ?? 'Empty',
          icon: <PlantAvatar plant={plant} variant="circular" size={28} sx={{ mr: 1.5 }} />
        },
        ...rest
      };
    });
  }, [container, plantsById]);
}
