// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from 'firebase/app';

// Add the Firebase services that you want to use
import 'firebase/auth';
import 'firebase/firestore';

export class FirestoreBase {
  private _firebaseConfig: Record<string, string>;
  private _app!: firebase.app.App;
  private _db!: firebase.firestore.Firestore;

  constructor(firebaseConfig: Record<string, string>) {
    this._firebaseConfig = firebaseConfig;
    this.initApp();
    this.initFirestore();
  }

  initApp(): void {
    this._app = firebase.initializeApp(this._firebaseConfig);
  }

  initFirestore(): void {
    this._db = firebase.firestore();
  }

  db(): firebase.firestore.Firestore {
    return this._db;
  }

  private collectionReference(collection: string): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
    return this._db.collection(collection);
  }

  private async collectionSnapshot(collection: string): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
    const cReference = this.collectionReference(collection);
    const cSnapshot = await cReference.get();
    return cSnapshot;
  }

  async collectionSnapshotData<T>(collection: string): Promise<T[]> {
    const cSnapshot = await this.collectionSnapshot(collection);
    const data: T[] = cSnapshot.docs.map((doc) => {
      const result = {
        id: doc.id,
        ...doc.data(),
      } as unknown as T;
      return result
    });
    return data;
  }

  



}
