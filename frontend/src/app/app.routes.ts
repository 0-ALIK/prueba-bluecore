import { Routes } from '@angular/router';
import { creditApplicationRoutes } from './modules/credit-application/credit-application.routes';

export const routes: Routes = [
  {
    path: '',
    children: creditApplicationRoutes,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
