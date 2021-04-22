import { IFirestoreType } from './../firestore/IFirestoreType';
import { F3Wrapper } from './../firestore/F3Wrapper';
import { F3Interfacer } from './../firestore/F3Interfacer';
import { Book } from './Book';
import { FirestoreBook } from './FirestoreBook';
import { firebaseConfig } from './firebase.config';

export class F3Bookshelf implements F3Interfacer<Book> {
  private _f3: F3Wrapper<Book>;
  private _collection = 'books';
  private _mapper: (o: IFirestoreType) => Book = (o: IFirestoreType) => new Book(o as FirestoreBook);

  constructor() {
    this._f3 = new F3Wrapper<Book>(firebaseConfig, this._collection, this._mapper);
  }
  async get(): Promise<Book[]> {
    return await this._f3.get();
  }
  async getById(id: string): Promise<Book> {
    return await this._f3.getById(id);
  }
  async put(t: Book): Promise<Book> {
    return await this._f3.put(t);
  }
  async post(t: FirestoreBook): Promise<Book> {
    return await this._f3.post(t);
  }
  async delete(t: Book): Promise<void> {
    return await this._f3.delete(t);
  }
}
