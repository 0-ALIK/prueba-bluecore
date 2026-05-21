import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  AuthApiService,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from '../api/services/auth.api.service';
import { UserDto } from '../api/dtos/auth.dto';
import { SharedAuthService } from '../../../shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(AuthApiService);
  private router = inject(Router);
  private sharedAuthService = inject(SharedAuthService);

  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  login(data: LoginPayload): Observable<LoginResponse> {
    this.setLoading(true);
    this.clearError();
    return this.api.login(data).pipe(
      tap({
        next: (response) => {
          this.sharedAuthService.setToken(response.token, response.user);
          this.router.navigate(['/panel']);
        },
        error: (err) => this.setError(err.error.message || 'Error al iniciar sesión'),
        finalize: () => this.setLoading(false),
      })
    );
  }

  register(data: RegisterPayload): Observable<UserDto> {
    this.setLoading(true);
    this.clearError();
    return this.api.register(data).pipe(
      tap({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => this.setError(err.error.message || 'Error al registrarse'),
        finalize: () => this.setLoading(false),
      })
    );
  }

  private setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  private setError(error: string): void {
    this.errorSignal.set(error);
  }

  private clearError(): void {
    this.errorSignal.set(null);
  }
}
