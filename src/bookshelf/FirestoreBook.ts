import { IFirestoreType } from './../firestore/IFirestoreType';
import { FirestoreDate } from '../firestore/FirestoreDate';
import { Shelf } from './Shelf';

export class FirestoreBook implements IFirestoreType {
  id!: string;
  goodreads_review_id!: string;
  isbn13!: string;
  title!: string;
  shortTitle!: string;
  authors!: Array<string>;
  numPages!: number;
  link!: string;
  shelf!: Shelf;
  onPage!: number | null;
  dateStarted!: FirestoreDate | null;
  dateFinished!: FirestoreDate | null;
  rating!: number | null;
}

