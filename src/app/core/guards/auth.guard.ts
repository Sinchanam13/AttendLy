import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Waits for the initial Firebase auth state, then allows or redirects. */
export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await waitForAuthResolved(authService);

  if (authService.firebaseUser()) {
    return true;
  }
  return router.parseUrl('/login');
};

function waitForAuthResolved(authService: AuthService): Promise<void> {
  return new Promise((resolve) => {
    if (authService.firebaseUser() !== undefined) {
      resolve();
      return;
    }
    const check = setInterval(() => {
      if (authService.firebaseUser() !== undefined) {
        clearInterval(check);
        resolve();
      }
    }, 50);
  });
}
