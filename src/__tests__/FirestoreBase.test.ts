import { FirestoreBase } from '../FirestoreBase';
import { firebaseConfig } from '../firebase.config';

describe('FirestoreBase', () => {
  it('inits', () => {
    const myFirestore = new FirestoreBase(firebaseConfig);
    expect(myFirestore).toBeDefined()
    expect(myFirestore.db()).toBeDefined()
  });
});
