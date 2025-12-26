
export interface Book {
  id: string;
  title: string;
  description: string;
  pdf: string;
  cover: string;
  audioPattern: string; // e.g., "/books/{id}/audio/{page}.mp3"
  audioPad: number;
}

export enum ReaderMode {
  MANUAL = 'manual',
  NARRATED = 'narrated'
}

export interface BookProgress {
  lastPage: number;
  mode: ReaderMode;
}
