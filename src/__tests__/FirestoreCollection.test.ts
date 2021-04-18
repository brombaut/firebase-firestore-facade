import { FirestoreBase } from '../FirestoreBase';
import { FirestoreCollection } from '../FirestoreCollection';
import { FirestoreBook } from '../FirestoreBook';
import { firebaseConfig } from '../firebase.config';

describe('FirestoreCollection', () => {
  it('inits', async () => {
    const base = new FirestoreBase(firebaseConfig);
    const mapper = (o: FirestoreBook) => o;
    const booksCollection = new FirestoreCollection<FirestoreBook, FirestoreBook>(base, 'books', mapper)
    const books = await booksCollection.get();
    expect(books).toBeDefined();
  });
});