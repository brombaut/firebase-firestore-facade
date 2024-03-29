import { FirebaseAuthentication } from './FirebaseAuthentication';
export interface FirebaseConfigurer {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  auth?: FirebaseAuthentication;
}
