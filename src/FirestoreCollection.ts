import { FirestoreBase } from "./FirestoreBase";
export class FirestoreCollection<FirebaseRecord, LocalRecord> {
  private _baseFirestore: FirestoreBase;
  private _collection: string;
  private _dtoMapper: (o: FirebaseRecord) => LocalRecord;

  constructor(baseFirestore: FirestoreBase, collection: string, dtoMapper: (o: FirebaseRecord) => LocalRecord) {
    this._baseFirestore = baseFirestore;
    this._collection = collection;
    this._dtoMapper = dtoMapper;
  }

  // TODO: this
  async get() {
    const snapshot: FirebaseRecord[] = 
      await this._baseFirestore.collectionSnapshotData<FirebaseRecord>(this._collection)
    const localRecords: LocalRecord[] = snapshot.map(this._dtoMapper)
    console.log(snapshot)
    return localRecords;
  }

  
}