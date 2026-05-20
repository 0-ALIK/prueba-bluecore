import { PrismaService } from '../../../shared/services/prisma/prisma.service';
import { CreditApplication } from '../../../shared/services/prisma/prisma-client/client';

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

export class CreditApplicationRepository {
  async create(data: CreateCreditApplicationInput): Promise<CreditApplication> {
    return PrismaService.client.creditApplication.create({
      data: {
        amount: data.amount,
        term: data.term,
        card_id: data.cardId,
      },
    });
  }

  async findById(id: string): Promise<(CreditApplication & { user: unknown }) | null> {
    return PrismaService.client.creditApplication.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findAll(filters: GetAllFilters): Promise<{ data: CreditApplication[]; total: number }> {
    const { status, limit = 10, page = 1 } = filters;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [data, total] = await Promise.all([
      PrismaService.client.creditApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      PrismaService.client.creditApplication.count({ where }),
    ]);

    return { data, total };
  }

  async updateStatus(data: UpdateStatusInput): Promise<CreditApplication> {
    return PrismaService.client.creditApplication.update({
      where: { id: data.id },
      data: {
        status: data.status,
        comment: data.comment,
        user_id: data.userId,
      },
    });
  }
}
