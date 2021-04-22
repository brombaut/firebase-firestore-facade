import { IFirestoreType } from './IFirestoreType';

export interface ILocalType {
  id: string;
  toFirestoreType(): IFirestoreType;
}
