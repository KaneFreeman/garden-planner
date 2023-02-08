import { useMemo } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import { useAppSelector } from '../../store/hooks';
import { selectContainers } from '../../store/slices/containers';
import { CONTAINER_TYPE_INSIDE } from '../../interface';

export default function useContainerOptions() {
  const containers = useAppSelector(selectContainers);

  const sortedContainers = useMemo(() => {
    const temp = [...containers];
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
