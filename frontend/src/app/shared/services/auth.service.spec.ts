import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SharedAuthService } from './auth.service';

describe('SharedAuthService', () => {
  let service: SharedAuthService;
  let routerMock: { navigate: ReturnType<typeof vi.fn>; createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();

    routerMock = {
      navigate: vi.fn(),
      createUrlTree: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SharedAuthService,
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(SharedAuthService);
  });

  it('deberia almacenar token y usuario, y reflejar estado autenticado', () => {
    const user = { id: '1', name: 'Juan', lastName: 'Perez', email: 'juan@test.com' };

    service.setToken('jwt_token_123', user);

    expect(service.isAuthenticated()).toBe('jwt_token_123');
    expect(service.token()).toBe('jwt_token_123');
    expect(service.user()).toEqual(user);
    expect(localStorage.getItem('auth_token')).toBe('jwt_token_123');
    expect(JSON.parse(localStorage.getItem('auth_user')!)).toEqual(user);
  });

  it('deberia limpiar token, usuario y redirigir a login al cerrar sesion', () => {
    const user = { id: '1', name: 'Juan', lastName: 'Perez', email: 'juan@test.com' };
    service.setToken('jwt_token_123', user);

    service.logout();

    expect(service.isAuthenticated()).toBeNull();
    expect(service.token()).toBeNull();
    expect(service.user()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deberia retornar null cuando no hay token en localStorage', () => {
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBeNull();
  });
});