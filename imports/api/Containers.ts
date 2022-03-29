import { Mongo } from 'meteor/mongo';

export interface Slot {
  plants: string[];
}

export interface Container {
  _id?: string;
  name: string;
  rows: number;
  columns: number;
  slots: Slot[];
}

export const ContainersCollection = new Mongo.Collection<Container>('containers');
