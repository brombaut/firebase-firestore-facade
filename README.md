<h1>F3 - Firebase Firestore Facade</h1>

[![CI](https://github.com/brombaut/firebase-firestore-facade/actions/workflows/build.yml/badge.svg)](https://github.com/brombaut/firebase-firestore-facade/actions/workflows/build.yml)
[![Codecov](https://img.shields.io/codecov/c/github/brombaut/firebase-firestore-facade)](https://app.codecov.io/gh/brombaut/firebase-firestore-facade)
[![npm](https://img.shields.io/npm/v/firebase-firestore-facade)](https://www.npmjs.com/package/firebase-firestore-facade)
![David](https://img.shields.io/david/brombaut/firebase-firestore-facade)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/firebase-firestore-facade)

<p>

Facade package for the [Firebase](https://www.npmjs.com/package/firebase) package ([Official Docs](https://firebase.google.com/docs/firestore/)). Simplifies the interface of the [Firestore](https://www.npmjs.com/package/@firebase/firestore) module to a CRUD app with minimal setup.

</p>

<h2>Installing</h2>

<p>

For the latest version:

</p>

```bash
npm i firebase-firestore-facade
```

<h2>Modules</h2>

<h4><b>F3Interfacer</b></h4>

<p>

Main interface that is parameterized with the class that will be used to represent the records in the Firestore database (must implement ILocalType).

</p>

```typescript
interface F3Interfacer<LocalType> {
  get(): Promise<LocalType[]>;
  getById(id: string): Promise<LocalType>;
  put(t: ILocalType): Promise<LocalType>;
  post(t: IFirestoreType): Promise<LocalType>;
  delete(t: ILocalType): Promise<void>;
}
```

<h4><b>F3Wrapper</b></h4>

<p>

You can use this class directly, or create an additional wrapper class for your specific collection (see the bookshelf example below). Its constructor takes a Firebase configuration object which implements `FirebaseConfigurer` (see below), the `string` name of the collection you want to connect to, and a mapper function that takes an `IFirestoreType` and returns a `LocalType`.

</p>

```typescript
class F3Wrapper<LocalType> implements F3Interfacer<LocalType> {
  private _config: FirebaseConfigurer;
  private _collection: string;
  private _mapper: (o: IFirestoreType) => LocalType;
  constructor(config: FirebaseConfigurer, collection: string, mapper: (o: IFirestoreType) => LocalType) {
    this._config = config;
    this._collection = collection;
    this._mapper = mapper;
  }

  async get(): Promise<LocalType[]> {
    ...
  }
  async getById(id: string): Promise<LocalType> {
    ...
  }
  async put(t: ILocalType): Promise<LocalType> {
    ...
  }
  async post(t: IFirestoreType): Promise<LocalType> {
    ...
  }
  async delete(t: ILocalType): Promise<void> {
    ...
  }
}
```

<h4><b>IFirestoreType</b></h4>

<p>

A class should be created that acts as a data transfer object between the raw attributes of the records being stored in the Firestore database and the local object that you will use to represent the records on the frontend (see <b>ILocalType</b> below). This class should implement the `IFirestoreType` interface, which must have an `id: string` attribute.

</p>

```typescript
export interface IFirestoreType {
  id: string;
}
```

<h4><b>ILocalType</b></h4>
<p>

Classes that implement the `ILocalType` interface must have an `id: string` attribute and a `toFirestoreType(): IFirestoreType` method.

</p>

```typescript
interface ILocalType {
  id: string;
  toFirestoreType(): IFirestoreType;
}
```

<h4><b>FirebaseConfigurer</b></h4>

<p>

See the [Firebase project configuration docs](https://firebase.google.com/docs/web/setup#config-object)

</p>

```typescript
interface FirebaseConfigurer {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  auth?: FirebaseAuthentication;
}

interface FirebaseAuthentication {
  email: string;
  password: string;
}
```

<h2>Recommended Usage</h2>

<h3><b>Example - Bookshelf</b></h3>

<p>

We will use the idea of a bookshelf to demonstrate how to use F3. Lets say that we have a `books` collection in our Firestore database, and each of these records only has a `title` attribute.

</p>

<h4><b>FirestoreBook</b></h4>

<p>

We create a `FirestoreBook` class that implements the `IFirestoreType` interface. This class has a `title` attribute, as well as the `id` attribute. Notice that, even though the records in the Firestore collection might not have an `id` attribute, they can be generated automatically by Firestore.

</p>

```typescript
class FirestoreBook implements IFirestoreType {
  id: string;
  title: string;
}
```

<h4><b>Book</b></h4>

<p>

We create a `Book` class that implements the `ILocalType` interface. We have an `id` getter, and a method `toFirestoreType` that returns the object as a `FirestoreBook`, which implements the `IFirestoreType` interface.

</p>

```typescript
class Book implements ILocalType {
  private _id: string;
  private _title: string;

  constructor(dto: FirestoreBook) {
    if (!dto.id) {
      throw new Error('DTO does not have an ID');
    }
    this._id = dto.id;
    this._title = dto.title;
  }

  toFirestoreType(): FirestoreBook {
    return {
      id: this._id,
      title: this._title,
    };
  }

  get id(): string {
    return this._id;
  }
  get title(): string {
    return this._title;
  }
}
```

<h4><b>F3Bookshelf</b></h4>

<p>

Finally, we create a class `F3Bookshelf`, which will act as our facade between the Firestore database and our frontend. This class implements the `F3Interfacer` interface parameterized with our `Book` type. We have an `F3Wrapper` attribute (again, parameterized with our `Book` type), a `string` of the name of our Firestore collection (in our case `books`), and a `(o: IFirestoreType) => Book` function, which is used to map our `FirestoreBook` objects to their associated `Book` objects.

We instantiate the `F3Wrapper` in the constructor, including the `firebaseConfig` object, which must implement the `FirebaseConfigurer` interface (see above).

</p>

```typescript
class F3Bookshelf implements F3Interfacer<Book> {
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
```
