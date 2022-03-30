import { Mongo } from 'meteor/mongo';

export interface Plant {
  _id?: string;
  name: string;
  pictures?: string[];
}

export const PlantsCollection = new Mongo.Collection<Plant>('plants');
