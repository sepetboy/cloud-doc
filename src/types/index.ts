export interface FileType {
  id: string;
  title: string;
  body?: string;
  createdAt: number;
  path?: string;
  isNew?: boolean;
}

export interface FlatterType {
  id: string;
}

export type FileObj<T> = Record<string, T>;
