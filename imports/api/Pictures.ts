import { Mongo } from 'meteor/mongo';

export interface Picture {
  _id: number;
  dataUrl: string;
}

export const PicturesCollection = new Mongo.Collection<Picture>('pictures');
