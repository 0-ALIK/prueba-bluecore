import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '../../../shared/errors/app-error';

const { mockRepo } = vi.hoisted(() => ({
  mockRepo: {
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

vi.mock('../repositories/credit-application.repository', () => ({
  CreditApplicationRepository: vi.fn(function () {
    this.create = mockRepo.create;
    this.findById = mockRepo.findById;
    this.findAll = mockRepo.findAll;
    this.updateStatus = mockRepo.updateStatus;
  }),
}));

import { CreditApplicationService } from './credit-application.service';

describe('CreditApplicationService', () => {
  let service: CreditApplicationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CreditApplicationService();
  });

  describe('create', () => {
    it('deberia lanzar error 400 si el monto es menor a 500', async () => {
      try {
        await service.create({ amount: 100, term: 12, cardId: 'card-1' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(400);
        expect((error as AppError).message).toBe('Amount must be between $500 and $50,000');
      }
    });

    it('deberia lanzar error 400 si el monto es mayor a 50000', async () => {
      try {
        await service.create({ amount: 60000, term: 12, cardId: 'card-1' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(400);
      }
    });

    it('deberia lanzar error 400 si el plazo es menor a 6', async () => {
      try {
        await service.create({ amount: 1000, term: 3, cardId: 'card-1' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(400);
        expect((error as AppError).message).toBe('Term must be between 6 and 60 months');
      }
    });

    it('deberia lanzar error 400 si el plazo es mayor a 60', async () => {
      try {
        await service.create({ amount: 1000, term: 72, cardId: 'card-1' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(400);
      }
    });

    it('deberia crear una solicitud correctamente', async () => {
      const dbResult = {
        id: 'uuid-1',
        amount: 5000,
        term: 12,
        status: 'PENDING',
        card_id: 'card-1',
        user_id: null,
        comment: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockRepo.create.mockResolvedValue(dbResult);

      const result = await service.create({ amount: 5000, term: 12, cardId: 'card-1' });

      expect(mockRepo.create).toHaveBeenCalledWith({
        amount: 5000,
        term: 12,
        cardId: 'card-1',
      });
      expect(result.id).toBe('uuid-1');
      expect(result.amount).toBe(5000);
      expect(result.term).toBe(12);
      expect(result.status).toBe('PENDING');
    });
  });

  describe('getById', () => {
    it('deberia lanzar error 404 si la solicitud no existe', async () => {
      mockRepo.findById.mockResolvedValue(null);

      try {
        await service.getById('non-existent-id');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
        expect((error as AppError).message).toBe('Credit application not found');
      }
    });

    it('deberia retornar la solicitud con usuario cuando existe', async () => {
      const dbResult = {
        id: 'uuid-1',
        amount: 5000,
        term: 12,
        status: 'PENDING',
        card_id: 'card-1',
        user_id: 'user-1',
        comment: null,
        created_at: new Date(),
        updated_at: new Date(),
        user: {
          id: 'user-1',
          name: 'Juan',
          last_name: 'Perez',
          email: 'juan@test.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
      };
      mockRepo.findById.mockResolvedValue(dbResult);

      const result = await service.getById('uuid-1');

      expect(result.id).toBe('uuid-1');
      expect(result.user).toEqual({
        id: 'user-1',
        name: 'Juan',
        lastName: 'Perez',
        email: 'juan@test.com',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('getAll', () => {
    it('deberia retornar resultados paginados', async () => {
      const dbData = [
        { id: '1', amount: 5000, term: 12, status: 'PENDING', card_id: 'c1', created_at: new Date(), updated_at: new Date() },
        { id: '2', amount: 10000, term: 24, status: 'APPROVED', card_id: 'c2', created_at: new Date(), updated_at: new Date() },
      ];
      mockRepo.findAll.mockResolvedValue({ data: dbData, total: 2 });

      const result = await service.getAll({ limit: 10, page: 1 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination).toEqual({
        total: 2,
        limit: 10,
        page: 1,
        totalPages: 1,
      });
    });

    it('deberia usar valores por defecto si no se pasan filtros', async () => {
      mockRepo.findAll.mockResolvedValue({ data: [], total: 0 });

      const result = await service.getAll({});

      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.page).toBe(1);
    });
  });

  describe('updateStatus', () => {
    it('deberia lanzar error 404 si la solicitud no existe', async () => {
      mockRepo.findById.mockResolvedValue(null);

      try {
        await service.updateStatus({
          id: 'non-existent',
          status: 'APPROVED',
          comment: 'Aprobado',
          userId: 'user-1',
        });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
        expect((error as AppError).message).toBe('Credit application not found');
      }
    });

    it('deberia lanzar error 400 si la solicitud no esta PENDING', async () => {
      mockRepo.findById.mockResolvedValue({
        id: 'uuid-1',
        status: 'APPROVED',
      });

      try {
        await service.updateStatus({
          id: 'uuid-1',
          status: 'REJECTED',
          comment: 'Rechazado',
          userId: 'user-1',
        });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(400);
        expect((error as AppError).message).toBe('Credit application can only be updated when status is PENDING');
      }
    });

    it('deberia actualizar el estado correctamente cuando esta PENDING', async () => {
      mockRepo.findById.mockResolvedValue({
        id: 'uuid-1',
        amount: 5000,
        term: 12,
        status: 'PENDING',
        card_id: 'card-1',
        user_id: null,
        comment: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
      mockRepo.updateStatus.mockResolvedValue({
        id: 'uuid-1',
        amount: 5000,
        term: 12,
        status: 'APPROVED',
        card_id: 'card-1',
        user_id: 'user-1',
        comment: 'Aprobado',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await service.updateStatus({
        id: 'uuid-1',
        status: 'APPROVED',
        comment: 'Aprobado',
        userId: 'user-1',
      });

      expect(mockRepo.updateStatus).toHaveBeenCalledWith({
        id: 'uuid-1',
        status: 'APPROVED',
        comment: 'Aprobado',
        userId: 'user-1',
      });
      expect(result.status).toBe('APPROVED');
    });
  });
});