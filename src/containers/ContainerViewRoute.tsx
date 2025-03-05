import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import ContainerView from './ContainerView';
import { useContainer } from './hooks/useContainers';

const ContainerViewRoute = () => {
  const { id } = useParams();
  const container = useContainer(id);

  if (!container || container._id !== id) {
    return <Loading key="container-view-loading" />;
  }

  return <ContainerView key="container-view" container={container} />;
};

export default ContainerViewRoute;
