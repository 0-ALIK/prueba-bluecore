import { z } from 'zod';

export const getAllCreditApplicationsSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10).optional(),
  page: z.coerce.number().int().positive().default(1).optional(),
});
