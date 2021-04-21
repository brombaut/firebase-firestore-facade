import { F3Wrapper } from "./../firestore/F3Wrapper";
import { Book } from "../bookshelf/Book";
import { firebaseConfig } from "../bookshelf/firebase.config";
import { FirestoreBook } from "../bookshelf/FirestoreBook";
import { FirebaseConfigurer } from "../firestore/FirebaseConfigurer";


describe('F3Wrapper', () => {
  const config: FirebaseConfigurer = firebaseConfig;
  const collection: string = 'books';
  const mapper: (o: FirestoreBook) => Book = 
    (o: FirestoreBook) => new Book(o);

  let f3: F3Wrapper<FirestoreBook, Book>;

  beforeAll(async () => {
    f3 = new F3Wrapper<FirestoreBook, Book>(config, collection, mapper);
  });

  afterAll(async () => {
  });
  
  it('instantiates', () => {
    expect(f3).toBeDefined();
  });

  it('gets', async () => {
    const books: Book[] = await f3.get();
    expect(books).toBeDefined();
  });

  it('gets the same list multiple times', async () => {
    const books_first: Book[] = await f3.get();
    expect(books_first).toBeDefined();

    const books_second: Book[] = await f3.get();
    expect(books_second).toBeDefined();

    expect(books_first).toEqual(books_second);
  });
});