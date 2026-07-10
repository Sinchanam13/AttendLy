
// import { Injectable, signal } from '@angular/core';
// import {
//   User,
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
// } from 'firebase/auth';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { auth, db } from '../firebase';
// import { AppUser, UserRole } from '../models/user.model';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   /** Firebase user. undefined = loading */
//   readonly firebaseUser = signal<User | null | undefined>(undefined);

//   /** Profile. undefined = loading, null = not found */
//   readonly profile = signal<AppUser | null | undefined>(undefined);

//   constructor() {
//     onAuthStateChanged(auth, async (user) => {
//       this.firebaseUser.set(user);

//       if (!user) {
//         this.profile.set(null);
//         return;
//       }

//       const snap = await getDoc(doc(db, 'users', user.uid));

//       if (snap.exists()) {
//         this.profile.set(snap.data() as AppUser);
//       } else {
//         this.profile.set(null);
//       }
//     });
//   }

//   // async signIn(email: string, password: string): Promise<void> {
//   //   await signInWithEmailAndPassword(auth, email, password);
//   // }

//   async signIn(email: string, password: string): Promise<AppUser> {
//   const credential = await signInWithEmailAndPassword(
//     auth,
//     email,
//     password
//   );

//   const snap = await getDoc(doc(db, 'users', credential.user.uid));

//   if (!snap.exists()) {
//     throw new Error('User profile not found.');
//   }

//   const profile = snap.data() as AppUser;

//   this.profile.set(profile);

//   return profile;
// }

//   async signUp(
//     email: string,
//     password: string,
//     name: string,
//     role: UserRole
//   ): Promise<void> {
//     const credential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );

//     const profile: AppUser = {
//       uid: credential.user.uid,
//       email,
//       name,
//       role,
//     };

//     await setDoc(doc(db, 'users', credential.user.uid), profile);

//     this.profile.set(profile);
//   }

//   async signOut(): Promise<void> {
//     await signOut(auth);
//   }
// }
import { Injectable, signal } from '@angular/core';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AppUser, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly firebaseUser = signal<User | null | undefined>(undefined);
  readonly profile = signal<AppUser | null | undefined>(undefined);

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      this.firebaseUser.set(user);

      if (!user) {
        this.profile.set(null);
        return;
      }

      const snap = await getDoc(doc(db, 'users', user.uid));

      if (snap.exists()) {
        this.profile.set(snap.data() as AppUser);
      } else {
        this.profile.set(null);
      }
    });
  }

  async signIn(email: string, password: string): Promise<AppUser> {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const snap = await getDoc(doc(db, 'users', credential.user.uid));

    if (!snap.exists()) {
      throw new Error('User profile not found.');
    }

    const profile = snap.data() as AppUser;

    this.profile.set(profile);

    return profile;
  }

  async signUp(
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<void> {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const profile: AppUser = {
      uid: credential.user.uid,
      email,
      name,
      role,
    };

    await setDoc(doc(db, 'users', credential.user.uid), profile);

    this.profile.set(profile);
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }
}