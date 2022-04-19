/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import { useAppSelector } from '../store/hooks';
import { selectContainers } from '../store/slices/containers';

export function useContainerOptions() {
  const containers = useAppSelector(selectContainers);

  return useMemo(
    () =>
      containers?.map((entry) => ({
        label: {
          primary: entry.name,
          icon: entry.type === 'Inside' ? <HomeIcon titleAccess="Inside" /> : <ParkIcon titleAccess="Inside" />
        },
        value: entry._id
      })),
    [containers]
  );
}
