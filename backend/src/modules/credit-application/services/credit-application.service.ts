import { AppError } from '../../../shared/errors/app-error';
import { CreditApplicationRepository } from '../repositories/credit-application.repository';

type CreateCreditApplicationInput = {
  amount: number;
  term: number;
  cardId: string;
};

type GetAllFilters = {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  limit?: number;
  page?: number;
};

type UpdateStatusInput = {
  id: string;
  status: 'APPROVED' | 'REJECTED';
  comment: string;
  userId: string;
};

export class CreditApplicationService {
  private readonly creditApplicationRepository = new CreditApplicationRepository();

  async create(data: CreateCreditApplicationInput) {
    const { amount, term, cardId } = data;

    if (amount < 500 || amount > 50000) {
      throw new AppError('Amount must be between $500 and $50,000', 400);
    }

    if (term < 6 || term > 60) {
      throw new AppError('Term must be between 6 and 60 months', 400);
    }

    const creditApplication = await this.creditApplicationRepository.create({
      amount,
      term,
      cardId,
    });

    return {
      id: creditApplication.id,
      amount: creditApplication.amount,
      term: creditApplication.term,
      status: creditApplication.status,
      cardId: creditApplication.card_id,
      userId: creditApplication.user_id,
      comment: creditApplication.comment,
      createdAt: creditApplication.created_at,
      updatedAt: creditApplication.updated_at,
    };
  }

  async getById(id: string) {
    const creditApplication = await this.creditApplicationRepository.findById(id);

    if (!creditApplication) {
      throw new AppError('Credit application not found', 404);
    }

    return {
      id: creditApplication.id,
      amount: creditApplication.amount,
      term: creditApplication.term,
      status: creditApplication.status,
      cardId: creditApplication.card_id,
      userId: creditApplication.user_id,
      comment: creditApplication.comment,
      createdAt: creditApplication.created_at,
      updatedAt: creditApplication.updated_at,
      user: creditApplication.user
        ? {
            id: (creditApplication.user as any).id,
            name: (creditApplication.user as any).name,
            lastName: (creditApplication.user as any).last_name,
            email: (creditApplication.user as any).email,
            createdAt: (creditApplication.user as any).created_at,
            updatedAt: (creditApplication.user as any).updated_at,
          }
        : null,
    };
  }

  async getAll(filters: GetAllFilters) {
    const { data, total } = await this.creditApplicationRepository.findAll(filters);
    const limit = filters.limit || 10;
    const page = filters.page || 1;

    return {
      data: data.map(item => ({
        id: item.id,
        amount: item.amount,
        term: item.term,
        status: item.status,
        cardId: item.card_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
      pagination: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(data: UpdateStatusInput) {
    const creditApplication = await this.creditApplicationRepository.findById(data.id);

    if (!creditApplication) {
      throw new AppError('Credit application not found', 404);
    }

    if (creditApplication.status !== 'PENDING') {
      throw new AppError('Credit application can only be updated when status is PENDING', 400);
    }

    const updated = await this.creditApplicationRepository.updateStatus(data);

    return {
      id: updated.id,
      amount: updated.amount,
      term: updated.term,
      status: updated.status,
      cardId: updated.card_id,
      userId: updated.user_id,
      comment: updated.comment,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };
  }
}
