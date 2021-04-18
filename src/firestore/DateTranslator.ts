import { FirestoreDate } from './FirestoreDate';

export class DateTranslator {
  private _date!: Date;

  now(): DateTranslator {
    this._date = new Date();
    return this;
  }

  fromDate(date: Date): DateTranslator {
    this._date = date;
    return this;
  }

  toDate(): Date {
    return this._date;
  }

  fromFirestoreDate(date: FirestoreDate): DateTranslator {
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
