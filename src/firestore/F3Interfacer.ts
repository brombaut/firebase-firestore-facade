export interface F3Interfacer<FirebaseType, LocalType> {
  get(): Promise<LocalType[]>;
  put(t: LocalType): Promise<LocalType>;
  post(t: FirebaseType): Promise<LocalType>;
  delete(t: LocalType): Promise<void>;
}