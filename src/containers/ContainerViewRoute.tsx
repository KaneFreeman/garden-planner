import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { useContainer } from './hooks/useContainers';
import ContainerView from './ContainerView';
import { Slot } from '../interface';

const ContainerViewRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const container = useContainer(id);

  const onSlotClick = useCallback((_: Slot | undefined, index: number) => {
    if (container?._id) {
      navigate(`/container/${container._id}/slot/${index}`);
    }
  }, [container?._id, navigate]);

  if (!container || container._id !== id) {
    return <Loading key="container-view-loading" />;
  }

  return <ContainerView key="container-view" container={container} onSlotClick={onSlotClick} />;
};

export default ContainerViewRoute;
