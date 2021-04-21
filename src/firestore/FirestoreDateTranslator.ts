import { FirestoreDate } from './FirestoreDate';

export class FirestoreDateTranslator {
  private _date!: Date;

  now(): FirestoreDateTranslator {
    this._date = new Date();
    return this;
  }

  fromDate(date: Date): FirestoreDateTranslator {
    this._date = date;
    return this;
  }

  toDate(): Date {
    return this._date;
  }

  fromFirestoreDate(date: FirestoreDate): FirestoreDateTranslator {
    this._date = new Date(date.seconds * 1000);
    return this;
  }

  toFirestoreDate(): FirestoreDate {
    return {
      seconds: Math.floor(this._date.getTime() / 1000),
      nanoseconds: 0,
    };
  }
}
