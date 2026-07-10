// // import { Component, inject, signal } from '@angular/core';
// // import { FormsModule } from '@angular/forms';
// // import { Router } from '@angular/router';
// // import { AuthService } from '../../core/services/auth.service';
// // import { UserRole } from '../../core/models/user.model';

// // @Component({
// //   selector: 'app-login',
// //   standalone: true,
// //   imports: [FormsModule],
// //   templateUrl: './login.component.html',
// //   styleUrl: './login.component.scss',
// // })
// // export class LoginComponent {
// //   private readonly authService = inject(AuthService);
// //   private readonly router = inject(Router);

// //   mode = signal<'sign-in' | 'sign-up'>('sign-in');
// //   email = '';
// //   password = '';
// //   name = '';
// //   role: UserRole = 'employee';

// //   loading = signal(false);
// //   errorMessage = signal<string | null>(null);

// //   toggleMode(): void {
// //     this.mode.set(this.mode() === 'sign-in' ? 'sign-up' : 'sign-in');
// //     this.errorMessage.set(null);
// //   }

// //   async submit(): Promise<void> {
// //     this.errorMessage.set(null);
// //     this.loading.set(true);
// //     try {
// //       if (this.mode() === 'sign-in') {
// //         await this.authService.signIn(this.email, this.password);
// //       } else {
// //         if (!this.name.trim()) {
// //           this.errorMessage.set('Please enter your name.');
// //           return;
// //         }
// //         await this.authService.signUp(this.email, this.password, this.name.trim(), this.role);
// //       }
// //       const destination = this.authService.profile()?.role === 'manager' ? '/manager' : '/employee';
// //       await this.router.navigate([destination]);
// //     } catch (err) {
// //       this.errorMessage.set(toErrorMessage(err));
// //     } finally {
// //       this.loading.set(false);
// //     }
// //   }
// // }

// // function toErrorMessage(err: unknown): string {
// //   if (err && typeof err === 'object' && 'code' in err) {
// //     const code = String((err as { code: unknown }).code);
// //     if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
// //       return 'Incorrect email or password.';
// //     }
// //     if (code.includes('email-already-in-use')) {
// //       return 'An account with this email already exists.';
// //     }
// //     if (code.includes('weak-password')) {
// //       return 'Password should be at least 6 characters.';
// //     }
// //   }
// //   return 'Something went wrong. Please try again.';
// // }
// import { Component, inject, signal } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../core/services/auth.service';
// import { UserRole } from '../../core/models/user.model';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
// })
// export class LoginComponent {
//   private readonly authService = inject(AuthService);
//   private readonly router = inject(Router);

//   mode = signal<'sign-in' | 'sign-up'>('sign-in');

//   email = '';
//   password = '';
//   name = '';
//   role: UserRole = 'employee';

//   loading = signal(false);
//   errorMessage = signal<string | null>(null);

//   // NEW
//   showPassword = signal(false);

//   togglePassword(): void {
//     this.showPassword.update(value => !value);
//   }

//   toggleMode(): void {
//     this.mode.set(this.mode() === 'sign-in' ? 'sign-up' : 'sign-in');
//     this.errorMessage.set(null);

//     this.email = '';
//     this.password = '';
//     this.name = '';
//     this.role = 'employee';
//   }

//   async submit(): Promise<void> {
//     this.errorMessage.set(null);
//     this.loading.set(true);

//     try {
//       if (this.mode() === 'sign-in') {
//         await this.authService.signIn(this.email, this.password);
//       } else {
//         if (!this.name.trim()) {
//           this.errorMessage.set('Please enter your name.');
//           return;
//         }

//         await this.authService.signUp(
//           this.email,
//           this.password,
//           this.name.trim(),
//           this.role
//         );
//       }

//       const role = this.authService.profile()?.role;

//       console.log('Role:', role);

//       if (role === 'manager') {
//         await this.router.navigate(['/manager']);
//       } else {
//         await this.router.navigate(['/employee']);
//       }

//     } catch (err) {
//       this.errorMessage.set(toErrorMessage(err));
//     } finally {
//       this.loading.set(false);
//     }
//   }
// }

// function toErrorMessage(err: unknown): string {
//   if (err && typeof err === 'object' && 'code' in err) {
//     const code = String((err as { code: unknown }).code);

//     if (
//       code.includes('user-not-found') ||
//       code.includes('wrong-password') ||
//       code.includes('invalid-credential')
//     ) {
//       return 'Incorrect email or password.';
//     }

//     if (code.includes('email-already-in-use')) {
//       return 'An account with this email already exists.';
//     }

//     if (code.includes('weak-password')) {
//       return 'Password should be at least 6 characters.';
//     }
//   }

//   return 'Something went wrong. Please try again.';
// }
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  mode = signal<'sign-in' | 'sign-up'>('sign-in');

  email = '';
  password = '';
  name = '';
  role: UserRole = 'employee';

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleMode(): void {
    this.mode.set(this.mode() === 'sign-in' ? 'sign-up' : 'sign-in');
    this.errorMessage.set(null);

    this.email = '';
    this.password = '';
    this.name = '';
    this.role = 'employee';
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);
    this.loading.set(true);

    try {
      let role: UserRole;

      if (this.mode() === 'sign-in') {
        const profile = await this.authService.signIn(
          this.email,
          this.password
        );

        role = profile.role;
      } else {
        if (!this.name.trim()) {
          this.errorMessage.set('Please enter your name.');
          return;
        }

        await this.authService.signUp(
          this.email,
          this.password,
          this.name.trim(),
          this.role
        );

        role = this.role;
      }

      console.log('Role:', role);

      if (role === 'manager') {
        await this.router.navigate(['/manager']);
      } else {
        await this.router.navigate(['/employee']);
      }
    } catch (err) {
      this.errorMessage.set(toErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}

function toErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = String((err as { code: unknown }).code);

    if (
      code.includes('user-not-found') ||
      code.includes('wrong-password') ||
      code.includes('invalid-credential')
    ) {
      return 'Incorrect email or password.';
    }

    if (code.includes('email-already-in-use')) {
      return 'An account with this email already exists.';
    }

    if (code.includes('weak-password')) {
      return 'Password should be at least 6 characters.';
    }
  }

  return 'Something went wrong. Please try again.';
}