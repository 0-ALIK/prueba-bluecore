import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./ui/pages/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./ui/pages/register.page').then(m => m.RegisterPage),
  },
];
