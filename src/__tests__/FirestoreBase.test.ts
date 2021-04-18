import { FirestoreBase } from '../firestore/FirestoreBase';
import { firebaseConfig } from '../firestore/firebase.config';

describe('FirestoreBase', () => {
  let base: FirestoreBase;
  beforeAll(() => {
    base = new FirestoreBase(firebaseConfig);
  });

  afterAll(() => {
    base.closeConnection();
  });

  it('inits', () => {
    expect(base).toBeDefined();
    expect(base.db()).toBeDefined();
  });
});
