import Loading from '../components/Loading';
import GardenView from '../gardens/GardenView';
import { useGardens } from '../gardens/useGardens';
import { useAppSelector } from '../store/hooks';
import { selectSelectedGarden } from '../store/slices/gardens';
import { isNullish } from '../utility/null.util';
import CreateGardenView from './CreateGardenView';

const GardensView = () => {
  const gardens = useGardens();
  const selectedGarden = useAppSelector(selectSelectedGarden);

  if (isNullish(gardens)) {
    return <Loading />;
  }

  if (gardens.length === 0) {
    return <CreateGardenView />;
  }

  if (!selectedGarden) {
    return <Loading />;
  }

  return <GardenView />;
};

export default GardensView;
