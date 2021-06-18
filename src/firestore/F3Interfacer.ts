import { IFirestoreType } from './IFirestoreType';
import { ILocalType } from './ILocalType';

export interface F3Interfacer<LocalType> {
  init(): Promise<F3Interfacer<LocalType>>;
  get(): Promise<LocalType[]>;
  getById(id: string): Promise<LocalType>;
  put(t: ILocalType): Promise<LocalType>;
  post(t: IFirestoreType): Promise<LocalType>;
  delete(t: ILocalType): Promise<void>;
  closeConnection(): Promise<void>;
}
