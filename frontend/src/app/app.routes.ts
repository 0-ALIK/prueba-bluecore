import { Routes } from '@angular/router';
import { authRoutes } from './modules/auth/auth.routes';
import { creditApplicationRoutes } from './modules/credit-application/credit-application.routes';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    children: creditApplicationRoutes,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
