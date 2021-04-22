import { FirebaseConfigurer } from './../firestore/FirebaseConfigurer';
import { firebaseConfig } from '../bookshelf/firebase.config';
import { FirestoreBase } from '../firestore/FirestoreBase';

describe('FirestoreBase', () => {
  it('inits', async () => {
    const base = await new FirestoreBase(firebaseConfig).init();
    expect(base).toBeDefined();
    expect(base.db()).toBeDefined();
    await base.close();
  });

  it('closes an existing initialized firebase app and initizlies a new one', async () => {
    const base = await new FirestoreBase(firebaseConfig).init();
    expect(base).toBeDefined();
    expect(base.db()).toBeDefined();

    const newBase: FirestoreBase = await new FirestoreBase(firebaseConfig).init();
    expect(newBase).toBeDefined();
    expect(newBase.db()).toBeDefined();
    await base.close();
  });

  it('throws an error with an invalid config', async () => {
    const invalidConfig: FirebaseConfigurer = {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      measurementId: '',
    };
    expect(() => {
      new FirestoreBase(invalidConfig);
    }).toThrow(
      'Invalid Firebase config fields: [apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId]',
    );
  });
});
