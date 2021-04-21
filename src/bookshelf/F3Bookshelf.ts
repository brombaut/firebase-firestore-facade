import { F3Wrapper } from "./../firestore/F3Wrapper";
import { F3Interfacer } from "./../firestore/F3Interfacer";
import { Book } from "./Book";
import { FirestoreBook } from "./FirestoreBook";
import { firebaseConfig } from "./firebase.config";

export class F3Bookshelf implements F3Interfacer<FirestoreBook, Book> {
  private _f3: F3Wrapper<FirestoreBook, Book>;
  private _collection: string = 'books';
  private _mapper: (o: FirestoreBook) => Book = 
    (o: FirestoreBook) => new Book(o);

  constructor() {
    this._f3 = new F3Wrapper<FirestoreBook, Book>(
      firebaseConfig, this._collection, this._mapper
    )
  }
  async get(): Promise<Book[]> {
    return await this._f3.get();
  }
  put(t: Book): Promise<Book> {
    throw new Error("Method not implemented.");
  }
  post(t: FirestoreBook): Promise<Book> {
    throw new Error("Method not implemented.");
  }
  delete(t: Book): Promise<void> {
    throw new Error("Method not implemented.");
  }
}