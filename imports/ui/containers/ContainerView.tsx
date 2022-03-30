import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ContainersCollection } from '../../api/Containers';

const ContainerView = () => {
  const { id } = useParams();

  const container = useMemo(() => ContainersCollection.findOne(id), [id]);

  console.log('container', container);

  return (
    <div>
      {container?.name} - {container?.rows} x {container?.columns}
    </div>
  );
};

export default ContainerView;
