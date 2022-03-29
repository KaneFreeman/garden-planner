import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Plant, PlantsCollection } from '../../api/Plants';

export const Plants = () => {
  const plants = useTracker(() => PlantsCollection.find().fetch());

  const makeLink = (plant: Plant) => {
    return <li key={plant._id}>{plant.name}</li>;
  };

  return (
    <div>
      <ul>{plants.map(makeLink)}</ul>
    </div>
  );
};
