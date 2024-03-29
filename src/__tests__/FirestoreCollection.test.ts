import { IFirestoreType } from './../firestore/IFirestoreType';
import { FirestoreDateTranslator } from './../firestore/FirestoreDateTranslator';
import { FirestoreBase } from '../firestore/FirestoreBase';
import { FirestoreCollection } from '../firestore/FirestoreCollection';
import { FirestoreBook } from '../bookshelf/FirestoreBook';
import { Book } from '../bookshelf/Book';
import { firebaseConfig } from '../bookshelf/firebase.config';
import { Shelf } from '../bookshelf/Shelf';

describe('FirestoreCollection', () => {
  let base: FirestoreBase;
  let booksCollection: FirestoreCollection<Book>;
  let mapper: (o: IFirestoreType) => Book;

  beforeAll(async () => {
    base = await new FirestoreBase(firebaseConfig).init();
    mapper = (o: IFirestoreType) => new Book(o as FirestoreBook);
    booksCollection = new FirestoreCollection<Book>(base, 'books', mapper);
  });

  afterAll(async () => {
    await base.close();
  });

  it('inits', async () => {
    expect(booksCollection).toBeDefined();
  });

  it('gets a list of books', async () => {
    const books = await booksCollection.get();
    expect(books).toBeDefined();
  });

  describe('Create, Read, Update, Delete', () => {
    let testingBookId: string | null = null;
    const testingBook: FirestoreBook = {
      id: '',
      goodreads_review_id: '12345678',
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

    it('adds a book to the list', async () => {
      const newBook = await booksCollection.add(testingBook);
      testingBookId = newBook.id;
      expect(newBook.id).toBeDefined();
      expect(newBook.isbn13).toEqual(testingBook.isbn13);
      expect(newBook.title).toEqual(testingBook.title);
      expect(newBook.shortTitle).toEqual(testingBook.shortTitle);
      expect(newBook.authors).toEqual(testingBook.authors);
      expect(newBook.numPages).toEqual(testingBook.numPages);
      expect(newBook.link).toEqual(testingBook.link);
      expect(newBook.shelf).toEqual(testingBook.shelf);
      expect(newBook.onPage).toEqual(testingBook.onPage);
      const sDate = testingBook.dateStarted
        ? new FirestoreDateTranslator().fromFirestoreDate(testingBook.dateStarted).toDate()
        : null;
      expect(newBook.dateStarted).toEqual(sDate);
      const fDate = testingBook.dateFinished
        ? new FirestoreDateTranslator().fromFirestoreDate(testingBook.dateFinished).toDate()
        : null;
      expect(newBook.dateFinished).toEqual(fDate);
      expect(newBook.rating).toEqual(testingBook.rating);
    });

    it('gets the newly created book by id', async () => {
      if (!testingBookId) throw new Error('testingBookId is not set');
      const book = await booksCollection.getById(testingBookId);
      expect(book).toBeDefined();
      expect(book.id).toEqual(testingBookId);
    });

    it('finds the newly created book in list', async () => {
      if (!testingBookId) throw new Error('testingBookId is not set');
      const books = await booksCollection.get();
      const bookIdIsInList = books.findIndex((book: Book) => book.id === testingBookId) > -1;
      expect(bookIdIsInList).toBeTruthy();
    });

    it('updates the book fields', async () => {
      if (!testingBookId) throw new Error('testingBookId is not set');
      let book = await booksCollection.getById(testingBookId);
      expect(book.dateStarted).toBeFalsy();
      expect(book.shelf).toEqual(Shelf.TOREAD);
      book.startReading();
      book = await booksCollection.update(book.toDTO());
      expect(book).toBeDefined();
      expect(book.dateStarted).toBeTruthy();
      expect(book.shelf).toEqual(Shelf.CURRENTLYREADING);
      expect(book.dateFinished).toBeFalsy();
      book.finishedReading();
      expect(book).toBeDefined();
      expect(book.dateFinished).toBeTruthy();
      expect(book.shelf).toEqual(Shelf.READ);
      expect(book.onPage).toEqual(book.numPages);
    });

    it('deletes the book', async () => {
      if (!testingBookId) throw new Error('testingBookId is not set');
      await booksCollection.deleteById(testingBookId);
      const books = await booksCollection.get();
      const bookIdIsInList = books.findIndex((book: Book) => book.id === testingBookId) > -1;
      expect(bookIdIsInList).toBeFalsy();
    });
  });
});
