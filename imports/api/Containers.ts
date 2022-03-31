import { Mongo } from 'meteor/mongo';
import { Picture } from './Common';

export interface Comment {
  date: Date;
  text: string;
}

export const NOT_PLANTED = 'Not Planted';
export const PLANTED = 'Planted';
export type Status = typeof NOT_PLANTED | typeof PLANTED;
export const STATUSES: Status[] = [NOT_PLANTED, PLANTED];

export interface Slot {
  plant?: string;
  status?: Status;
  plantedCount?: number;
  plantedDate?: Date;
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
