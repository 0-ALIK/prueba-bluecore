import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '../../../shared/errors/app-error';

const { mockUserRepo, mockHashService, mockJwtService } = vi.hoisted(() => ({
  mockUserRepo: {
    findByEmail: vi.fn(),
    createUser: vi.fn(),
  },
  mockHashService: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
  mockJwtService: {
    generate: vi.fn(),
    verify: vi.fn(),
  },
}));

vi.mock('../repositories/user.repository', () => ({
  UserRepository: vi.fn(function () {
    this.findByEmail = mockUserRepo.findByEmail;
    this.createUser = mockUserRepo.createUser;
  }),
}));

vi.mock('./hash.service', () => ({
  HashService: vi.fn(function () {
    this.hash = mockHashService.hash;
    this.compare = mockHashService.compare;
  }),
}));

vi.mock('./jwt.service', () => ({
  JwtService: vi.fn(function () {
    this.generate = mockJwtService.generate;
    this.verify = mockJwtService.verify;
  }),
}));

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService();
  });

  describe('register', () => {
    const registerData = {
      name: 'Juan',
      lastName: 'Perez',
      email: 'juan@test.com',
      password: '123456',
    };

    it('deberia lanzar error 409 si el email ya existe', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: '1', email: 'juan@test.com' });

      try {
        await authService.register(registerData);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(409);
        expect((error as AppError).message).toBe('Email already exists');
      }
    });

    it('deberia registrar un usuario correctamente', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockHashService.hash.mockResolvedValue('hashed_password');
      mockUserRepo.createUser.mockResolvedValue({
        id: 'uuid-1',
        name: 'Juan',
        last_name: 'Perez',
        email: 'juan@test.com',
        password_hash: 'hashed_password',
      });

      const result = await authService.register(registerData);

      expect(mockHashService.hash).toHaveBeenCalledWith('123456');
      expect(mockUserRepo.createUser).toHaveBeenCalledWith({
        name: 'Juan',
        lastName: 'Perez',
        email: 'juan@test.com',
        passwordHash: 'hashed_password',
      });
      expect(result).toEqual({
        id: 'uuid-1',
        name: 'Juan',
        lastName: 'Perez',
        email: 'juan@test.com',
      });
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'juan@test.com',
      password: '123456',
    };

    const dbUser = {
      id: 'uuid-1',
      name: 'Juan',
      last_name: 'Perez',
      email: 'juan@test.com',
      password_hash: 'hashed_password',
    };

    it('deberia lanzar error 401 si el usuario no existe', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      try {
        await authService.login(loginData);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(401);
        expect((error as AppError).message).toBe('Invalid credentials');
      }
    });

    it('deberia lanzar error 401 si la contrasena es incorrecta', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(dbUser);
      mockHashService.compare.mockResolvedValue(false);

      try {
        await authService.login(loginData);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(401);
        expect((error as AppError).message).toBe('Invalid credentials');
      }
    });

    it('deberia retornar token y usuario con login exitoso', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(dbUser);
      mockHashService.compare.mockResolvedValue(true);
      mockJwtService.generate.mockReturnValue('jwt_token');

      const result = await authService.login(loginData);

      expect(mockHashService.compare).toHaveBeenCalledWith('123456', 'hashed_password');
      expect(mockJwtService.generate).toHaveBeenCalledWith({
        sub: 'uuid-1',
        email: 'juan@test.com',
      });
      expect(result).toEqual({
        token: 'jwt_token',
        user: {
          id: 'uuid-1',
          name: 'Juan',
          lastName: 'Perez',
          email: 'juan@test.com',
        },
      });
    });
  });
});