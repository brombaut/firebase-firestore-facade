import { IFirestoreType } from './../firestore/IFirestoreType';
import { F3Wrapper } from './../firestore/F3Wrapper';
import { F3Interfacer } from './../firestore/F3Interfacer';
import { Book } from './Book';
import { FirestoreBook } from './FirestoreBook';
import { FirebaseConfigurer } from '../firestore/FirebaseConfigurer';

export class F3Bookshelf implements F3Interfacer<Book> {
  private _f3!: F3Wrapper<Book>;
  private _firebaseConfig: FirebaseConfigurer;
  private _collection = 'books_prod';
  private _mapper: (o: IFirestoreType) => Book = (o: IFirestoreType) => new Book(o as FirestoreBook);

  constructor(firebaseConfig: FirebaseConfigurer) {
    this._firebaseConfig = firebaseConfig;
  }
  async init(): Promise<F3Bookshelf> {
    this._f3 = await new F3Wrapper<Book>(this._firebaseConfig, this._collection, this._mapper).init();
    return this;
  }
  async get(): Promise<Book[]> {
    return await this._f3.get();
  }
  async getById(id: string): Promise<Book> {
    return await this._f3.getById(id);
  }
  async getByISBN(isbn: string): Promise<Book> {
    const existingBooks = await this.get();
    const book = existingBooks.find((b: Book) => b.isbn13 === isbn);
    if (!book) {
      throw new Error(`Book not found with ISBN ${isbn}`);
    }
    return book;
  }
  async put(t: Book): Promise<Book> {
    return await this._f3.put(t);
  }
  async post(t: FirestoreBook): Promise<Book> {
    const existingBooks = await this.get();
    const bookISBN13Exists = existingBooks.some((b: Book) => b.isbn13 === t.isbn13);
    if (bookISBN13Exists) {
      throw new Error(`Book ISBN13 exists: ${t.isbn13}`);
    }
    return await this._f3.post(t);
  }
  async delete(t: Book): Promise<void> {
    return await this._f3.delete(t);
  }
  async closeConnection(): Promise<void> {
    await this._f3.closeConnection();
  }
}
