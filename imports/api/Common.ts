export interface PictureData {
  date: Date;
  id: number;
  pictureId?: string;
  dataUrl?: string;
  thumbnail: string;
  deleted?: boolean;
}

export interface Comment {
  date: Date;
  text: string;
}
