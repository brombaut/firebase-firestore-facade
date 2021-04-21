import { F3Interfacer } from "./F3Interfacer";
import { FirebaseConfigurer } from "./FirebaseConfigurer";
import { FirestoreBase } from "./FirestoreBase";
import { FirestoreCollection } from "./FirestoreCollection";

export class F3Wrapper<FirebaseType, LocalType> implements F3Interfacer<FirebaseType, LocalType> {
  private _config: FirebaseConfigurer;
  private _collection: string;
  private _mapper: (o: FirebaseType) => LocalType;
  constructor(config: FirebaseConfigurer, collection: string, mapper: (o: FirebaseType) => LocalType) {
    this._config = config;
    this._collection = collection;
    this._mapper = mapper;
  }

  async get(): Promise<LocalType[]> {
    const base = await new FirestoreBase(this._config).init();
    const collection: FirestoreCollection<FirebaseType, LocalType> = 
      new FirestoreCollection<FirebaseType, LocalType>(base, this._collection, this._mapper);
    const result = await collection.get();
    await base.close();
    return result;
  }
  put(t: LocalType): Promise<LocalType> {
    throw new Error("Method not implemented.");
  }
  post(t: FirebaseType): Promise<LocalType> {
    throw new Error("Method not implemented.");
  }
  delete(t: LocalType): Promise<void> {
    throw new Error("Method not implemented.");
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