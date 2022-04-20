/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import { Plant, Container, fromPlantDTO } from '../../interface';
import PlantAvatar from '../../plants/PlantAvatar';
import { useAppSelector } from '../../store/hooks';
import { selectPlants } from '../../store/slices/plants';
import { getRowColumn, formatSlotTitle } from '../../utility/slot.util';

export default function useSlotOptions(container: Container | undefined) {
  const plants = useAppSelector(selectPlants);

  const plantsById = useMemo(
    () =>
      plants.reduce((byId, plant) => {
        byId[plant._id] = fromPlantDTO(plant);
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
          icon: <PlantAvatar plant={plant} slot={slot} variant="circular" size={28} sx={{ mr: 1.5 }} />
        },
        ...rest
      };
    });
  }, [container, plantsById]);
}
