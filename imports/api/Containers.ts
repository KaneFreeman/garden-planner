import { Mongo } from 'meteor/mongo';
import { Picture } from './Common';

export interface Comment {
  date: Date;
  text: string;
}

export interface Slot {
  plant?: string;
  comments?: Comment[];
  pictures?: Picture[];
}

export interface Container {
  _id?: string;
  name: string;
  rows: number;
  columns: number;
  slots?: Record<number, Slot>;
}

export const ContainersCollection = new Mongo.Collection<Container>('containers');
