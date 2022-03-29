import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Container, ContainersCollection } from '../../api/Containers';

export const Containers = () => {
  const containers = useTracker(() => ContainersCollection.find().fetch());

  const makeLink = (container: Container) => {
    return <li key={container._id}>{container.name}</li>;
  };

  return (
    <div>
      <ul>{containers.map(makeLink)}</ul>
    </div>
  );
};
