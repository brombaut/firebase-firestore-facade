import { FirestoreBase } from './FirestoreBase';
import { IFirestoreType } from './IFirestoreType';

export class FirestoreCollection<LocalType> {
  private _baseFirestore: FirestoreBase;
  private _collection: string;
  private _dtoMapper: (ft: IFirestoreType) => LocalType;

  constructor(baseFirestore: FirestoreBase, collection: string, dtoMapper: (ft: IFirestoreType) => LocalType) {
    this._baseFirestore = baseFirestore;
    this._collection = collection;
    this._dtoMapper = dtoMapper;
  }

  async close(): Promise<void> {
    await this._baseFirestore.close();
  }

  private collection() {
    return this._baseFirestore.collectionReference(this._collection);
  }

  async get(): Promise<LocalType[]> {
    const snapshot: IFirestoreType[] = await this._baseFirestore.collectionSnapshotData(this._collection);
    const localRecords: LocalType[] = snapshot.map(this._dtoMapper);
    return localRecords;
  }

  private async docById(id: string) {
    const recordRef = await this.collection().doc(id);
    return recordRef;
  }

  async getById(id: string): Promise<LocalType> {
    const recordRef = await this.docById(id);
    const record = await recordRef.get();
    return this._dtoMapper({ id: record.id, ...record.data() });
  }

  async add(record: IFirestoreType): Promise<LocalType> {
    if (record.id) {
      throw new Error('Cannot add a record with a non-null id');
    }
    const raw = (record as unknown) as Record<string, unknown>;
    if (Object.prototype.hasOwnProperty.call(raw, 'id')) {
      delete (raw as { id?: string }).id;
    }
    const ref = await this.collection().add(record);
    const result = await this.getById(ref.id);
    return result;
  }

  async update(record: IFirestoreType): Promise<LocalType> {
    const recordRef = await this.docById(record.id);
    await recordRef.update(record);
    return await this.getById(record.id);
  }

  async deleteById(id: string): Promise<void> {
    const recordRef = await this.docById(id);
    await recordRef.delete();
  }
}
