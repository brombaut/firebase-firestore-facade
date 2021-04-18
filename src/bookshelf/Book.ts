import { FirestoreBook } from './FirestoreBook';
import { Shelf } from './Shelf';
import { DateTranslator } from '../DateTranslator';

export class Book {
  private _id: string;
  private _isbn13: string;
  private _title: string;
  private _shortTitle: string;
  private _authors: Array<string>;
  private _numPages: number;
  private _link: string;
  private _shelf: Shelf;
  private _onPage: number | null;
  private _dateStarted: Date | null;
  private _dateFinished: Date | null;
  private _rating: number | null;

  constructor(dto: FirestoreBook) {
    if (!dto.id) {
      throw new Error('DTO does not have an ID');
    }
    this._id = dto.id as string;
    this._isbn13 = dto.isbn13;
    this._title = dto.title;
    this._shortTitle = dto.shortTitle;
    this._authors = dto.authors;
    this._numPages = dto.numPages;
    this._link = dto.link;
    this._shelf = dto.shelf;
    this._onPage = dto.onPage;
    if (dto.dateStarted) {
      this._dateStarted = new DateTranslator().fromFirestoreDate(dto.dateStarted).toDate();
    } else {
      this._dateStarted = null;
    }
    if (dto.dateFinished) {
      this._dateFinished = new DateTranslator().fromFirestoreDate(dto.dateFinished).toDate();
    } else {
      this._dateFinished = null;
    }
    this._rating = dto.rating;
  }

  get id(): string {
    return this._id;
  }
  get isbn13(): string {
    return this._isbn13;
  }
  get title(): string {
    return this._title;
  }
  get shortTitle(): string {
    return this._shortTitle;
  }
  get authors(): string[] {
    return this._authors;
  }
  get numPages(): number {
    return this._numPages;
  }
  get link(): string {
    return this._link;
  }
  get shelf(): Shelf {
    return this._shelf;
  }
  get onPage(): number | null {
    return this._onPage;
  }
  get dateStarted(): Date | null {
    return this._dateStarted;
  }
  get dateFinished(): Date | null {
    return this._dateFinished;
  }
  get rating(): number | null {
    return this._rating;
  }

  startReading(): void {
    if (this._shelf !== Shelf.TOREAD) {
      throw new Error('Book has already been read');
    }
    this._shelf = Shelf.CURRENTLYREADING;
    this._dateStarted = new DateTranslator().now().toDate();
    this._onPage = 0;
  }

  finishedReading(): void {
    if (this._shelf !== Shelf.CURRENTLYREADING) {
      throw new Error('Book is not currently being read');
    }
    this._shelf = Shelf.READ;
    this._dateFinished = new DateTranslator().now().toDate();
    this._onPage = this._numPages;
  }

  toDTO(): FirestoreBook {
    let sDate = null;
    if (this._dateStarted) {
      sDate = new DateTranslator().fromDate(this._dateStarted).toFirestoreDate();
    }
    let fDate = null;
    if (this._dateFinished) {
      fDate = new DateTranslator().fromDate(this._dateFinished).toFirestoreDate();
    }
    return {
      id: this._id,
      isbn13: this._isbn13,
      title: this._title,
      shortTitle: this._shortTitle,
      authors: this._authors,
      numPages: this._numPages,
      link: this._link,
      shelf: this._shelf,
      onPage: this._onPage,
      dateStarted: sDate,
      dateFinished: fDate,
      rating: this._rating,
    }
  }
}
