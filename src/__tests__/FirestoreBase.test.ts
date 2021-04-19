import { FirestoreBase } from '../firestore/FirestoreBase';
import { firebaseConfig } from '../firestore/firebase.config';

describe('FirestoreBase', () => {
  let base: FirestoreBase;
  beforeAll(async () => {
    base = await new FirestoreBase(firebaseConfig).init();
  });

  afterAll(async () => {
    await base.close();
  });

  it('inits', () => {
    expect(base).toBeDefined();
    expect(base.db()).toBeDefined();
  });

  it('closes an existing initialized firebase app and initizlies a new one', async () => {
    expect(base).toBeDefined();
    expect(base.db()).toBeDefined();

    const newBase: FirestoreBase = await new FirestoreBase(firebaseConfig).init();
    expect(newBase).toBeDefined();
    expect(newBase.db()).toBeDefined();
  });
});
