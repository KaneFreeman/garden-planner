import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import { useMemo } from 'react';
import { CONTAINER_TYPE_INSIDE } from '../../interface';
import { useContainers } from './useContainers';

export default function useContainerOptions() {
  const containers = useContainers();

  const sortedContainers = useMemo(() => {
    const temp = [...containers].filter((c) => !c.archived);
    temp.sort((a, b) => a.name.localeCompare(b.name));
    return temp;
  }, [containers]);

  return useMemo(
    () =>
      sortedContainers?.map((entry) => ({
        label: {
          primary: entry.name,
          icon:
            entry.type === CONTAINER_TYPE_INSIDE ? <HomeIcon titleAccess="Inside" /> : <ParkIcon titleAccess="Inside" />
        },
        value: entry._id
      })),
    [sortedContainers]
  );
}
