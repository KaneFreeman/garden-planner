export interface Picture {
  date: Date;
  id: number;
  dataUrl: string;
  deleted?: boolean;
}

export interface Comment {
  date: Date;
  text: string;
}
