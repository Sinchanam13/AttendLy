import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { managerGuard } from './core/guards/manager.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'employee',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/employee/employee-dashboard/employee-dashboard.component').then(
        (m) => m.EmployeeDashboardComponent,
      ),
  },
  {
    path: 'manager',
    canActivate: [authGuard, managerGuard],
    loadComponent: () =>
      import('./features/manager/manager-dashboard/manager-dashboard.component').then(
        (m) => m.ManagerDashboardComponent,
      ),
  },
  { path: '**', redirectTo: 'login' },
];
