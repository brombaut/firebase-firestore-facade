import { F3Interfacer } from './F3Interfacer';
import { FirebaseConfigurer } from './FirebaseConfigurer';
import { FirestoreBase } from './FirestoreBase';
import { FirestoreCollection } from './FirestoreCollection';
import { IFirestoreType } from './IFirestoreType';
import { ILocalType } from './ILocalType';

export class F3Wrapper<LocalType> implements F3Interfacer<LocalType> {
  private _config: FirebaseConfigurer;
  private _collectionName: string;
  private _mapper: (o: IFirestoreType) => LocalType;
  private _collection!: FirestoreCollection<LocalType>;

  constructor(config: FirebaseConfigurer, collectionName: string, mapper: (o: IFirestoreType) => LocalType) {
    this._config = config;
    this._collectionName = collectionName;
    this._mapper = mapper;
    return this;
  }

  async init(): Promise<F3Wrapper<LocalType>> {
    const base = await new FirestoreBase(this._config).init();
    this._collection= new FirestoreCollection<LocalType>(
      base,
      this._collectionName,
      this._mapper,
    );
    return this;
  }

  private throwIfNotInit() {
    if (!this._collection) {
      throw new Error('Collection not initialized');
    }
  }

  async get(): Promise<LocalType[]> {
    this.throwIfNotInit();
    const result = await this._collection.get();
    return result;
  }
  async getById(id: string): Promise<LocalType> {
    this.throwIfNotInit();
    const result = await this._collection.getById(id);
    return result;
  }
  async put(t: ILocalType): Promise<LocalType> {
    this.throwIfNotInit();
    const result = await this._collection.update(t.toFirestoreType());
    return result;
  }
  async post(t: IFirestoreType): Promise<LocalType> {
    this.throwIfNotInit();
    const result = await this._collection.add(t);
    return result;
  }
  async delete(t: ILocalType): Promise<void> {
    this.throwIfNotInit();
    await this._collection.deleteById(t.id);
  }

  async closeConnection(): Promise<void> {
    await this._collection.close();
  }
}
