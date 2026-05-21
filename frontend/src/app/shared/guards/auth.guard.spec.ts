import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authGuard } from './auth.guard';
import { SharedAuthService } from '../services/auth.service';

describe('authGuard', () => {
  let sharedAuthService: SharedAuthService;
  let routerMock: { navigate: ReturnType<typeof vi.fn>; createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();

    routerMock = {
      navigate: vi.fn(),
      createUrlTree: vi.fn().mockReturnValue('/login'),
    };

    TestBed.configureTestingModule({
      providers: [
        SharedAuthService,
        { provide: Router, useValue: routerMock },
      ],
    });

    sharedAuthService = TestBed.inject(SharedAuthService);
  });

  it('deberia permitir acceso si el usuario esta autenticado', () => {
    sharedAuthService.setToken('valid_token', {
      id: '1',
      name: 'Juan',
      lastName: 'Perez',
      email: 'juan@test.com',
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).toBe(true);
  });

  it('deberia redirigir a /login si el usuario no esta autenticado', () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).not.toBe(true);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});