// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// export const managerGuard: CanActivateFn = async () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   // Wait until Firebase auth is resolved
//   while (authService.firebaseUser() === undefined) {
//     await new Promise(resolve => setTimeout(resolve, 50));
//   }

//   // Not logged in
//   if (!authService.firebaseUser()) {
//     return router.parseUrl('/login');
//   }

//   // Wait until Firestore profile is loaded
//   while (authService.profile() === null) {
//     await new Promise(resolve => setTimeout(resolve, 50));
//   }

//   return authService.profile()!.role === 'manager'
//     ? true
//     : router.parseUrl('/employee');
// };
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const managerGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for Firebase Auth
  while (authService.firebaseUser() === undefined) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (!authService.firebaseUser()) {
    return router.parseUrl('/login');
  }

  // Wait for Firestore profile to finish loading
  while (authService.profile() === undefined) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  const profile = authService.profile();

  if (!profile) {
    return router.parseUrl('/login');
  }

  return profile.role === 'manager'
    ? true
    : router.parseUrl('/employee');
};