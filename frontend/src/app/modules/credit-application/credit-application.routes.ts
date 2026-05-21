import { Routes } from '@angular/router';
import { authGuard } from '../../shared/guards/auth.guard';

export const creditApplicationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ui/pages/create-application.page').then(m => m.CreateApplicationPage),
  },
  {
    path: 'panel',
    loadComponent: () => import('./ui/pages/panel.page').then(m => m.PanelPage),
    canActivate: [authGuard],
  },
];
