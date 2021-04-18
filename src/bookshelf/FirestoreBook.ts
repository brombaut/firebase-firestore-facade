import { FirestoreDate } from '../firestore/FirestoreDate';
import { Shelf } from './Shelf';

export interface FirestoreBook {
  id?: string | null;
  isbn13: string;
  title: string;
  shortTitle: string;
  authors: Array<string>;
  numPages: number;
  link: string;
  shelf: Shelf;
  onPage: number | null;
  dateStarted: FirestoreDate | null;
  dateFinished: FirestoreDate | null;
  rating: number | null;
}
