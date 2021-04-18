import { FirestoreBase } from './FirestoreBase';
export class FirestoreCollection<FirebaseRecord, LocalRecord> {
  private _baseFirestore: FirestoreBase;
  private _collection: string;
  private _dtoMapper: (o: FirebaseRecord) => LocalRecord;

  constructor(baseFirestore: FirestoreBase, collection: string, dtoMapper: (o: FirebaseRecord) => LocalRecord) {
    this._baseFirestore = baseFirestore;
    this._collection = collection;
    this._dtoMapper = dtoMapper;
  }

  private collection() {
    return this._baseFirestore.collectionReference(this._collection);
  }

  async get(): Promise<LocalRecord[]> {
    const snapshot: FirebaseRecord[] = await this._baseFirestore.collectionSnapshotData<FirebaseRecord>(
      this._collection,
    );
    const localRecords: LocalRecord[] = snapshot.map(this._dtoMapper);
    return localRecords;
  }

  async getById(id: string): Promise<LocalRecord> {
    const recordRef = await this.collection().doc(id);
    const record = await recordRef.get();
    return this._dtoMapper(({ id: record.id, ...record.data() } as unknown) as FirebaseRecord);
  }

  async add(record: FirebaseRecord): Promise<LocalRecord> {
    const ref = await this.collection().add(record);
    const result = await this.getById(ref.id);
    return result;
  }
}
