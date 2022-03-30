import { Mongo } from 'meteor/mongo';
import { Picture } from './Common';

export interface Plant {
  _id?: string;
  name: string;
  pictures?: Picture[];
}

export const PlantsCollection = new Mongo.Collection<Plant>('plants');
