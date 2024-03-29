import { FirebaseAuthentication } from './FirebaseAuthentication';
import { IFirestoreType } from './IFirestoreType';
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from 'firebase/app';

// Add the Firebase services that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import { FirebaseConfigurer } from './FirebaseConfigurer';

export class FirestoreBase {
  private _firebaseConfig: FirebaseConfigurer;
  private _app!: firebase.app.App;
  private _db!: firebase.firestore.Firestore;
  private _authentication: FirebaseAuthentication | undefined;

  constructor(firebaseConfig: FirebaseConfigurer) {
    this.throwIfInvalidConfig(firebaseConfig);
    this._firebaseConfig = firebaseConfig;
    if (firebaseConfig.auth) {
      this._authentication = firebaseConfig.auth;
    }
  }

  private throwIfInvalidConfig(firebaseConfig: FirebaseConfigurer): void {
    const invalidFields: string[] = [];
    if (!firebaseConfig.apiKey) {
      invalidFields.push('apiKey');
    }
    if (!firebaseConfig.authDomain) {
      invalidFields.push('authDomain');
    }
    if (!firebaseConfig.projectId) {
      invalidFields.push('projectId');
    }
    if (!firebaseConfig.storageBucket) {
      invalidFields.push('storageBucket');
    }
    if (!firebaseConfig.messagingSenderId) {
      invalidFields.push('messagingSenderId');
    }
    if (!firebaseConfig.appId) {
      invalidFields.push('appId');
    }
    if (invalidFields.length > 0) {
      throw new Error(`Invalid Firebase config fields: [${invalidFields.join(', ')}]`);
    }
  }

  async init(): Promise<FirestoreBase> {
    await this.close();
    this.initApp();
    this.initFirestore();
    await this.initAuthIfNecessary();
    return this;
  }

  private initApp(): void {
    this._app = firebase.initializeApp(this._firebaseConfig);
  }

  private initFirestore(): void {
    this._db = firebase.firestore();
  }

  private async initAuthIfNecessary(): Promise<void> {
    if (this._authentication) {
      await firebase.auth().signInWithEmailAndPassword(this._authentication.email, this._authentication.password);
    }
    return Promise.resolve();
  }

  db(): firebase.firestore.Firestore {
    return this._db;
  }

  collectionReference(collection: string): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
    return this._db.collection(collection);
  }

  private async collectionSnapshot(
    collection: string,
  ): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
    const cReference = this.collectionReference(collection);
    const cSnapshot = await cReference.get();
    return cSnapshot;
  }

  async collectionSnapshotData(collection: string): Promise<IFirestoreType[]> {
    const cSnapshot = await this.collectionSnapshot(collection);
    const data: IFirestoreType[] = cSnapshot.docs.map((doc) => {
      const result = {
        id: doc.id,
        ...doc.data(),
      };
      return result;
    });
    return data;
  }

  async close(): Promise<void> {
    if (firebase.apps.length > 0) {
      this.closeFirstoreConnection();
      await firebase.app().delete();
    }
  }

  private closeFirstoreConnection(): void {
    firebase.firestore().terminate();
    firebase.firestore().clearPersistence();
  }
}
