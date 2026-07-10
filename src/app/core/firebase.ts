import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

// A single shared Firebase app instance for the whole application.
// Kept as plain firebase-js-sdk (not @angular/fire) to keep the dependency
// surface small for a below-medium scope app.
const firebaseApp: FirebaseApp = initializeApp(environment.firebase);
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
