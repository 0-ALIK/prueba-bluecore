import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SharedAuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sharedAuthService = inject(SharedAuthService);
  const token = sharedAuthService.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
