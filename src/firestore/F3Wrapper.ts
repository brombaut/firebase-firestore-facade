import { F3Interfacer } from './F3Interfacer';
import { FirebaseConfigurer } from './FirebaseConfigurer';
import { FirestoreBase } from './FirestoreBase';
import { FirestoreCollection } from './FirestoreCollection';
import { IFirestoreType } from './IFirestoreType';
import { ILocalType } from './ILocalType';

export class F3Wrapper<LocalType> implements F3Interfacer<LocalType> {
  private _config: FirebaseConfigurer;
  private _collection: string;
  private _mapper: (o: IFirestoreType) => LocalType;
  constructor(config: FirebaseConfigurer, collection: string, mapper: (o: IFirestoreType) => LocalType) {
    this._config = config;
    this._collection = collection;
    this._mapper = mapper;
  }

  async get(): Promise<LocalType[]> {
    const collection: FirestoreCollection<LocalType> = await this.getConnection();
    const result = await collection.get();
    await collection.close();
    return result;
  }
  async getById(id: string): Promise<LocalType> {
    const collection: FirestoreCollection<LocalType> = await this.getConnection();
    const result = await collection.getById(id);
    await collection.close();
    return result;
  }
  async put(t: ILocalType): Promise<LocalType> {
    const collection: FirestoreCollection<LocalType> = await this.getConnection();
    const result = await collection.update(t.toFirestoreType());
    await collection.close();
    return result;
  }
  async post(t: IFirestoreType): Promise<LocalType> {
    const collection: FirestoreCollection<LocalType> = await this.getConnection();
    const result = await collection.add(t);
    await collection.close();
    return result;
  }
  async delete(t: ILocalType): Promise<void> {
    const collection: FirestoreCollection<LocalType> = await this.getConnection();
    await collection.deleteById(t.id);
    await collection.close();
  }

  private async getConnection(): Promise<FirestoreCollection<LocalType>> {
    const base = await new FirestoreBase(this._config).init();
    const collection: FirestoreCollection<LocalType> = new FirestoreCollection<LocalType>(
      base,
      this._collection,
      this._mapper,
    );
    return collection;
  }

  // async connectToFirestore() {
  //   const base = await new FirestoreBase(firebaseConfig).init();
  //   const mapper: (o: FirestoreBook) => Book =
  //     (o: FirestoreBook) => new Book(o);
  //   const booksCollection: FirestoreCollection<FirestoreBook, Book> =
  //     new FirestoreCollection<FirestoreBook, Book>(base, 'books', mapper);
  //   const books = await booksCollection.get();
  //   console.log(books);
  //   await base.close();
  // }
}
