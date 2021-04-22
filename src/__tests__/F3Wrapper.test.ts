import { F3Wrapper } from './../firestore/F3Wrapper';
import { Book } from '../bookshelf/Book';
import { firebaseConfig } from '../bookshelf/firebase.config';
import { FirestoreBook } from '../bookshelf/FirestoreBook';
import { FirebaseConfigurer } from '../firestore/FirebaseConfigurer';
import { Shelf } from '../bookshelf/Shelf';
import { FirestoreDateTranslator } from '../firestore/FirestoreDateTranslator';
import { IFirestoreType } from '../firestore/IFirestoreType';

describe('F3Wrapper', () => {
  const config: FirebaseConfigurer = firebaseConfig;
  const collection = 'books';
  const mapper: (o: IFirestoreType) => Book = (o: IFirestoreType) => new Book(o as FirestoreBook);

  let f3: F3Wrapper<Book>;

  beforeAll(async () => {
    f3 = new F3Wrapper<Book>(config, collection, mapper);
  });

  it('instantiates', () => {
    expect(f3).toBeDefined();
  });

  it('gets', async () => {
    const books: Book[] = await f3.get();
    expect(books).toBeDefined();
  });

  // TODO: This is a flaky test
  it('gets the same list multiple times', async () => {
    const books_first: Book[] = await f3.get();
    expect(books_first).toBeDefined();
    const books_second: Book[] = await f3.get();
    expect(books_second).toBeDefined();
    expect(books_first).toEqual(books_second);
  });

  describe('Create, Read, Update, Delete', () => {
    let testingBookId: string | null = null;
    const testingBook: FirestoreBook = {
      id: '',
      isbn13: 'my_isbn13',
      title: 'My Testing Book',
      shortTitle: 'Test Book',
      authors: ['Author 1', 'Author 2'],
      numPages: 256,
      link: 'my_url.com',
      shelf: Shelf.TOREAD,
      onPage: 0,
      dateStarted: null,
      dateFinished: null,
      rating: null,
    };
    const compareFirestoreBookToBook = (fb: FirestoreBook, b: Book) => {
      if (fb.id) {
        expect(fb.id).toEqual(b.id);
      }
      expect(fb.isbn13).toEqual(b.isbn13);
      expect(fb.title).toEqual(b.title);
      expect(fb.shortTitle).toEqual(b.shortTitle);
      expect(fb.authors).toEqual(b.authors);
      expect(fb.numPages).toEqual(b.numPages);
      expect(fb.link).toEqual(b.link);
      expect(fb.shelf).toEqual(b.shelf);
      expect(fb.onPage).toEqual(b.onPage);
      const sDate = fb.dateStarted ? new FirestoreDateTranslator().fromFirestoreDate(fb.dateStarted).toDate() : null;
      expect(sDate).toEqual(b.dateStarted);
      const fDate = testingBook.dateFinished
        ? new FirestoreDateTranslator().fromFirestoreDate(testingBook.dateFinished).toDate()
        : null;
      expect(fDate).toEqual(b.dateFinished);
      expect(fb.rating).toEqual(b.rating);
    };

    it('adds a book to the list', async () => {
      const newBook = await f3.post(testingBook);
      testingBookId = newBook.id;
      expect(newBook.id).toBeDefined();
      compareFirestoreBookToBook(testingBook, newBook);
    });

    it('gets the newly created book by id', async () => {
      if (!testingBookId) throw new Error('testingBookId is not set');
      const book = await f3.getById(testingBookId);
      expect(book).toBeDefined();
      expect(book.id).toEqual(testingBookId);
    });

    it('finds the newly created book in list', async () => {
      if (!testingBookId) throw new Error('testingBookId is not set');
      const books = await f3.get();
      const bookIdIsInList = books.findIndex((book: Book) => book.id === testingBookId) > -1;
      expect(bookIdIsInList).toBeTruthy();
    });

    it('updates the book fields', async () => {
      if (!testingBookId) throw new Error('testingBookId is not set');
      let book = await f3.getById(testingBookId);
      expect(book.dateStarted).toBeFalsy();
      expect(book.shelf).toEqual(Shelf.TOREAD);
      book.startReading();
      book = await f3.put(book);
      expect(book).toBeDefined();
      expect(book.dateStarted).toBeTruthy();
      expect(book.shelf).toEqual(Shelf.CURRENTLYREADING);
      expect(book.dateFinished).toBeFalsy();
      book.finishedReading();
      expect(book).toBeDefined();
      expect(book.dateFinished).toBeTruthy();
      expect(book.shelf).toEqual(Shelf.READ);
      expect(book.onPage).toEqual(book.numPages);
      book = await f3.put(book);
      expect(book).toBeDefined();
      expect(book.dateFinished).toBeTruthy();
      expect(book.shelf).toEqual(Shelf.READ);
      expect(book.onPage).toEqual(book.numPages);
    });

    it('deletes the book', async () => {
      if (!testingBookId) throw new Error('testingBookId is not set');
      const bookToDelete = await f3.getById(testingBookId);
      await f3.delete(bookToDelete);
      const books = await f3.get();
      const bookIdIsInList = books.findIndex((book: Book) => book.id === testingBookId) > -1;
      expect(bookIdIsInList).toBeFalsy();
    });
  });
});
