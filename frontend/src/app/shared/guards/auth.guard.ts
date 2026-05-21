import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedAuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const sharedAuthService = inject(SharedAuthService);

  if (sharedAuthService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
