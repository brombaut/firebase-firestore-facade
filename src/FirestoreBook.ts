import { Shelf } from "./Shelf";
import { FirestoreDate } from "./FirestoreDate";

export interface FirestoreBook {
  id: string;
  isbn13: string;
  title: string;
  shortTitle: string;
  authors: Array<string>;
  numPages: number;
  link: string;
  shelf: Shelf;
  onPage?: number;
  dateStarted?: FirestoreDate;
  dateFinished?: FirestoreDate;
  rating?: number;
}